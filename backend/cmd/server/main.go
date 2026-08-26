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
	"github.com/ascend-collective/public-site-api/internal/repository"
	"github.com/ascend-collective/public-site-api/internal/router"
	"github.com/ascend-collective/public-site-api/internal/service"
)

func main() {
	cfg := config.Load()
	repo, err := repository.NewPostgres(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database initialization failed: %v", err)
	}
	defer repo.Close()
	server := &http.Server{Addr: ":" + cfg.Port, Handler: router.New(service.New(repo), cfg), ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 10 * time.Second, WriteTimeout: 15 * time.Second, IdleTimeout: 60 * time.Second}
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
