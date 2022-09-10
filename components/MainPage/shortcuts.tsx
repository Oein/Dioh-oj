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
                className=" centerH"
              >
                문제 목록
              </div>
            </Link>
          </Grid>
        </Grid.Container>
        <Grid.Container>
          <Grid>
            <Image
              showSkeleton
              width={"2em"}
              objectFit="contain"
              src="../../images/bus.svg"
              alt="Dina의 이미지"
              style={{
                cursor: "pointer",
              }}
            />
          </Grid>
          <Grid>
            <Link href="/problem/1001">
              <div
                style={{
                  color: "var(--nextui-colors-text)",
                  fontSize: "var(--nextui-fontSizes-xl)",
                  cursor: "pointer",
                }}
                className=" centerH"
              >
                메타행 버스타기
              </div>
            </Link>
          </Grid>
        </Grid.Container>
        <Grid.Container>
          <Grid>
            <Image
              showSkeleton
              width={"2em"}
              objectFit="contain"
              src="../../images/shop.svg"
              alt="Dina의 이미지"
              style={{
                cursor: "pointer",
              }}
            />
          </Grid>
          <Grid>
            <Link href="/shop">
              <div
                style={{
                  color: "var(--nextui-colors-text)",
                  fontSize: "var(--nextui-fontSizes-xl)",
                  cursor: "pointer",
                }}
                className=" centerH"
              >
                상점
              </div>
            </Link>
          </Grid>
        </Grid.Container>
        <Grid.Container>
          <Grid>
            <div
              style={{
                margin: "3px",
              }}
            >
              <Image
                showSkeleton
                width={"1.7em"}
                objectFit="contain"
                src="../../images/chart.svg"
                alt="Dina의 이미지"
                style={{
                  cursor: "pointer",
                }}
              />
            </div>
          </Grid>
          <Grid>
            <Link href="/submitstatus?problem=&user=">
              <div
                style={{
                  color: "var(--nextui-colors-text)",
                  fontSize: "var(--nextui-fontSizes-xl)",
                  cursor: "pointer",
                }}
                className=" centerH"
              >
                제출현황
              </div>
            </Link>
          </Grid>
        </Grid.Container>
      </div>
    </>
  );
}
