import "@wavebeem/candy-css";
import "./index.css";
import editor from "./editor.html";
import { MonacoRoom } from "./editor";
import { AppState, IRecentDocument } from "./appState";
import { RecentView, displayRecents } from "./recentView";

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
    }



});
