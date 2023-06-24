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

## Object Types

[type and interface 치트시트](https://www.typescriptlang.org/cheatsheets)


### 타입스크립트는 서로 다른 타입이 호환이 되는지를 체크한다

아래는 서로 다른 타입이지만, 호환이 된다.

```ts
interface Person {
  name: string;
  age: number;
}

interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}

let writablePerson: Person = {
  name: "Person McPersonface",
  age: 42,
};

// works
let readonlyPerson: ReadonlyPerson = writablePerson;
```

### Index Signatures

정확한 값은 모르지만, 그 형태를 알때 사용한다.

```ts
interface StringArray {
  [index: number]: string;
}

const myArray: StringArray = ["Bob", "Fred"];

const myStr: string = myArray[0];
```

인덱스 시그니처의 키 값은 js 런타임 시점에 모두 문자열로 변환된다.

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

interface NotOkay {
  [x: number]: Animal|Dog; // 1.ok
}

interface NotOkay {
    [x: string]: Animal|Dog; // 2.ok
}
```

인덱스 시그니처는 모든 property 가 반환 유형과 일치하도록 강제한다.

```ts
interface NumberDictionary {
  [index: string]: number; // 이미 모든 타입을 넘버로 선언해버렸기 때문에,
  length: number; // ok, 이녀석은 특정한 프로퍼티를 명시한것 이되고
  name: string; // no , 이건 안된다.
}

// 하지만 유니온 타입으로 해주면 됨
interface NumberOrStringDictionary {
    [index: string]: number | string;
    length: number; // ok, length is a number
    name: string; // ok, name is a string
}
```

### Excess Property Checks

- 인터페이스에 정의되지 않은 프로퍼티를 가지고 있으면 에러가 난다.
- 하지만 중요한 점 중 하나는, 객체에 없는 프로퍼티에 접근하면 에러가 나는것이 당연한데, 한번 변수에 할당해서 사용하면 에러가 나지 않는 점에 유의해야한다.

```ts
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  return {
    color: config.color || "red",
    area: config.width ? config.width * config.width : 20,
  };
}
// ---cut---
let squareOptions = { colour: "red", width: 100 };
let squareOptions2 = { colour: "red" };
let mySquare = createSquare(squareOptions); // ok
mySquare = createSquare({ colour: "red", width: 100 }); // 에러
mySquare = createSquare(squareOptions2); // 에러 (이건 최소한의 조건도 맞지 않기 때문에 발생)
```

## 타입 확장

- interface 는 확장이 가능하고, 대상으로 하는 확장 은 interface, type, class 모두 가능하다.

```ts
type BasicAddress = {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

class P {
  price:number;
  constructor(price:number){
    this.price = price;
  }
}

interface AddressWithUnit extends P { // P 자리에는 클래스, 인터페이스, 타입 모두 가능하다.
  unit: string;
}

function getObj(obj:AddressWithUnit){
  obj.price
}
```

## Array , ReadonlyArray

- ReadonlyArray 는 읽기 전용 배열이다. push, pop, splice 등의 메소드를 사용할 수 없다.
- `Array<string>` = `string[]`
- `ReadonlyArray<string>` = `readonly string[]`
- 다른 객체의 readonly 속성끼리 호환이 되는 반면, Array 와 ReadonlyArray 는 호환이 되지 않는다.

```ts
let x: readonly string[] = [];
let y: string[] = [];
 
x = y;
y = x;
```

## Tuple

- rest parameter 의 순서가 자유롭다

```ts
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];
```

- 네이밍을 자유롭게 할 수 있다

```ts
function readButtonInput(...args: [string, number, ...boolean[]]) {
  const [name, version, ...input] = args;
  // ...
}
```

## Generics

- <>를 생략하면 추론한다.
- 제네릭으로 interface, type, class 를 만들 수 있다. (열거형, 네임스페이스는 x)

### 다양한 형태의 동일한 제네릭

```ts
// 제네릭을 호출 시그니처 에만 사용
interface GenericIdentityFn {
    <Type>(arg: Type): Type;
}

function identity<Type>(arg: Type): Type {
  return arg;
}
let myIdentity: GenericIdentityFn = identity;

