import style from "./index.module.css";

export default function NFullLoad() {
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(0 , 0 , 0 , 0.5)",
        zIndex: "9999",
      }}
      className={style.loadP}
    >
      <span className={style.moveArrow}></span>
      <span className={style.moveArrow}></span>
      <span className={style.moveArrow}></span>
      <span className={style.moveArrow}></span>
      <h1
        style={{
          position: "absolute",
          color: "white",
          zIndex: "10001",
          transform: "translate(-50% , 100%)",
        }}
      ></h1>
    </div>
  );
}
