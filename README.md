# Microsoft Team Javascript Injector

This is a fork of eariassoto's [repo](https://github.com/eariassoto/teams-js-injector). This is a customised version that introduces the following:

- Fix to cater for the newer Teams WebView edition that has the side / top bar and chat contents in different WebContents. Each WebContent requires its own injection
- Now marshal and display the Websocket response to give feedback on syntax issues
- Randomised websocket port to work around quick successive teams restarts failing

teams-patch.js does the following:
- Custom Highlight colour for most elements in the chat tab
- Permanently hides alert box that would usually display out of office status's above the message entry bar
- Highlight for unread chats in chat list
- Compact mode on chat tab
- Fix for missing icons due to incorrect size in media-objects

This program sends a javascript payload to be evaluated by Microsoft Team's Javascript VM. The program opens a Teams process with the Remote Debugging tool enabled. This debugger allow us to get the current pages/connections. The program then gets the address for the Chat service websocket and sends a message to it. The message request the "Runtime.evaluate" method that will make the application to execute the payload code.

Usage of ./teams-js-injector:
```
  -debug-port int
        Port number for Chromium remote debugging (default 9222)
  -payload-file string
        Javascript file to inject (default "teams-patch.js")
  -teams-path string
        Location of Teams executable (default "C:\\Users\\%USERNAME%\\AppData\\Local\\Microsoft\\Teams\\current\\Teams.exe")
```

This program was inspired by [this article](https://medium.com/@dany74q/injecting-js-into-electron-apps-and-adding-rtl-support-for-microsoft-teams-d315dfb212a6)