// or 
// 인터페이스 자체에 제네릭 선언
interface GenericIdentityFn<Type> {
    (arg: Type): Type;
}
let myIdentity2: GenericIdentityFn<number> = identity;
```

### class 제네릭

- static 에서는 제네릭을 사용할 수 없다.

```ts
class GenericNumber<Type> {
  static totalValue: Type; // error
  zeroValue: Type; //ok
  add: (x: Type, y: Type) => Type; // ok
}
```

- 제네릭에서 클래스 타입 표현하기

```ts
class Bee extends Animal {
  keeper: BeeKeeper;
}
 
class Lion extends Animal {
  keeper: ZooKeeper;
}

function create<Type extends Animal>(c: {new ():Type}): Type {
  return new c();
}

create(Lion).keeper.nametag; // 타입검사!
create(Bee).keeper.hasMask;  // 타입검사!
```

### 변수 정의와 제약

- 작성하다보면 <> 바깥쪽에서 타입을 지정할때 extends 를 사용하는 경우가 종종있는데, 이는 안된다. 아래 예시처럼 제네릭에대한 제약을 걸때는 <> 안에서 해결하자.
- 
```ts
function identify<T,K extends keyof T>(obj:T,key:K):T[K]{
  return obj[key];
}
```

## typeof

```ts
// 함수의 리턴타입 가져오기
type A = (x:number)=> boolean;
type K = ReturnType<A>;

// 값은 타입이 될 수 없음으로, typeof 를 사용해서 리턴타입 가져오기
function f(){
  return {x:3, y:3}
}
type FK = ReturnType<typeof f>;

```

## Indexed Access Types 

> 값은 타입이 될 수 없음에 유의하고, 사용하기 위해서는 `typeof` 를 사용해야한다.  
> 인덱싱에 사용할 수 있는 값으로, const 로 선언된 변수 또한 안된다. as const 해도 안된다. 반드시 타입만 가능!

```ts
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];
 
// 값은 타입이 될 수 없으니, 값에서 타입을 추출하려면 typeof 사용!!!
 type P = typeof MyArray[number];

// 똑같음
 type A = P['age'];
 type RA = typeof MyArray[number]['age']
```

## Conditional Types

- extends 를 사용해서 타입에 삼항 연산자를 사용할 수 있다

```ts
type IsString<T> = T extends string ? true : false;
type A = IsString<string>; // true
type B = IsString<number>; // false
```

### 조건부 타입으로 타입 제한하기

```ts
type MessageOf<T extends {message:unknown}> = T["message"];

const obj = {
    name:'kong',
    message:1
}

type M = MessageOf<typeof obj>;
```

### never 활용해서 타입에러 제거하기

```ts
 
type MessageOf<T extends {message:unknown}> = T["message"];

const obj = {
    name:'kong',
}

type M = MessageOf<typeof obj>; // message가 없는 타입이 들어와서 에러남
```

```ts
// 없는 경우도 분기처리를 해놨기 때문에 에러 발생안하고 never 로 추론됨
type MessageOf<T> = T extends {message:unknown} ? T["message"] : never;

const obj = {
    name:'kong',
}

type M = MessageOf<typeof obj>;
```

### infer

- infer 를 사용해서 타입을 생성할 수 있다. (마치 변수 생성)

```ts
type Flat<T> = T extends Array<infer I> ? I : T;
type A = Flat<string>
```

### 제네릭의 분산법칙

```ts
type ToArray<Type> = Type extends any ? Type[] : never;
type StrArrOrNumArr = ToArray<string | number>; // string[] | number[] 이렇게 분산되는데 이것을 막고자한다면

type ToArrayNonDist<Type> = [Type] extends any ? Type[] : never; // 이렇게 [] 로 한번씩 감싸주면된다.
```

## Mappped Types

- 기존 타입을 변환해서 새로운 타입을 만들어낸다.(중복되는 타입을 줄일 수 있다)
- 보통 인덱스 시그니처 타입을 사용한다.

```ts
type OptionsFlags<Type> = {
    [Property in keyof Type]: boolean;
};

