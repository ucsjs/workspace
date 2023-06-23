import { Subject } from "rxjs";
import { Singleton } from "../abstracts";

export class EventEmitter extends Singleton { 
    private eventQueue = [];
    public onMessage = new Subject<string>();

    static send(message: string){
        const eventEmitter = EventEmitter.getInstance();
        eventEmitter.eventQueue.push(message);
    }

    static tick() {
        const eventEmitter = EventEmitter.getInstance();

        if(eventEmitter.eventQueue.length > 0){
            const event = eventEmitter.eventQueue.shift();
            eventEmitter.onMessage.next(JSON.stringify(event));
        }        
    }

    static createTickInterval(timeout: number = 1000){
        const eventEmitter = EventEmitter.getInstance();
        setInterval(() => EventEmitter.tick(), timeout);
    }
}