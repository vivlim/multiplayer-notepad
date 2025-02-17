
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import * as monaco from "monaco-editor";
import "./awareness.css";
import "./editor.css";
import { parseTmTheme } from "monaco-themes";
import { initVimMode, VimMode } from "monaco-vim";
import { IndexeddbPersistence } from "y-indexeddb";

function getDocName() {
  if (window.location.search !== "") {
    return window.location.search.substring(1);
  }
  return window.location.pathname;
}

const docName = getDocName();
console.log(`Document name: ${docName}`, docName);

VimMode.Vim.map("jk", "<Esc>", "insert");

export class MonacoRoom {
  private ydoc: Y.Doc;
  private provider: WebrtcProvider;
  private localProvider: IndexeddbPersistence;
  private ytext: Y.Text;
  private monacoBinding: MonacoBinding;
  private editorTarget: HTMLElement;
  private editor;

  public constructor(public roomName: string, targetElementId: string, public appState: AppState) {

    var vimMode = false;
    if (appState.readSetting("vim-mode") === "true") {
      vimMode = true;
    }

    this.ydoc = new Y.Doc();
    this.localProvider = new IndexeddbPersistence(roomName, this.ydoc);

    this.localProvider.on('synced', () => {
      console.log('content from the database is loaded')
    })

    this.provider = new WebrtcProvider(roomName, this.ydoc, {
      password: "C9D52D98-6741-4DC8-8FF9-D91249E6F589", // hardcoded pwd for all clients, atm
      signaling: ["wss://vvn-y-webrtc.fly.dev"],
      peerOpts: {
        config: {
          iceServers: [
            /*
             * This is a free account at metered.ca, please create your own account if you're running this yourself :)
             * https://www.metered.ca/tools/openrelay/
             */
            {
              urls: "stun:stun.relay.metered.ca:80",
            },
            {
              urls: "turn:global.relay.metered.ca:443",
              username: "f15491c1ae5272b07b3ef60f",
              credential: "cWLkmhU3PePOmfPp",
            },
            {
              urls: "turns:global.relay.metered.ca:443?transport=tcp",
              username: "f15491c1ae5272b07b3ef60f",
              credential: "cWLkmhU3PePOmfPp",
            },
          ]},
      },
    });
    this.ytext = this.ydoc.getText("monaco");

    const editorTarget = document.getElementById(targetElementId);
    if (editorTarget === null) {
      throw new Error("Couldn't find element to attach monaco to");
    }
    this.editorTarget = editorTarget;

    this.editor = monaco.editor.create(editorTarget, {
      value: "",
      language: "markdown",
      theme: "vs-dark",
      automaticLayout: true,
    });
    const editorModel = this.editor.getModel();
    if (editorModel === null) {
      throw new Error("Couldn't get monaco model");
    }
    editorModel.setEOL(monaco.editor.EndOfLineSequence.LF);

    this.monacoBinding = new MonacoBinding(
      this.ytext,
      editorModel,
      new Set([this.editor]),
      this.provider.awareness
    );
    console.log("Created binding");

    if (vimMode) {
      initVimMode(this.editor, document.getElementById("vim-statusbar"));
    } else {
      document.getElementById("vim-statusbar")?.remove();
    }
  }
}
