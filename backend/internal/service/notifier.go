package service

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"html/template"
	"mime"
	"mime/quotedprintable"
	"net/http"
	"net/mail"
	"net/url"
	"strings"
	"time"

	"github.com/ascend-collective/public-site-api/internal/model"
)

type InquiryNotifier interface {
	NotifyInquiry(context.Context, model.ContactSubmission, string) error
}

type noopInquiryNotifier struct{}

func (noopInquiryNotifier) NotifyInquiry(context.Context, model.ContactSubmission, string) error {
	return nil
}

type gmailInquiryNotifier struct {
	clientID     string
	clientSecret string
	refreshToken string
	from         string
	recipient    string
	httpClient   *http.Client
	tokenURL     string
	sendURL      string
}

// NewGmailAPIInquiryNotifier creates a notifier backed by Gmail's HTTPS API.
// It intentionally returns a no-op notifier when the protected OAuth settings
// are incomplete, so a missing email configuration cannot reject an accepted
// enquiry. Delivery errors are logged by the service layer after persistence.
func NewGmailAPIInquiryNotifier(clientID, clientSecret, refreshToken, from, recipient string) InquiryNotifier {
	if strings.TrimSpace(clientID) == "" || strings.TrimSpace(clientSecret) == "" || strings.TrimSpace(refreshToken) == "" || strings.TrimSpace(recipient) == "" {
		return noopInquiryNotifier{}
	}
	return &gmailInquiryNotifier{
		clientID:     strings.TrimSpace(clientID),
		clientSecret: strings.TrimSpace(clientSecret),
		refreshToken: strings.TrimSpace(refreshToken),
		from:         strings.TrimSpace(from),
		recipient:    strings.TrimSpace(recipient),
		httpClient:   &http.Client{Timeout: 10 * time.Second},
		tokenURL:     "https://oauth2.googleapis.com/token",
		sendURL:      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
	}
}

func (n *gmailInquiryNotifier) NotifyInquiry(ctx context.Context, inquiry model.ContactSubmission, _ string) error {
	if err := ctx.Err(); err != nil {
		return err
	}

	sender, err := resolveSender(n.from, n.recipient)
	if err != nil {
		return err
	}
	recipient, err := mail.ParseAddress(n.recipient)
	if err != nil {
		return fmt.Errorf("parse inquiry recipient: %w", err)
	}
	message, err := gmailMessage(sender.String(), recipient.String(), inquiry)
	if err != nil {
		return err
	}

	accessToken, err := n.accessToken(ctx)
	if err != nil {
		return fmt.Errorf("refresh Gmail API access token: %w", err)
	}
	payload := struct {
		Raw string `json:"raw"`
	}{Raw: base64.RawURLEncoding.EncodeToString(message)}
	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("encode Gmail API request: %w", err)
	}

	request, err := http.NewRequestWithContext(ctx, http.MethodPost, n.sendURL, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("create Gmail API request: %w", err)
	}
	request.Header.Set("Authorization", "Bearer "+accessToken)
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Accept", "application/json")

	response, err := n.httpClient.Do(request)
	if err != nil {
		return fmt.Errorf("send Gmail API request: %w", err)
	}
	defer response.Body.Close()
	if response.StatusCode < http.StatusOK || response.StatusCode >= http.StatusMultipleChoices {
		return fmt.Errorf("Gmail API returned HTTP %s", response.Status)
	}
	return nil
}

func (n *gmailInquiryNotifier) accessToken(ctx context.Context) (string, error) {
	form := url.Values{
		"client_id":     {n.clientID},
		"client_secret": {n.clientSecret},
		"refresh_token": {n.refreshToken},
		"grant_type":    {"refresh_token"},
	}
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, n.tokenURL, strings.NewReader(form.Encode()))
	if err != nil {
		return "", fmt.Errorf("create token request: %w", err)
	}
	request.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	request.Header.Set("Accept", "application/json")

	response, err := n.httpClient.Do(request)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()
	if response.StatusCode < http.StatusOK || response.StatusCode >= http.StatusMultipleChoices {
		return "", fmt.Errorf("token endpoint returned HTTP %s", response.Status)
	}
	var token struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.NewDecoder(response.Body).Decode(&token); err != nil {
		return "", fmt.Errorf("decode token response: %w", err)
	}
	if strings.TrimSpace(token.AccessToken) == "" {
		return "", fmt.Errorf("token endpoint returned an empty access token")
	}
	return token.AccessToken, nil
}

func resolveSender(from, fallback string) (*mail.Address, error) {
	if sender, err := mail.ParseAddress(strings.TrimSpace(from)); err == nil && sender.Address != "" {
		return sender, nil
	}
	fallbackAddress, err := mail.ParseAddress(strings.TrimSpace(fallback))
	if err != nil {
		return nil, fmt.Errorf("parse configured fallback sender: %w", err)
	}
	return &mail.Address{Name: "Sharavira Technology", Address: fallbackAddress.Address}, nil
}

func gmailMessage(from, recipient string, inquiry model.ContactSubmission) ([]byte, error) {
	var body bytes.Buffer
	writer := quotedprintable.NewWriter(&body)
	if _, err := writer.Write([]byte(inquiryHTML(inquiry))); err != nil {
		return nil, fmt.Errorf("encode inquiry notification: %w", err)
	}
	if err := writer.Close(); err != nil {
		return nil, fmt.Errorf("finish inquiry notification encoding: %w", err)
	}

	headers := []string{
		"From: " + from,
		"To: " + recipient,
		"Reply-To: " + inquiry.Email,
		"Subject: " + mime.QEncoding.Encode("UTF-8", inquirySubject(inquiry)),
		"MIME-Version: 1.0",
		"Content-Type: text/html; charset=UTF-8",
		"Content-Transfer-Encoding: quoted-printable",
	}
	return []byte(strings.Join(headers, "\r\n") + "\r\n\r\n" + body.String()), nil
}

func inquirySubject(inquiry model.ContactSubmission) string {
	name := strings.TrimSpace(strings.ReplaceAll(strings.ReplaceAll(inquiry.FirstName+" "+inquiry.LastName, "\r", ""), "\n", ""))
	if name == "" {
		return "New website enquiry"
	}
	return "New website enquiry from " + name
}

func inquiryHTML(inquiry model.ContactSubmission) string {
	const markup = `<!doctype html><html><body><h1>New Sharavira Technology enquiry</h1><table><tr><th align="left">Name</th><td>{{.FirstName}} {{.LastName}}</td></tr><tr><th align="left">Company</th><td>{{.Company}}</td></tr><tr><th align="left">Email</th><td>{{.Email}}</td></tr><tr><th align="left">Country</th><td>{{.Country}}</td></tr><tr><th align="left">Reason</th><td>{{.Reason}}</td></tr><tr><th align="left">Marketing updates</th><td>{{.MarketingOK}}</td></tr></table><h2>Message</h2><p>{{.Message}}</p></body></html>`
	view := template.Must(template.New("inquiry").Parse(markup))
	var rendered bytes.Buffer
	if err := view.Execute(&rendered, inquiry); err != nil {
		return "<p>New website enquiry received. Please review the contact records.</p>"
	}
	return rendered.String()
}

// Kept as a compatibility alias for code that only needs the MIME builder.
func smtpMessage(from, recipient string, inquiry model.ContactSubmission) ([]byte, error) {
	return gmailMessage(from, recipient, inquiry)
}
