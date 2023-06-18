type Person = {
    name:string;
    new (name:string): {name:string};
}


function print(fn:Person){
    const p = new fn('kong');
    console.log(p.name);
}


[].forEach()
