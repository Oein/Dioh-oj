import { Grid, Image } from "@nextui-org/react";
import Link from "next/link";

export default function ShortCuts() {
  return (
    <>
      <div>
        <Grid.Container>
          <Grid>
            <Image
              showSkeleton
              width={"2em"}
              objectFit="contain"
              src="../../images/articles.svg"
              alt="Dina의 이미지"
              style={{
                cursor: "pointer",
              }}
            />
          </Grid>
          <Grid>
            <Link href="/problemSet/0">
              <div
                style={{
                  color: "var(--nextui-colors-text)",
                  fontSize: "var(--nextui-fontSizes-xl)",
                  cursor: "pointer",
                }}
                className="font centerH"
              >
                문제 목록
              </div>
            </Link>
          </Grid>
        </Grid.Container>
      </div>
    </>
  );
}
