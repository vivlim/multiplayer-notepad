
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import * as monaco from "monaco-editor";
import "./awareness.css";
import { parseTmTheme } from "monaco-themes";
import { initVimMode, VimMode } from "monaco-vim";

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
  private ytext: Y.Text;
  private monacoBinding: MonacoBinding;
  private editorTarget: HTMLElement;
  private editor;

  public constructor(public roomName: string, targetElementId: string) {
    this.ydoc = new Y.Doc();
    this.provider = new WebrtcProvider(roomName, this.ydoc, {
      password: "C9D52D98-6741-4DC8-8FF9-D91249E6F589", // hardcoded pwd for all clients, atm
      signaling: ["wss://vvn-y-webrtc.fly.dev"],
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

    this.monacoBinding = new MonacoBinding(
      this.ytext,
      editorModel,
      new Set([this.editor]),
      this.provider.awareness
    );
    console.log("Created binding");

    initVimMode(this.editor, document.getElementById("vim-statusbar"));
  }
}
