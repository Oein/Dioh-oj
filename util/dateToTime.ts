export default function DTT(dt: Date): string {
  const curr = new Date();
  return new Date(
    dt.getTime() + curr.getTimezoneOffset() * 60 * 1000
  ).toLocaleString();
}
