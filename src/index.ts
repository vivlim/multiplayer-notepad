import "@wavebeem/candy-css";
// import "@shoelace-style/shoelace/dist/themes/dark.css";
// import "@shoelace-style/shoelace/dist/components/button/button.js";
// import "@shoelace-style/shoelace/dist/components/button-group/button-group.js";
// import "@shoelace-style/shoelace/dist/components/split-panel/split-panel.js";
// import "@shoelace-style/shoelace/dist/components/popup/popup.js";
// import "@shoelace-style/shoelace/dist/components/icon/icon.js";
// import "@shoelace-style/shoelace/dist/components/card/card.js";
// import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import docIndex from "./docIndex.html";
import editor from "./editor.html";
import { MonacoRoom } from "./editor";

// setBasePath("/dist/shoelace");

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const docId = urlParams.get("i");

    if (docId !== null) {
        // Go to the editor view.
        document.getElementById("app").innerHTML = editor;
        document.getElementById("room").innerHTML = docId;

        try {
        const mr = new MonacoRoom(docId, "monaco")
        }
        catch (e) {
            console.error("Failed to create room: ", e)
        }
    }
    else {
        document.getElementById("app").innerHTML = docIndex;

    }



});
