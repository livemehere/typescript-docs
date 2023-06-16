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