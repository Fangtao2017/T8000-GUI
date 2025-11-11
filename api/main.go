package main

import "net/http"

func main() {
  http.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.Write([]byte(`{"message":"hello from go"}`))
  })
  http.ListenAndServe(":8080", nil)
}