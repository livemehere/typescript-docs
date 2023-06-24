type RemoveKindField<T> = {
    [P in keyof T as Exclude<P,'kind'>]:T[P];
}

interface Circle {
    kind: "circle";
    radius: number;
}

type WithoutKind = RemoveKindField<Circle>
