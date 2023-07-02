const obj: any = {
    name: 'kim',
    age: 30
}

obj[Symbol.iterator] = function(){
    const keys = Object.keys(obj)
    let i = 0
    return {
        next(){
            const key = keys[i++] // 1,2
            return {
                value: obj[key],
                done: i > keys.length
            }
        }
    }
}

// for ... of : 값
for(let item of obj){
    console.log(item)
}
