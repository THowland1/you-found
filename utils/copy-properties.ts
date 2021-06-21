export function copyProperties<T>({ from, to }: { from: T; to: T }) {
  for (const key in from) {
    to[key] = from[key];
  }
}
