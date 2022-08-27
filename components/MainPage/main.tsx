import { Grid, Image } from "@nextui-org/react";

export default function Main() {
  return (
    <>
      <div
        style={{
          fontSize: "var(--nextui-fontSizes-xl4)",
        }}
      >
        새로 추가된 문제
      </div>
      <Grid.Container>
        <Grid>
          <Image
            showSkeleton
            width={"2em"}
            objectFit="contain"
            src="/images/articles.svg"
            alt="Dina의 이미지"
          />
        </Grid>
        <Grid>
          <div
            style={{
              position: "relative",
              top: "50%",
              margin: "0px",
              padding: "0px",
              transform: "translate(10px , -50%)",
              fontSize: "var(--nextui-fontSizes-xl)",
            }}
          >
            <strong>1000 : A+B</strong>
          </div>
        </Grid>
      </Grid.Container>
    </>
  );
}
