package repository

import (
	"context"
	"errors"
	"github.com/ascend-collective/public-site-api/internal/model"
)

var ErrNotFound = errors.New("not found")
var ErrDuplicate = errors.New("duplicate submission")

type Store interface {
	ListContent(context.Context, string) ([]model.ContentItem, error)
	GetContent(context.Context, string, string) (model.ContentItem, error)
	SearchContent(context.Context, string) ([]model.ContentItem, error)
	CreateContact(context.Context, model.ContactSubmission, string) error
	CreateNewsletter(context.Context, model.NewsletterSubscription, string) error
}
