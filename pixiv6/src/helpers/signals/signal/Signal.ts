import PromiseList from "app/helpers/promise/PromiseList";

export default class Signal<T> {
    private slotContexts:Map<any, Array<(value:T) => void>>;
    private slots:Array<(value:T, resolve?:() => void) => void>;

    constructor() {
        this.slots = [];
        this.slotContexts = new Map();
    }

    addOnce(slot:(value:T) => void, $this:any = null, highPriory?:boolean):Signal<T> {
        this.add(value => {
            this.remove(slot);
            slot(value);
        }, $this, highPriory);
        return <any>this;
    }

    reAdd(slot:(value:T, resolve?:() => void) => void, $this:any = null):Signal<T> {
        this.remove(slot);
        this.add(slot, $this);
        return this;
    }

    add(slot:(value:T, resolve?:() => void) => void, $this:any = null, highPriory?:boolean):Signal<T> {
        if ($this) {
            if (!this.slotContexts.has($this)) {
                this.slotContexts.set($this, []);
            }
            slot = slot.bind($this);
            if (highPriory) {
                this.slotContexts.get($this)?.unshift(slot);
            } else {
                this.slotContexts.get($this)?.push(slot);
            }
        }
        if (highPriory) {
            this.slots.unshift(slot);
        } else {
            this.slots.push(slot);
        }
        return this;
    }

    emit(payload:T):PromiseList<T> {
        return this.notify(this.slots, payload);
    }

    private notify(slots:Array<(value:T, resolve?:() => void) => void>, payload:T):PromiseList<T> {
        const promises:any[] = [];
        for (let i = slots.length; i--;) {
            let slot = slots[i];
            //todo: TBD
            // @ts-ignore
            payload = (<any>payload === 0) ? payload : (payload || null);
            if (slot.length == 1) {
                slot.call(slot, payload);
            } else {
                promises.push(new Promise<T | void>(resolve => {
                    slot.call(slot, payload, resolve);
                }));
            }
        }
        return new PromiseList(promises);
    }

    remove(slot:(value:T) => void):Signal<T> {
        this.slots = this.slots.filter(function (item) {
            return item !== slot;
        });
        for (let key of Array.from(this.slotContexts.keys())) {
            let slots = (this.slotContexts.get(key) || []).filter(function (item) {
                return item !== slot;
            });
            for (let i = slots.length; i--;) {
                this.slotContexts.set(key, slots);
            }
        }
        return <any>this;
    }


    unload($this:any) {
        if (this.slotContexts.has($this)) {
            let slots = this.slotContexts.get($this) || [];
            for (let i = slots.length; i--;) {
                this.remove(slots[i]);
            }
            this.slotContexts.delete($this);
        }
    }
}