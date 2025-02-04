# Microsoft Team Javascript Injector

This repo applies css and javascript tweaks to Teams, all tweaks are contained in teams-patch.js which does the following:

- Custom Highlight colour for most elements in the chat tab
- Permanently hides alert box that would usually display out of office status's above the message entry bar
- Better highlight for unread chats in chat list

Teams is based on webview2 which means its just a chrome browser made to look like an application. It can also be launched with a debug port enabled, allowing websocket commands to be sent to it. One such command, "Runtime.evaluate", allows us to send javascript to the process that will then be evaluated and ran.

We leverage this primative to apply a custom stylesheet to teams via the debug port.

Usage of ./teams-js-injector:
```
  -debug-port int
        Port number for Chromium remote debugging (default 9222)
  -payload-file string
        Javascript file to inject (default "teams-patch.js")
```

## Prereqs

Teams must be launched with the argument `--remote-debugging-port=9222` for this program to be able to apply a custom stylesheet via the debug port. A convinient way of doing this in Windows is by setting a user environment variable:

`WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9222`.
