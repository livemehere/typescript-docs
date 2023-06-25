function sum(a:number, b:number) {
    return a + b;
}
export default sum;

type Hey<T> = T extends {} ? T : never;

let a = 3;

//@ts-expect-error
a = '3'
console.log(a)