type FeatureFlags = {
    darkMode: () => void;
    newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<FeatureFlags>; // {darkMode:boolean, newUserProfile:boolean}
```

### Mapping Modifiers

- readonly, ? 등의 타입을 변환할 수 있다.

```ts
type ReamoveReadonly<Type> = {
    -readonly [Property in keyof Type]: boolean;
};

type ReamoveOptional<Type> = {
    [Property in keyof Type]-?: boolean;
};

type FeatureFlags = {
    readonly darkMode?: () => void;
    readonly newUserProfile?: () => void;
};

type FeatureOptions = ReamoveReadonly<FeatureFlags> // {darkMode?:boolean, newUserProfile?:boolean}

type FeatureOptions2 = ReamoveOptional<FeatureFlags> // {darkMode:()=>void, newUserProfile:()=>void}
```

### never 로 키 필터링 하기

> type Exclude<T, U> = T extends U ? never : T;

```ts
type RemoveKindField<T> = {
    [P in keyof T as Exclude<P,'kind'>]:T[P];
}

interface Circle {
    kind: "circle";
    radius: number;
}
 
type WithoutKind = RemoveKindField<Circle>; // {radius:number}
```

### 더 복잡한 예시

```ts
type EventConfig<T extends {kind:string}> = {
    [P in T as P['kind']]: (event:P)=> void;
}

type SquareEvent = { kind: "square", x: number, y: number };
type CircleEvent = { kind: "circle", radius: number };

type Config = EventConfig<SquareEvent | CircleEvent> // {square:(event:SquareEvent)=>void, circle:(event:CircleEvent)=>void}
```

```ts
type ExtractPII<T> ={
    [P in keyof T]:T[P] extends {pii:true} ? true : false; // 이런식으로도 가능하다.
}

type DBFields = {
  id: { format: "incrementing" };
  name: { type: string; pii: true };
};
 
type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
```


### Key Remapping via as

- as 를 사용해서 키를 바꿀 수 있다.

```ts
type MakeGetter<Type> = {
    [Property in keyof Type as `get${string & Property}`]: boolean;
};

type FeatureFlags = {
    darkMode: () => void;
    newUserProfile: () => void;
};

type FeatureOptions = MakeGetter<FeatureFlags> // {getdarkMode:boolean, getnewUserProfile:boolean}
```

## Template Literal Types

- 보간법으로 동적으로 타입을 생성할 수 있다.
- 아래의 예시처럼 여러 경우의 수를 만들어낼 수 있다.

```ts

type Kong = 'Kong' | 'Ha'
type wold = `hello ${Kong}`; // hello Kong | hello Ha


type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";
type All = `${EmailLocaleIDs | FooterLocaleIDs}_ME` // welcome_email_ME | email_heading_ME | footer_title_ME | footer_sendoff_ME
```

- 또다른 예시

```ts
type WatchProps<T> = {
    on(event:`${string & keyof T}Changed`,cb:(newValue:any)=>void): void;
}

declare function makeWatchedObject<T extends object>(obj:T):T & WatchProps<T>

const person = makeWatchedObject({
    name:'kong',
    age:24,
})

person.on('nameChanged',(v)=>{
 console.log(v);  
})
```

### 인덱스 시그니처를 사용해서 타입을 제한할 수 있다. 

```ts
interface WatchProps<T> {
    on<K extends string & keyof T>(event:`${K}Changed`,cb:(newValue:T[K])=>void): void;
}

declare function makeWatchedObject<T extends object>(obj:T):T & WatchProps<T>

const person = makeWatchedObject({
    name:'kong',
    age:24,
})

person.on('nameChanged',(v)=>{ // v:string
 console.log(v);  
})


person.on('ageChanged',(v)=>{ // v:number
 console.log(v);  
})
```

### String 타입 조작 

```ts
// 대문자1
type Hello = 'hello';
type UpHello = Uppercase<Hello> // HELLO

// 대문자2
type IdKey<K extends string> = `ID-${Uppercase<K>}`;
type MainID = IdKey<'main'>; // ID-MAIN

// 소문자
type IdKeyLow<K extends string> = `ID-${Lowercase<K>}`;
type MainLowID = IdKeyLow<'MAIN'>; // ID-main

// 캐멀케이스
type Str = 'hello,world';
type CamelStr = Capitalize<Str>; // Hello,world

// 캐멀케이스 반대
type Str2 = 'HELLO,WOLRD';
type Str2UnCap = Uncapitalize<Str2>; // hELLO,WOLRD
```
