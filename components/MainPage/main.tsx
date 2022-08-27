import { Grid, Image } from "@nextui-org/react";
import Link from "next/link";

export default function Main() {
  return (
    <>
      <article className="container">
        <div
          style={{
            fontSize: "var(--nextui-fontSizes-xl4)",
          }}
        >
          문제 리스트
        </div>

        <Link href="/problem/1000">
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
                  cursor: "pointer",
                }}
              >
                <strong>1000 : A+B</strong>
              </div>
            </Grid>
          </Grid.Container>
        </Link>
      </article>
    </>
  );
}
