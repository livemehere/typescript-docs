export {}
declare global {
    interface String {
        startsWithHello(): boolean;
    }
    interface Array<T> {
        reverseAndSort(): T[];
    }
}

