package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"*"}, // Adjust for production
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	}))

	err := ConnectDB()
	if err != nil {
		log.Printf("Warning: Failed to connect to db: %v", err)
	} else {
		log.Println("Successfully connected to Postgres!")
		defer DB.Close()
	}

	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		
		status := "ok"
		if DB == nil {
			status = "db_error"
		} else {
			err := DB.Ping(r.Context())
			if err != nil {
				status = "db_disconnected"
			}
		}
		
		json.NewEncoder(w).Encode(map[string]string{"status": status})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting server on port %s", port)
	http.ListenAndServe(":"+port, r)
}
