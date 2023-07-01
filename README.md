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

## Class

### --strictPropertyInitialization

- 클래스의 프로퍼티를 초기화하지 않으면 에러가 발생한다.
- 반드시 생성자 내에서만 초기화해야하고, 내부 메서드를 통해서 초기화는 인정되지 않는다.
- 하지만 ! 로 할당을 어설션할 수 있다.

```ts
class A {
    name: string; // 에러
}

// ---

class B {
    name: string; // ok
    constructor() {
        this.name = 'kong';
    }
}
```

### getter, setter

- getter 를 선언하고, setter 를 선언하지 않으면 readonly 가 된다.
- setter 의 매개변수의 타입을 지정하지 않으면, getter 의 반환 타입이 setter 의 매개변수 타입으로 추론한다.

### property 도 인덱스 시그니처를 사용할 수 있다.

```ts
class MyClass {
    [key:string]:any;

    constructor(){
        this.name = 'kong';
    }
}
```

### implements 가 구현을 해주진 않음을 주의해야한다.

```ts
interface A {
  x: number;
  y?: number;
}
class C implements A {
  x = 0;
  // y 속성을 선언하지 않았음으로
}
const c = new C();
c.y = 10; // error 
```

### extends 는 구현을 해주지만, 생성자가 있을 경우 super() 를 호출해야한다.

- 부모 클래스에 생성자가 선언되있지 않다면, 자식에서도 super() 를 호출하지 않아도 된다.

```ts
class Animal {
  move() {
    console.log("Moving along!");
  }
}
 
class Dog extends Animal {
  woof(times: number) {
    for (let i = 0; i < times; i++) {
      console.log("woof!");
    }
  }
}
 
const d = new Dog();
d.move();
d.woof(3);
```

### 메서드 오버라이딩

- 메서드 오버라이딩을 할 때, 부모의 메서드를 호출하고 싶다면 super 를 사용한다.
- 또한 오버라이딩은, 매개변수의 갯수,타입을 맞춰야한다.

```ts
class Base {
  greet() {
    console.log("Hello, world!");
  }
}
 
class Derived extends Base {
  greet(name?: string) {
    if (name === undefined) {
      super.greet();
    } else {
      console.log(`Hello, ${name.toUpperCase()}`);
    }
  }
}
 
const d = new Derived();
d.greet();
d.greet("reader");
```

```ts
// @errors: 2416
class Base {
  greet() {
    console.log("Hello, world!");
  }
}

class Derived extends Base {
  // Make this parameter required
  greet(name: string) { // 에러 name 이 없을수도있어야함.
    console.log(`Hello, ${name.toUpperCase()}`);
  }
}
```

### Type-only Field Declarations

아래의 예시와 같은 상황이 있다.

```ts
interface Animal {
  dateOfBirth: any;
}
 
interface Dog extends Animal {
  breed: any;
}

class AnimalHouse {
    resident:Animal;
    constructor(animal:Animal){
        this.resident = animal;
    }
}

class DogHouse extends AnimalHouse {
    constructor(dog:Dog){
        super(dog);
    }
}
```

위와 같은 상태에서 엄현히 Dog 타입을 입력받았지만, AnimalHouse 에서 resident 는 Animal 이기 때문에 Dog 의 breed 를 사용할 수 없다.  
그렇지만 field 를 재선언할 수 는 없기 때문에, 타입만 조정해 줄 수 있다.

```ts
class DogHouse extends AnimalHouse {
    declare resident:Dog; // 이렇게 하면 타입만 재선언 된다.
    constructor(dog:Dog){
        super(dog);
    }
}
```

### static 멤버

- static 멤버도 private, protected, public 을 사용할 수 있다.
- static 맴버도 상속이된다.

```ts
class Base {
  static getGreeting() {
    return "Hello world";
  }
}
class Derived extends Base {
  myGreeting = Derived.getGreeting();
}
```

- static 멤버는 제네릭 타입을 사용할 수 없다.

```ts
class MyClass<T> {
  static x: T; // error, static 멤버는 제네릭 타입을 사용할 수 없다.
}
```

### this 컨텍스트를 잃지 않는 메서드 선언방법 

