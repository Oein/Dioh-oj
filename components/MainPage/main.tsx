import ShortCuts from "./shortcuts";

export default function Main() {
  return (
    <>
      <article className="container">
        <header
          style={{
            borderBottom: "1px solid var(--nextui-colors-neutralBorder)",
            paddingTop: "32px",
            paddingBottom: "32px",
          }}
        >
          <div
            style={{
              fontSize: "var(--nextui-fontSizes-xl3)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                borderBottom: "1px solid black",
                width: "fit-content",
                position: "relative",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "var(--nextui-fontSizes-lg)",
              }}
              className="fontX"
            >
              Dioh Online Judge / 디오
            </div>
            <div
              style={{
                fontSize: "var(--nextui-fontSizes-md)",
              }}
              className="fontX"
            >
              Infinity develop, infinity solve
            </div>
          </div>
        </header>
        <div
          style={{
            borderBottom: "1px solid var(--nextui-colors-neutralBorder)",
            paddingTop: "32px",
            paddingBottom: "32px",
          }}
        >
          <ShortCuts />
        </div>
      </article>
    </>
  );
}
