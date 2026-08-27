package service

import (
	"bytes"
	"context"
	"crypto/tls"
	"fmt"
	"html/template"
	"mime"
	"mime/quotedprintable"
	"net"
	"net/mail"
	"net/smtp"
	"strings"

	"github.com/ascend-collective/public-site-api/internal/model"
)

type InquiryNotifier interface {
	NotifyInquiry(context.Context, model.ContactSubmission, string) error
}

type noopInquiryNotifier struct{}

func (noopInquiryNotifier) NotifyInquiry(context.Context, model.ContactSubmission, string) error {
	return nil
}

type smtpInquiryNotifier struct {
	host      string
	port      string
	username  string
	password  string
	from      string
	recipient string
}

func NewSMTPInquiryNotifier(host, port, username, password, from, recipient string) InquiryNotifier {
	if strings.TrimSpace(host) == "" || strings.TrimSpace(port) == "" || strings.TrimSpace(username) == "" || strings.TrimSpace(password) == "" || strings.TrimSpace(recipient) == "" {
		return noopInquiryNotifier{}
	}
	return &smtpInquiryNotifier{
		host: strings.TrimSpace(host), port: strings.TrimSpace(port), username: strings.TrimSpace(username), password: password,
		from: strings.TrimSpace(from), recipient: strings.TrimSpace(recipient),
	}
}

func (n *smtpInquiryNotifier) NotifyInquiry(ctx context.Context, inquiry model.ContactSubmission, _ string) error {
	if err := ctx.Err(); err != nil {
		return err
	}
	sender, err := resolveSender(n.from, n.username)
	if err != nil {
		return err
	}
	recipient, err := mail.ParseAddress(n.recipient)
	if err != nil {
		return fmt.Errorf("parse inquiry recipient: %w", err)
	}

	message, err := smtpMessage(sender.String(), recipient.String(), inquiry)
	if err != nil {
		return err
	}
	if err := n.sendWithDeadline(ctx, sender.Address, recipient.Address, message); err != nil {
		return fmt.Errorf("send inquiry notification: %w", err)
	}
	return nil
}

func (n *smtpInquiryNotifier) sendWithDeadline(ctx context.Context, from, to string, message []byte) error {
	dialer := &net.Dialer{}
	connection, err := dialer.DialContext(ctx, "tcp", net.JoinHostPort(n.host, n.port))
	if err != nil {
		return err
	}
	defer connection.Close()
	if deadline, ok := ctx.Deadline(); ok {
		if err := connection.SetDeadline(deadline); err != nil {
			return err
		}
	}

	client, err := smtp.NewClient(connection, n.host)
	if err != nil {
		return err
	}
	defer client.Close()
	if ok, _ := client.Extension("STARTTLS"); !ok {
		return fmt.Errorf("SMTP server does not advertise STARTTLS")
	}
	if err := client.StartTLS(&tls.Config{ServerName: n.host, MinVersion: tls.VersionTLS12}); err != nil {
		return err
	}
	if err := client.Auth(smtp.PlainAuth("", n.username, n.password, n.host)); err != nil {
		return err
	}
	if err := client.Mail(from); err != nil {
		return err
	}
	if err := client.Rcpt(to); err != nil {
		return err
	}
	writer, err := client.Data()
	if err != nil {
		return err
	}
	if _, err := writer.Write(message); err != nil {
		return err
	}
	if err := writer.Close(); err != nil {
		return err
	}
	return client.Quit()
}

func resolveSender(from, username string) (*mail.Address, error) {
	if sender, err := mail.ParseAddress(strings.TrimSpace(from)); err == nil && sender.Address != "" {
		return sender, nil
	}
	usernameAddress, err := mail.ParseAddress(strings.TrimSpace(username))
	if err != nil {
		return nil, fmt.Errorf("parse SMTP username as fallback sender: %w", err)
	}
	return &mail.Address{Name: "Sharavira Technology", Address: usernameAddress.Address}, nil
}

func smtpMessage(from, recipient string, inquiry model.ContactSubmission) ([]byte, error) {
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