```ts
class MyClass {
  name = "MyClass";
  getName() {
    return this.name;
  }
}
const c = new MyClass();
const obj = {
  name: "obj",
  getName: c.getName,
};
 
// Prints "obj", not "MyClass"
console.log(obj.getName());
```

아래처럼 arrow function 으로 선언하면 this 컨텍스트를 잃지 않는다.

```ts
class MyClass {
  name = "MyClass";
  getName = () => {
    return this.name;
  };
}
const c = new MyClass();
const g = c.getName;
// Prints "MyClass" instead of crashing
console.log(g());
```

### class 표현식

클래스도 익명 클래스 표현식이 있다.

```ts
const KongClass = class<T> {
    content:T;
    constructor(value:T){
        this.content = value;
    }
}

const kong = new KongClass('HI');
```

### this 를 활용한 타입 가드

```ts
class FileSystemObj {
    
    constructor(public path:string){}
    isFile():this is FileRep{
        return this instanceof FileRep;
    }

    isDirectory():this is Directory{
        return this instanceof Directory;
    }
}


class FileRep extends FileSystemObj {
    constructor(path:string, public content:string){
        super(path);
    }
}

class Directory extends FileSystemObj {
    constructor(path:string, public children:FileSystemObj[]){
        super(path);
    }
}

function print(obj:FileSystemObj){
    if(obj.isFile()){
        console.log(obj.content);
    }else if (obj.isDirectory()){
        console.log(obj.children)
    }
}
```

### 추상 클래스 

```ts
abstract class Base {
  abstract getName(): string;
 
  abstract printName():void;
}
 
class Derived extends Base {
  getName() {
    return "world";
  }
  printName(){
    console.log(this.getName());
  }
}
 
const d = new Derived();
d.printName();
console.log(d.getName())
```

### 클래스 자체를 인자로 받기

```ts
function greet(ctor: new () => Base) {
  const instance = new ctor();
  instance.printName();
}
greet(Derived);
greet(Base); // error 추상 클래스는 안된다. 에초에 new 연산으로 생성이 불가능하니까.
```

### 클래스간 관계

- 타입스크립트 클래스는 다른 유형과 마찬가지로 구조적으로 비교된다.

```ts
class Point1 {
  x = 0;
  y = 0;
}
 
class Point2 {
  x = 0;
  y = 0;
}
 
// OK
const p: Point1 = new Point2();
```

### Cross-instance private access

- 다른 OOP 언어에서는 private 멤버는 어떤 방식으로든 외부에서 접근이 불가능한데, Typescript 에서는 private 멤버는 같은 클래스의 다른 인스턴스에서 접근이 가능하다.

```ts
class A {
  private x = 10;
 
  public sameAs(other: A) {
    // No error
    return other.x === this.x;
  }
}
```

## Modules

- javascript 모듈 시스템은 ES6 모듈 시스템으로 거의 굳혀지고있다.
- 타입스크립트는 ES6 모듈 시스템을 지원한다.
- import, export 가 없는 파일은 global scope 로 취급된다.
- ES Modules interop ??!


### 타입스크립트가 모듈을 처리하는 주요 3가지

1. Syntax : 어떤 문법을 사용할 것인가?
2. Module Resolution : 파일시스템에서 모듈을 찾는 방법
3. Module Output Target : Javascript 로 컴파일 될 모듈의 형태

### type import

- babel, swc, esbuild 등과 같은 typescript 컴파일러가 아닌 다른 컴파일러들이 typescript 를 안전하게 제거할 수 있도록 명시할 수 있다.

### ES Module + CommonJS Behavior

```ts
import fs = require("fs"); // 이렇게도 된다.
```

## DOM Manipulation

### children vs childNodes

- children 은 Element 만 반환한다.
- childNodes 는 Element, Text, Comment, ProcessingInstruction, CDATASection, EntityReference 를 반환한다.

```js
<div>
  <p>Hello, World</p>
  <p>TypeScript!</p>
</div>

const div = document.getElementByTagName("div")[0];
div.children;
// HTMLCollection(2) [p, p]
div.childNodes;
// NodeList(2) [p, p]
```

## Babel vs tsc

