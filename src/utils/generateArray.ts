export function generateArray(length: number) {
  return [...new Array(length)].map((und, i) => i);
}
