import { Vue } from 'vue-facing-decorator';
import { authStorage } from "../stores/auth";

export class API extends Vue {  
    declare $refs;

    authStorage = authStorage();

    headers() {
        return {
            "Content-type": "application/json; charset=UTF-8",
            'Authorization': `Bearer ${this.authStorage.getToken()}`,
        }
    }

    async auth() {
        try{
            const token = await this.postToApi(`auth`, { user: "anonymous" });
            this.authStorage.setToken(token);
        }
        catch(err){
            console.error(err);
        }
    }

    getFromApi(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch(url, { headers: this.headers() })
            .then(response => response.json())
            .then(response => resolve(response.data))
            .catch(reject);
        })
    }

    postToApi(url: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch(url, { 
                method: "POST",
                headers: this.headers(),
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(response => resolve(response.data))
            .catch(reject);
        })
    }
}