- 프레임워크가 설정해준다면 그것을 따라가라.
- 결과물이 비슷하다면 tsc 사용하라
- 빌드내 파이프라인이 필요하다면 babel 을 사용하고, 타입검사만 tsc 로 하라

> 결론은 트랜스파일링은 babel, 타입검사는 tsc.

- 바벨의 단점은 트랜스파일링 중 타입검사를 할 수 없다는 점인데, 에디터에서 잡지 못한 오류가 프로덕션 코드에포함될 수 있다. 그래서 타입체킹을 tsc 로 해주는 것이다.

## Javascript 에서 Typescript 사용하는 방법

### JSDoc

- 경고정도만 하고, 컴파일에 영향 x

```ts
/** @type {number} */
var x;
x = 0; // 성공
x = false; // 성공?!
```

### @ts-check

- 컴파일 할 때 타입체킹을 한다.

```js
// @ts-check
// @errors: 2322
/** @type {number} */
var x;
x = 0; // 성공
x = false; // 성공 아님
```

## tsconfig.json

- `tsc` 는 `tsconfig.json` 을 참조한다.

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "target": "ES2022",
    "allowJs": true,
    "module": "ES6", // 컴파일된 결과물의 모듈 시스템
    "noFallthroughCasesInSwitch": true, // switch 문에서 break 누락시 에러
    "noImplicitReturns": true, // 반환 타입 명시하도록 강제
    "allowUnreachableCode": true, // 접근 불가 코드 허용
    "noImplicitAny":true,
    "noEmitOnError": true, // 컴파일 에러 발생 시 결과물 생성 X
    "moduleResolution": "Node", // 모듈 해석 방식
    "declaration": true, // 결과물로 .d.ts 파일 포함
    "emitDeclarationOnly": true // 결과물로 .d.ts 파일만 생성
  },
  "include": ["./src/**/*"]
}
```

## any, Object, {}

- 이들은 만능 타입으로 사용되곤 한다.
- 셋중에 사용해야할 일이 생긴다면 우선순위는 `any` > `{}` > `Object` 를 사용해라.

## @ts-ignore, @ts-expect-error

- 타입 에러를 무시하는 주석이다.

## 타입 패키지를 만들 때는 package.json 도 수정이 필요하다.

```json
{
  "main": "dist/global.d.ts",
  "types": "dist/global.d.ts"
}
```

## Declaration Files

- 어떤 라이브러리를 가져왔을 때, 선언 타입이 없다면, declare 키워드로 선언해주어 활용 하는 경우.
- `isolatedModules` 옵션을 사용하면, 타입스크립트는 모듈을 단독으로 컴파일하고, 전역 스코프에 선언된 타입들은 무시한다.
  - 하지만 `.d.ts` 파일은 전역 스코프로 인식한다(?)

### d.ts 파일

- `import`, `export` 구문이 포함되어있지 않으면 전역 스코프로 인식한다.
  - 만약 모듈로 인식하게 하고싶다면 `export` 나 `import` 구문을 추가해주면된다.
- 구현부는 포함할 수 없으며, 타입만 선언할 수 있는 파일이다.
- 컴파일 할 떄 옵션으로 `--declaration` 을 주면 `.d.ts` 파일을 생성해주기 때문에 직접 작성하지 않아도된다.
  - 하지만 나는 주로 타입을 d.ts 에 작성하고 import 해서 사용함으로써, 명시적으로 타입을 분리해둔다.

```ts
/* 전역 변수 선언 */
declare var Kakao:any;

/* 전역 함수 선언 */
declare function sum(a:number,b:number):number;

/* 전역 클래스 선언 */
declare class Person {
    name:string;
    constructor(name:string);
}

/* 전역 인터페이스 선언 */
interface Person2 {
    name:string;
    age:number;
}

/* 네임스페이스 선언 */
declare namespace KongLib {
    const name:string;
    const age:number;
    function hello():void;
}

