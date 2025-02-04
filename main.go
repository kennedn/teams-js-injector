package main

import (
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gorilla/websocket"
)

type ChromeJSON struct {
	Title                string `json:"title"`
	WebSocketDebuggerUrl string `json:"webSocketDebuggerUrl"`
}

type Params struct {
	Expression any `json:"expression"`
}

type Message struct {
	Id     int64  `json:"id"`
	Method string `json:"method"`
	Params Params `json:"params"`
}

func getItemByTitle(items *[]ChromeJSON, contains string) (*ChromeJSON, error) {
	for _, item := range *items {
		if strings.Contains(item.Title, contains) {
			return &item, nil
		}
	}
	return nil, errors.New("not found")
}

func makeMessage(payload string) *Message {
	return &Message{
		Id:     1337,
		Method: "Runtime.evaluate",
		Params: Params{
			Expression: payload,
		},
	}
}

func sendMessage(wsURL string, message *Message) {
	jsonBytes, err := json.Marshal(message)
	if err != nil {
		log.Fatalln(err)
	}

	conn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		log.Panicln(err)
	}
	defer conn.Close()

	var dataBytes []byte
	if err = conn.WriteMessage(websocket.TextMessage, jsonBytes); err != nil {
		log.Panicln(err)
	}
	if _, dataBytes, err = conn.ReadMessage(); err != nil {
		log.Panicln(err)
	}
	log.Printf("Response: %s\n", string(dataBytes))

}

func waitAndSendMessage(debugPort int, message *Message) {
	// Attempt to patch for 15 seconds
	for i := 150; i > 0; i-- {
		time.Sleep(100 * time.Millisecond)
		resp, err := http.Get(fmt.Sprintf("http://localhost:%d/json", debugPort))
		if err != nil {
			continue
		}
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			continue
		}
		items := []ChromeJSON{}
		json.Unmarshal(body, &items)
		item, err := getItemByTitle(&items, "| Microsoft Teams")
		if err != nil {
			continue
		}
		log.Printf("Injecting to window, title: %s", item.Title)
		sendMessage(item.WebSocketDebuggerUrl, message)
		return
	}
	log.Fatalf("Failed to send message to teams on port %d", debugPort)
}

func readFile(path string) string {
	file, err := os.Open(path)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	b, err := io.ReadAll(file)
	if err != nil {
		log.Fatal(err)
	}
	fileStr := string(b)

	return fileStr
}

func main() {
	debugPort := flag.Int("debug-port", 9222, "Port number for Chromium remote debugging")
	payloadFile := flag.String("payload-file", "teams-patch.js", "Javascript file to inject")
	flag.Parse()
	log.Printf("Using debug port %d", *debugPort)

	payload := readFile(*payloadFile)
	message := makeMessage(payload)

	waitAndSendMessage(*debugPort, message)

	log.Printf("Injected %s\n", *payloadFile)
}
