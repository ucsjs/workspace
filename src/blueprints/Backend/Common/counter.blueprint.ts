import { BehaviorSubject } from 'rxjs';
import { Blueprint, Type } from "@ucsjs/blueprint";

export class IntervalBlueprint extends Blueprint {
    //Metadata
    private __namespace = "Interval";
    private __group = "Common";
    private __headerIcon = "fa-solid fa-clock";
    private __help = "https://www.w3schools.com/jsref/met_win_setinterval.asp";

    private _count: BehaviorSubject<number>;
    private _interval;

    public _start: number = 0;
    public _max: number = 100;
    public _increment: number = 1;
    public _timeout: number = 1000;

    constructor(metadata?: any){
        super();
        this.setup(metadata);
        this._count = new BehaviorSubject(this._start);
        this._count.subscribe((v) => this.next("counter", v));
        this.output("counter", Type.Int, this._start);
    }

    public start(){
        this._interval = setInterval(() => {
            if(this._count.value + this._increment < this._max)
                this._count.next(this._count.value + this._increment);
            else
                this.stop();
        }, this._timeout);
    }

    public stop(){
        clearInterval(this._interval);
    }

    public reset(){
        this._count.next(this._start);
        this.start();
    }
}