/* 모듈 선언 */
declare module KongMath {
    function add(a:number,b:number):number;
    function subtract(a:number,b:number):number;
}
```

### `declare namespace` vs `declare module`

??

### default exports 주의사항

- `export default` 를 .d.ts 에서 사용하려면 `esModuleInterop` 옵션을 true 로 설정해야한다.
  - 만약 이옵션을 true 로하지 않고서(할수없는상황) 이라면 `export default` 를 사용하지말고, `export =` 를 사용하면된다.

```ts
declare function getArrayLength(arr: any[]): number;
declare namespace getArrayLength {
  declare const maxInterval: 12;
}
export = getArrayLength;
```

### 전역 스코프 타입 수정하기

- `declare global` 을 사용하면 전역 스코프에 타입을 추가할 수 있다.

```ts
declare global {
    interface String {
        startsWithHello(): boolean;
    }
    interface Array<T> {
        reverseAndSort(): T[];
    }
}
```

## NPM 배포

- `--declaration` 플래그를 사용하여 `.d.ts` 파일을 생성한다.
- `package.json` 에 `types` 필드를 추가한다. (생략해도 상관없음)

```json
{
    "name": "awesome",
    "author": "Vandelay Industries",
    "version": "1.0.0",
    "main": "./lib/main.js",
    "types": "./lib/main.d.ts" // or typings
}
```

- types 패키지를 배포할때는, @types/[모듈] 패키지도 함께 배포해야한다.
- `peerDependencies` 혹은 `dependencies` 에 추가한다. (devDependencies 는 사용자가 직접 설치해야되서 안됨)🚨 타입 패키지 한정임 주의!

```json
{
    "name": "awesome",
    "author": "Vandelay Industries",
    "version": "1.0.0",
    "main": "./lib/main.js",
    "types": "./lib/main.d.ts",
    "peerDependencies": {
        "@types/node": "^14.14.37"
    }
}
```

## Project Configuration

- jsconfig.json 과 tsconfig.json 은 거의 유사하고, jsconfig 에서는 javascript 에 대한 설정들이 default 로 설정되어있다.
- extends 를 사용하여 공통 설정을 재사용할 수 있다. ex) node, react-native... 등등 권장설정이 있을 경우 제공하고있음.

### CLI

- glob 패턴으로 파일을 선택할 수 있다.
- ` npx tsc -p tsconfig.dev.json` 처럼 config 파일을 지정할 수 있다.
- `--baseUrl` 절대경로의 기준이 되는 디렉토리를 지정한다.
- `inlineSources` 이속성은 버그가있는지, 컴파일 결과가 안나온다. `inlineSourceMap` 이거쓰면된다.
- tsc -b (build 모드) 는 noEmitOnError 를 강제로 true 로 설정한다.

### with bundler

- webpack, babel 의 경우에는 tsconfig.json 을 자동 참조한다. (다른것도 그럴듯..?)

## tsconfig.json 

### Files

- 컴파일 할 파일을 지정한다. (glob 패턴 사용가능)

### Extends

- 다른 tsconfig 파일을 상속받을 수 있다. (자신의 파일의 속성이 우선순위가 높다. overwrite)

### Include

- Include 는 files 가 명시되어있으면, [] 이고, 명시되어있지 않으면, ["**/*"] 이다.
- glob 패턴을 사용할 수 있다.
  - `*` : 0개 이상의 문자
  - `?` : 1개의 문자
  - `**/` : 하위 디렉토리
  - 만약 확장자가 정해지지 않으면, 지원하는 확장자만 포함된다. 기본적으로 ts, tsx, js, jsx 만 지원한다.(allowJs 를 했을 경우)

### Exclude

- glob 패턴을 사용할 수 있다.
- 기본 값은 `node_modules` `bower_components` `jspm_packages` `outDir` 이다.

### Compiler Options

```
allowUnreachableCode : 절대로 실행되지 않는 코드를 허용한다.
exactOptionalPropertyTypes : optional property 를 주지만, 명시적으로 undefined 를 할당하면 에러를 발생시킨다.
noFallthroughCasesInSwitch : switch 문에서 break 를 하지 않으면 에러를 발생시킨다.
noImplicitOverride : class 에서 override 를 명시하지 않으면 에러를 발생시킨다. ex) `override` download() {...}
noImplicitReturns : 함수에서 return 을 명시하지 않으면 에러를 발생시킨다.
noImplicitThis : this 를 명시하지 않으면 에러를 발생시킨다.(통상 this 는 호출시점에 정해져서, 명시적으로 this 를 사용하는 경우가 드물다.)
noPropertyAccessFromIndexSignature : 없는 프로퍼티를 'dot notation' 으로 접근하면 에러를 발생시킨다. index signature 를 사용하면 해결할 수 있다. ex) person.name (x) -> person['name'] (o)
noUncheckedIndexedAccess : index signature 를 사용할때 undefined 를 추가해준다.
strictBindCallApply : bind, call, apply 를 사용할때 파라미터 타입을 체크한다.(원레는 자유)
strictFunctionTypes : 함수의 파라미터 타입을 체크한다. 하지만 method 의 경우는 체크하지 않는다.
useUnknownInCatchVariables : catch 에서 unknown 을 사용할 수 없다.
allowUmdGlobalAccess : 전역 객체 접근을 허용한다. (jQuery, lodash 등등 런타임에서 사실은 접근이 가능한 녀석들)
baseUrl : 절대경로의 기준이 되는 디렉토리를 지정한다. (path 와 연계해서 사용하는 것이 node_modules 과 같은 라이브러리를 사용할때 편리하다.)
paths : baseUrl 을 사용할때, alias 를 지정할 수 있다. (반드시 번들러와 함꼐 사용해야한다. tsc 는 해석을 할 수 있도록 map 을 작성해줄 뿐 resolve 하지 않는다)
moduleResolution : 모듈을 해석하는 방식을 지정한다. (node, classic * classic 사용할 일은 현대에 없다.)
rootDir : 컴파일 할 파일의 기준이 되는 디렉토리를 지정한다. ( . or src 르 사용하곤 하는데, 파일 구조가 달라지니 필요에 따라 설정)
typeRoots : 타입 파일의 기준이 되는 디렉토리를 지정한다. (node_modules/@types 를 사용할때, 다른 디렉토리를 지정할 수 있다.)
declarationDir : d.ts 파일의 기준이 되는 디렉토리를 지정한다. (outDir 과 같은 디렉토리를 지정할 수 있다.) ex) "dist/typings"
declarationMap : 정의로 이동 할 경우 원본파일로 참조할 수 있도록 d.ts 파일에 맵을 생성한다.
noEmit : 컴파일 결과를 생성하지 않는다. 번들러와 함께 사용할 때 유용하다.(번들러에게 컴파일을 맡긴다.)
preserveConstEnums : const enum 을 보존한다. (enum 을 사용할때, const enum 을 사용하면, enum 을 사용한 모든 곳에 상수로 치환된다.)
stripInternal : jsdoc 의 @internal 을 d.ts 로 추출하지 않는다.

