type Circle  = {
    kind: "circle";
    radius: number;
}

type Square = {
    kind: "square";
    sideLength: number;
}

interface Triangle {
  kind: "triangle";
  sideLength: number;
}


type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck:Triangle = {
        kind: "triangle",
        sideLength: 10,
      };
      return _exhaustiveCheck;
  }
}

const res = getArea({ kind: "triangle", radius: 10 });