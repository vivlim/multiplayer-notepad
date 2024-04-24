import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";

import { AppState, IRecentDocument } from "./appState";
import "./recentView.css"
import docIndex from "./docIndex.html";
import { v4 as uuidv4 } from 'uuid';
import {humanId} from 'human-id';

const VimModeSetting = "vim-mode";

export class RecentView {
    public constructor(public appState: AppState) {
        document.getElementById("app").innerHTML = docIndex;

        document.getElementById("newDocButton").onclick = () => {this.newDocumentButton();}

        const vimModeCheckbox = document.getElementById("vim-mode") as HTMLInputElement;
        if (appState.readSetting(VimModeSetting) === "true") {
            vimModeCheckbox.checked = true;
        }
        vimModeCheckbox.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement;
            if (target.checked) {
                appState.writeSetting(VimModeSetting, "true")
            } else {
                appState.writeSetting(VimModeSetting, "false")
            }
        })

        appState.provider.on('synced', () => {
            const items = appState.listRecents();
            this.displayRecents(items);
        });
    }

    public displayRecents(items: IRecentDocument[]){
        console.log("displaying recents");
        const target = document.getElementById("recentList")
        if (target === null) { return; }

        if (items.length === 0) {
            target.innerText = "No recent documents";
        }
        else {
            for (const doc of items){
                const docElement = document.createElement("div");
                docElement.classList.add("candy-card", "site-texture", "candy-texture-striped", "recentCard")

                const btn = document.createElement("a");
                btn.href = `?edit=${doc.name}`
                btn.classList.add("candy-button", "candy-primary", "doc-title-button")
                btn.textContent = doc.name;
                docElement.appendChild(btn);

                const preview = document.createElement("div");
                preview.classList.add("candy-well", "doc-preview")
                preview.id = `${doc.name}-preview`
                preview.textContent = "loading..."
                docElement.appendChild(preview);
                this.loadDocumentPreview(doc.name, preview);

                target.appendChild(docElement);
            }
        }

    }

    private loadDocumentPreview(name: string, targetElement: HTMLDivElement){
        const ydoc = new Y.Doc();
        const provider = new IndexeddbPersistence(name, ydoc);
        provider.on('synced', () => {
            const ytext = ydoc.getText('monaco');
            const content = ytext.toString();

            if (content.length === 0){
                // Clean up recents that point to empty documents.
                // Delete the element from history and its card
                this.appState.removeRecent(name);
                targetElement.remove();
            }

            const topLines = content.split("\n").slice(0, 5).join("\n");
            targetElement.innerText = topLines;
        })
    }

    private newDocumentButton(){
        const id = humanId('-')

        document.location.href = `?edit=${id}`
    }

}
