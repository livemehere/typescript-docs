declare global {
    interface Array<T> {
        makeKong(): T[];
    }
}

Array.prototype.makeKong = function () {
    return ['kong'];
}

const a:any[] = [];

console.log(a.makeKong())

export {}
