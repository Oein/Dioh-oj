import MyHead from "../components/head";

export default function WAD() {
  return (
    <>
      <MyHead />
      <article
        className="container"
        style={{
          height: "calc(100vh - 76px)",
          width: "100vw",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50% , -50%)",
          }}
        >
          <div
            style={{
              fontSize: "var(--nextui-fontSizes-9xl)",
              textAlign: "center",
            }}
          >
            : )
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "var(--nextui-fontSizes-xl)",
            }}
          >
            디오가 열심히 공부해서 완성된 페이지로 돌아올게요
          </div>
        </div>
      </article>
    </>
  );
}
