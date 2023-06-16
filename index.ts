function doSomething(x: string | undefined | null) {
  if (x === undefined || x === null) {
    // 아무 것도 하지 않는다
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}

const a = null;

doSomething(a);