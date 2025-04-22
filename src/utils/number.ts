export function getRandomInt(a: number, b?: number): number {
  let min: number, max: number;

  if (b === undefined) {
    min = 0;
    max = Math.floor(a);
  } else {
    min = Math.min(a, b);
    max = Math.max(a, b);
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
