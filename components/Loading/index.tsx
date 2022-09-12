import style from "./index.module.css";

export default function Load() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: "0px",
        left: "0px",
        bottom: "0px",
        right: "0px",
        background: "black",
        opacity: "0.5",
        zIndex: "99999",
      }}
    >
      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "white",
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
    </div>
  );
}
