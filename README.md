# multiplayer-notepad

Peer-to-peer multiplayer text editor, in your browser.

Combines the following parts:

- [VS Code's Monaco editor](https://github.com/microsoft/monaco-editor) for editing
- [Yjs](https://yjs.dev/), a framework for shared editing
- [y-webrtc](https://github.com/yjs/y-webrtc), in-browser peer to peer transport for Yjs (for multiplayer)
- [y-indexeddb](https://github.com/yjs/y-indexeddb), offline browser storage database for Yjs (for local cache)
- [y-monaco](https://github.com/yjs/y-monaco), Yjs binding for Monaco
- [monaco-vim](https://github.com/brijeshb42/monaco-vim), vim keybindings for Monaco
- [candy.css](https://candy.wavebeem.com/) for shiny