import { Grid, Link, Text } from "@nextui-org/react";

export default function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        height: "128px",
        background: "var(--nextui-colors-accents1)",
        marginTop: "10px",
      }}
    >
      <article className="container">
        <Grid.Container>
          <Grid>
            <Grid.Container>
              <Grid>
                <Text size="$4xl" className="font">
                  Dioh
                </Text>
              </Grid>
              <Grid>
                <Text
                  size="$sm"
                  className="font centerH m425"
                  style={{
                    marginLeft: "5px",
                    color: "var(--nextui-colors-accents7)",
                  }}
                >
                  (v.{process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA})
                </Text>
              </Grid>
            </Grid.Container>
            <Grid.Container>
              <Grid>
                <Link href="/adminList">관리진</Link>
              </Grid>
              <Grid>
                <div
                  style={{
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  |
                </div>
              </Grid>
              <Grid>
                <Link href="https://github.com/oein/dioh">Github</Link>
              </Grid>
            </Grid.Container>
          </Grid>
          <Grid>
            <div
              className="m768"
              style={{
                width: "100%",
                height: "87px",
                paddingTop: "15px",
              }}
            >
              <ins
                className="adsbygoogle"
                style={{
                  display: "block",
                  minWidth: "450px",
                  height: "87px",
                  width: "100%",
                }}
                data-ad-client="ca-pub-7648972371680937"
                data-ad-slot="5682770890"
                data-ad-format="auto"
                data-full-width-responsive="true"
              ></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
              </script>
            </div>
          </Grid>
        </Grid.Container>
      </article>
    </footer>
  );
}
