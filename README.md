# Typescript

## 타입스크립트란?

- 자바스크립트 + 타입
- 에디터에서 타입 에러를 잡아낸다.
- 타입스크립트가 자바스크립트로 컴파일 될 때 모든 타입이 제거된다.

## Tip

- `interface`를 우선으로 사용하고, 필요할 때만 `type`을 사용하는 것을 권장하고있다.

## 제네릭

- 제네릭 = 변수

## 구조적 타입 시스템

- 타입이 명시되지 않아도, 두 객체가 같은 형태라면 같은 것으로 간주된다.
- `type` == `interface` == `class`

## tsc

- tsc 명령어는 tsconfig.json 을 자동으로 참조하지 않는다. config 를 명시하지 않고서는, 모든 옵션을 cli 로 전달해야 한다.

## Options

- `noImplicitAny` : 암묵적 any 를 허용하지 않는다. js 는 대부분 any 로 되어있기 때문에, 이때 오류를 발생시킨다.
- `strictNullChecks` : null 과 undefined 처리를 반드시 명시적으로 처리할 수 있도록 체크한다.

> 보통 `strict:true` 를 사용하여 모든 플래그를 사용한다.

## interface vs Type Alias

- `interface` 는 확장이 가능하다. (동일한 인터페이스를 선언하면, 합쳐지는 반면, type 은 동일한 명칭의 alias 를 선언할 수 없다)

## 타입 단언(Type Assertion)

- `as` 문법을 사용한다.
- `.tsx` 파일이 아닐 경우 `<>` 문법도 사용 가능하다.
- 타입단언은 덜 구체적인 타입에서만 가능하다. 하지만 부득이한 경우 단언을 두번할 수 있다.

```ts
let someValue = '무조건 스트링' as unknown as number; // string 이라는 명확한 타입이지만 unknown 으로 단언하고, number 로 단언한다. 혹은 any 로해도된다.
```

## 리터럴 타입

- 객체의 프로퍼티 값은 리터럴 타입으로 추론하지 않는다. 의도적으로 해야하는데, 이때는 `as const` 키워드를 사용할 수 있다.

## Narrowing

- 타입을 좁히는 것을 의미한다.
- `typeof`, `instanceof`, `in`, `predicate`, `assertion` 을 사용한다.
- 긍정적인 것을 체크하기 보다는 부정적인 것을 체크해서 타입을 좁히는 것이 좋다.
-  null 과 undefined 체크는 === 가 아니라 == 로 하면 둘다 체크해준다.

```ts
interface Container {
  value: number | null | undefined;
}

function multiplyValue(container: Container, factor: number) {
  if (container.value != undefined) { // value 는 null 과 undefined 둘다 아닌지 체크한다. container.value != null 로 해도 된다.
    console.log(container.value);
    container.value *= factor;
  }
}
```

- type predicate 를 사용하면, 타입을 좁힐 수 있다.

```ts
function isFish(obj:Fish | Bird): obj is Fish{
  return (obj as Fish).swim !== undefined
}
```

- assertion 함수 사용하기

```ts
function assert(condition:boolean): asserts condition{
    if(!condition){
        throw new Error("Assertion failed.");
    }
}


function multiply(x:any, y:any) {
  assert(typeof x === "number");
  assert(typeof y === "number");
  return x * y;
}
```

## 함수 타입을 정의하는 또다른 방법

```ts
type DescribableFunction = {
  description: string; // 추가 프로퍼티
  (someArg: number): boolean; // 여기
};

function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}

function a(){
  return true;
}
a.description = 'hello';

doSomething(a)
```

## extends 는 확장의 의미이지 그 타입과 동이랗다고 볼수 없다(예시)

```ts
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj;
  } else {
    return { length: minimum }; // 에러 발생
  }
}
const arr = minimumLength([1, 2, 3], 6); // {length:6}
// 여기서 배열은 'slice' 메서드를 가지고 있지만
// 반환된 객체는 그렇지 않기에 에러가 발생합니다!
console.log(arr.slice(0));
```

## 제네릭은 호출 시점에서도 명시할 수 있다

```ts
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}

const arr = combine<number|string>([1, 2, 3], ["hello"]);
```

- 제네릭은 되도록이면 extends 를 사용하지 않는 것을 권장.
- 만약 extends 로 제약한다면 최소한의 매개변수만 사용하는 것을 권장 ex) `<T>` ok , `<T,R>` no
-  여러 값의 타입을 연관시키는 용도로 사용함

## 함수 오버로드

```ts
function makeDate(timestamp: number): Date; // 구현부 바디는 제외 한다.
function makeDate(m: number, d: number, y: number): Date; // 구현부 바디는 제외 한다.
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date { // 구현부 하나만 작성하고, 모든 타입의 가능성을 추가한다.
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3);
```

- 반드시 구현 시그너치는, 오버로드된 시그니처와 호환되어야 한다.
- 두개 이상의 시그니처를 작성한다면 순서도 중요하다. (가장 구체적인 시그니처를 가장 위에 작성한다.)
- 그래서 매칭되는게 있으면 그 시그니처로 좁힌다.
- **가능하면 오버로드 보다는 유니온 타입을 사용하는 것을 권장한다.**

### 함수 오버로드는 단 하나의 오버로드를 통해서만 해석하기 때문에, 동적으로 분석 할 수없다. 예를듬련 다음 코드는 에러가난다.

```ts
function len(s: string): number;
function len(arr: any[]): number;
function len(x: string|any[]):number {
  return x.length;
}

len(""); // OK
len([0]); // OK
len(Math.random() > 0.5 ? "hello" : [0]); // ERROR
```

## Function 타입

- 호출하면 반환값이 any 이기 때문에, 임의의 함수를 받아야할 경우가 아니라면 `()=> type` 이 좋다.

## Rest Arguments

- 배열이나, 객체는 자바스크립트에서 불변하다고 간주되지 않음. 그래서 as const 를 활용하는 사레가 있다.

```ts
// 길이가 2인 튜플로 추론됨
const args = [8, 5] as const; // 이렇게 하지않으면 Math.tan2 에서 에러가 난다. (반드시 두개의 인자만 받기 때문)
// OK
const angle = Math.atan2(...args);
```

## void 반환 타입은 무시된다

- 분명 불린 값을 리턴하지만, void 로 명시하면 타입스크립트상에서는 void 로 유지되며, 무시된다.

```ts
type voidFunc = () => void;
 
const f1: voidFunc = () => {
  return true;
};

console.log(f1()) // void
```
