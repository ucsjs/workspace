/**
 * Fetch API Frontend
 * 
 * The Fetch API provides an interface for fetching resources (including across the network). 
 * It will seem familiar to anyone who has used XMLHttpRequest, but the new API provides a 
 * more powerful and flexible feature set.
 * 
 * @version 0.0.1
 * @author: Andre Ferreira <andre@ucsjs.io>
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

($input, $events, $output) => {
    if(typeof $input?.url == "function"){
        let headersData = {}

        if($input.headers){
            for(let key in $input.headers){
                headersData[$input.headers[key].headerKey] = $input.headers[key].value;
            }
        }
        
        const headers = new Headers(headersData);
        
        const request = new Request($input.url, {
            method: $input.method || "GET",
            body: $input.body || null,
            cache: $input.cache || "default",
            credentials: $input.credentials || "omit",
            mode: $input.mode || "cors",
            redirect: $input.redirect || "follow",
            referrerPolicy: $input.referrerPolicy || "no-referrer",
            referrer: $input.referrer || null,
            keepalive: $input.keepalive || false,
            headers: headers,
        });

        fetch(request).then((response) => {
            if (response.status === 200 || response.status === 201)
                return response.json();
            else 
                throw new Error('Something went wrong on API server!');
        }).then((response) => {
            $output.result.next(response);
        }).catch((error) => {
            $output.error.next('Something went wrong on API server!');
        });
    }
    else {
        $output.error.next('Invalid URL');
    }
}