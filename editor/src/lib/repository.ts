export default {
    async getIndexedDb() {
        return new Promise((resolve, reject) => {
            let request = window.indexedDB.open("ucsjs", 1);
            request.onerror = e => reject(e);
            request.onsuccess = e => resolve(e.target.result);
        });
    },

    async getData(index) {
        return new Promise(async (resolve, reject) => {
            let db = await this.getIndexedDb();
            let trans = db.transaction([index], "readonly");
            let data = [];
            trans.oncomplete = e => resolve(data);

            let store trans.objectStore(index);
            store.openCursor().onsuccess = e => {
                let cursor = e.target.result;
                if (cursor) {
                    data.push(cursor.value)
                    cursor.continue();
                }
            });
        });
    }

    async addData(index, item){
        return new Promise(async (resolve, reject) => {
            let db = await this.getIndexedDb();
            let trans = db.transaction([index],'readwrite');
            trans.oncomplete = e => resolve;
            let store = trans.objectStore('cats');
	        store.add(item);
        });
    }

    async removeData(index, id){
        return new Promise(async (resolve, reject) => {
            let db = await this.getIndexedDb();
            let trans = db.transaction([index],'readwrite');
            trans.oncomplete = e => resolve;
            let store = trans.objectStore('cats');
	        store.delete(id);
        });
    }
};