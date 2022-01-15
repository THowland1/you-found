export function Dump({ value }: { value: any }): JSX.Element {
  return <pre>{JSON.stringify(value, null, 2)}</pre>;
}