allowSyntheticDefaultImports : default export 가 없는 모듈에 한해서 default import 를 허용한다. ex) import * as _ from 'lodash' -> import _ from 'lodash'
esModuleInterop : commonjs 모듈을 es6 모듈로 import 할 수 있도록 한다. (import _ from 'lodash' -> import _ from 'lodash-es') 위와 호환되는 옵션임
forceConsistentCasingInFileNames : 파일명의 대소문자를 강제한다. (window 에서는 대소문자를 구분하지 않지만, linux 에서는 구분한다.)
isolatedModules : 파일을 모듈로 취급한다. (import, export 를 사용하지 않으면 에러를 발생시킨다.) * 그렇지 않으면 번들러가 해석할 때 문제가 발생할 수 있다.
experimentalDecorators : decorator 를 사용할 수 있도록 한다. (ex) @Component)
```

## References

### Utility Types

- `Parameters<T>` : 함수의 파라미터 타입을 추출한다.
- `ConstructorParameters<T>` : 클래스의 생성자 파라미터 타입을 추출한다.

```ts
declare function f1(arg: { a: number; b: string }): void;
type T = Parameters<typeof f1>; // [arg: { a: number; b: string }]

const a:T = [
  {
    a:1,
    b:'2'
  }
]

f1(...a);


class Person  {
  constructor(name:string, age:number){

  }
}

type T0 = ConstructorParameters<typeof Person>; // [string, number]
```

