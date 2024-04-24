import "@wavebeem/candy-css";
// import "@shoelace-style/shoelace/dist/themes/dark.css";
// import "@shoelace-style/shoelace/dist/components/button/button.js";
// import "@shoelace-style/shoelace/dist/components/button-group/button-group.js";
// import "@shoelace-style/shoelace/dist/components/split-panel/split-panel.js";
// import "@shoelace-style/shoelace/dist/components/popup/popup.js";
// import "@shoelace-style/shoelace/dist/components/icon/icon.js";
// import "@shoelace-style/shoelace/dist/components/card/card.js";
// import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import "./index.css";
import editor from "./editor.html";
import { MonacoRoom } from "./editor";
import { AppState, IRecentDocument } from "./appState";
import { RecentView, displayRecents } from "./recentView";

// setBasePath("/dist/shoelace");

const appState = new AppState();

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const docId = urlParams.get("edit");

    if (docId !== null) {
        // Go to the editor view.
        document.getElementById("app").innerHTML = editor;
        document.getElementById("room").innerHTML = docId;

        try {
            const mr = new MonacoRoom(docId, "monaco", appState)
            appState.storeRecent(docId);
        }
        catch (e) {
            console.error("Failed to create room: ", e)
        }
    }
    else {
        const rec = new RecentView(appState);

        //const items = appState.listRecents();
        //displayRecents(items);
    }



});
