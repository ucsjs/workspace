import { authStorage } from "../stores/auth";

export default {    
    methods: {
        headers(){
            return {
                'Authorization': `Bearer ${authStorage().getToken()}`,
            }
        },

        get(url: string): Promise<any>{
            return new Promise((resolve, reject) => {
                fetch(url, { headers: this.headers() })
                .then(response => response.json())
                .then(response => resolve(response.data))
                .catch(reject);
            })
        }
    }
}