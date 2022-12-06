export default class Signal<T> {
    private slotContexts:Map<any, Array<(value:T) => void>>;
    private slots:Array<(value:T) => void>;
    private onces:Array<(value:T) => void>;

    constructor() {
        this.slots = [];
        this.onces = [];
        this.slotContexts = new Map();
    }

    add(slot:(value:T) => void, $this:any = null):Signal<T> {
        if ($this) {
            if (!this.slotContexts.has($this)) {
                this.slotContexts.set($this, []);
            }
            slot = slot.bind($this);
            // @ts-ignore
            this.slotContexts.get($this).push(slot);
        }
        this.slots.push(slot);
        return <any>this;
    }

    emit(payload:T):void {
        this.notify(this.slots, payload);
        this.notify(this.onces, payload);
        this.onces = [];
    }

    private notify(slots:Array<(value:T) => void>, payload:T):void {
        for (let i = slots.length; i--;) {
            let slot = slots[i];
            // @ts-ignore
            payload = (<any>payload === 0) ? payload : (payload || null);
            slot.call(slot, payload);
        }
    }

    once(slot:(value:T) => void):Signal<T> {
        this.onces.push(slot);
        return <any>this;
    }

    remove(slot:(value:T) => void):Signal<T> {
        this.slots = this.slots.filter(function (item) {
            return item !== slot;
        });
        this.onces = this.onces.filter(function (item) {
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