import MyHead from "../components/head";

export default function WAD() {
  return (
    <>
      <MyHead />
      <article className="container">
        <div>
          <div
            style={{
              fontSize: "var(--nextui-fontSizes-8xl)",
              textAlign: "center",
            }}
          >
            DiohOJ
          </div>
        </div>
      </article>
    </>
  );
}
