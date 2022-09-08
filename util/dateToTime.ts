export default function DTT(dt: Date): string {
  const curr = new Date();
  return new Date(
    dt.getTime() + curr.getTimezoneOffset() * 60 * 1000
  ).toLocaleString();

  // 2. UTC 시간 계산
  const utc = new Date(curr.getTime() + curr.getTimezoneOffset() * 60 * 1000);

  console.log("ME : " + dt.getTime() + "  UTC : " + utc.getTime());
  let diff = (utc.getTime() - dt.getTime()) / 1000;
  console.log("Diff : " + diff);
  if (diff < 1) {
    return "지금";
  }
  if (diff < 60) {
    return `${Math.round(diff)}초 전`;
  }
  diff /= 60;
  if (diff < 60) {
    return `${Math.round(diff)}분 전`;
  }
  diff /= 60;
  if (diff < 60) {
    return `${Math.round(diff)}시간 전`;
  }
  diff /= 24;
  if (diff < 31) {
    return `${Math.round(diff)}일 전`;
  }
  diff /= 31;
  if (diff < 12) {
    return `${Math.round(diff)}달 전`;
  }
  diff /= 12;
  if (diff < 12) {
    return `${Math.round(diff)}년 전`;
  }
  diff /= 100;
  return `${Math.round(diff)}세기 전`;
}
