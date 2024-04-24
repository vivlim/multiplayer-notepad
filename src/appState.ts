import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";

const stateDocName = "CCA7F0A4-33CD-4B41-989B-DD62124E383F"
const recentDocsDoc = "RecentDocs"
const settingsPrefix = "multiplayer-notepad."

export class AppState {
    public ydoc: Y.Doc;
    public provider: IndexeddbPersistence;

    public constructor(){
        this.ydoc = new Y.Doc();
        this.provider = new IndexeddbPersistence(stateDocName, this.ydoc);
        this.provider.on("synced", () => {console.log("appstate indexeddb synced"); console.log(JSON.stringify(this.listRecents()))})
    }

    public storeRecent(name: string) {
        this.ydoc.load()
        const recentItems = this.ydoc.getMap<IRecentDocument>(recentDocsDoc);
        /*
        recentItems.observe(e => {
            console.log('delta: ', e.changes.delta)
        })
        */
        recentItems.set<IRecentDocument>(name, {name: name, lastVisited: Date.now()});
        console.log(`stored recent ${name}. ${recentItems.size}`)
    }

    public removeRecent(name: string){
        this.ydoc.load()
        const recentItems = this.ydoc.getMap<IRecentDocument>(recentDocsDoc);
        recentItems.delete(name);
    }

    public listRecents() : IRecentDocument[] {
        const recentItems = this.ydoc.getMap<IRecentDocument>(recentDocsDoc);
        const recentItemsList = Array.from(recentItems.values())
        recentItemsList.sort((a, b) => {
            return b.lastVisited - a.lastVisited
        })
        return recentItemsList;
    }

    public writeSetting<T>(setting: string, value: string) {
        window.localStorage.setItem(settingsPrefix + setting, value);
    }

    public readSetting(setting: string) : string | null {
        const val = window.localStorage.getItem(settingsPrefix + setting);
        return val;
    }
}

export interface IRecentDocument {
    name: string;
    lastVisited: number;
}