package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ascend-collective/public-site-api/internal/config"
	"github.com/ascend-collective/public-site-api/internal/migration"
	"github.com/ascend-collective/public-site-api/internal/repository"
	"github.com/ascend-collective/public-site-api/internal/router"
	"github.com/ascend-collective/public-site-api/internal/service"
)

func main() {
	cfg := config.Load()
	migrationCtx, cancelMigration := context.WithTimeout(context.Background(), 30*time.Second)
	if err := migration.Apply(migrationCtx, cfg.DatabaseURL); err != nil {
		cancelMigration()
		log.Fatalf("database schema initialization failed: %v", err)
	}
	cancelMigration()
	log.Println("database schema ready")
	repo, err := repository.NewPostgres(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database initialization failed: %v", err)
	}
	defer repo.Close()
	notifier := service.NewSMTPInquiryNotifier(cfg.SMTPHost, cfg.SMTPPort, cfg.SMTPUsername, cfg.SMTPPassword, cfg.InquiryEmailFrom, cfg.InquiryNotificationTo)
	server := &http.Server{Addr: ":" + cfg.Port, Handler: router.New(service.NewWithNotifier(repo, notifier), cfg), ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 10 * time.Second, WriteTimeout: 15 * time.Second, IdleTimeout: 60 * time.Second}
	go func() {
		log.Printf("public site API listening on :%s", cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server failed: %v", err)
		}
	}()
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		log.Printf("graceful shutdown failed: %v", err)
	}
}
