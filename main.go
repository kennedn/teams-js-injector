package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"os/exec"
	"strings"
	"time"

	"golang.org/x/net/websocket"
)

const (
	TeamsPath = "C:\\Program Files (x86)\\Microsoft\\Teams\\current\\Teams.exe"
)

func killAllTeamsProcesses() {
	log.Println("Stopping Teams")
	cmnd := exec.Command("taskkill", "/f", "/im", "Teams.exe")
	cmnd.Start()
	cmnd.Wait()
	time.Sleep(1000 * time.Millisecond)
}

func launchTeamProcess(path string, debugPort int) {
	for i := 3; i > 0; i-- {
		log.Printf("Attempting to Start Teams with debug port %d\n", debugPort)
		cmnd := exec.Command(path, fmt.Sprintf("--remote-debugging-port=%d", debugPort))
		cmnd.Start()
		if err := cmd.Start(); err != nil { continue; }
		log.Printf("Successfully started Teams")
		break;
	}
}

func waitForInjectTargets(debugPort int, message map[string]interface{}) {
	urlFound := false
	mainFound := false
	webviewFound := false
	for !urlFound {
		resp, err := http.Get(fmt.Sprintf("http://localhost:%d/json", debugPort))
		if err != nil {
			continue
		}
		var result []map[string]interface{}

		json.NewDecoder(resp.Body).Decode(&result)
		for i := len(result) - 1; i >= 0; i-- {
			if strings.Contains(result[i]["title"].(string), "| Microsoft Teams") && !mainFound {
				log.Printf("Injecting to window, type: %s, title: %s", result[i]["type"], result[i]["title"])
				sendMessage(result[i]["webSocketDebuggerUrl"].(string), message)
				mainFound = true
			} else if result[i]["type"] == "webview" && strings.Contains(result[i]["title"].(string), "multi-window") && !webviewFound {
				log.Printf("Injecting to window, type: %s, title: %s", result[i]["type"], result[i]["title"])
				sendMessage(result[i]["webSocketDebuggerUrl"].(string), message)
				webviewFound = true
			}
		}
		if mainFound && webviewFound {
			urlFound = true
		}
		time.Sleep(100 * time.Millisecond)
	}
}

func makeRequestMessage(payload string) map[string]interface{} {
	request := map[string]interface{}{}
	request["id"] = 1337
	request["method"] = "Runtime.evaluate"

	payloadStruct := map[string]interface{}{}
	payloadStruct["expression"] = payload

	request["params"] = payloadStruct

	return request
}

func sendMessage(wsURL string, message map[string]interface{}) {
	_, err := json.Marshal(message)
	if err != nil {
		log.Fatalln(err)
	}

	origin := "http://localhost/"
	conn, err := websocket.Dial(wsURL, "", origin)
	if err != nil {
		log.Panicln(err)
	}
	defer conn.Close()

	var data map[string]interface{}
	if err = websocket.JSON.Send(conn, message); err != nil {
		log.Panicln(err)
	}
	if err = websocket.JSON.Receive(conn, &data); err != nil {
		log.Panicln(err)
	}
	b, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		log.Fatalln(err)
	}
	log.Printf("Response: %s\n", string(b))

}

func readFile(path string) string {
	file, err := os.Open(path)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	b, err := ioutil.ReadAll(file)
	fileStr := string(b)

	return fileStr
}

func main() {
	rand.Seed(time.Now().UnixNano())
	debugPort := flag.Int("debug-port", rand.Intn(65500-9000+1)+9000, "Port number for Chromium remote debugging")
	log.Printf("Using debug port %d", *debugPort)
	teamsExePath := flag.String("teams-path", TeamsPath, "Location of Teams executable")

	payloadFile := flag.String("payload-file", "teams-patch.js", "Javascript file to inject")
	flag.Parse()

	killAllTeamsProcesses()

	launchTeamProcess(*teamsExePath, *debugPort)

	payload := readFile(*payloadFile)
	request := makeRequestMessage(payload)

	waitForInjectTargets(*debugPort, request)

	log.Printf("Injected %s\n", *payloadFile)
}
