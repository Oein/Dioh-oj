import { Grid, Link, Text } from "@nextui-org/react";
import { useEffect } from "react";

declare let adsbygoogle: any;

export default function Footer() {
  useEffect(() => {
    var ads = document.getElementsByClassName("adsbygoogle").length;
    for (var i = 0; i < ads; i++) {
      try {
        (adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {}
    }
  }, []);

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
                <Text size="$4xl" className="fontX">
                  Dioh
                </Text>
              </Grid>
              <Grid>
                <Text
                  size="$sm"
                  className=" centerH m425"
                  style={{
                    marginLeft: "5px",
                    color: "var(--nextui-colors-accents7)",
                  }}
                >
                  (v.1.18.2)
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
                <Link href="https://discord.gg/VqetQJf7">Discord</Link>
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
                <Link href="/privacypolicy">Privacy Policy</Link>
              </Grid>
            </Grid.Container>
          </Grid>
          <Grid>
            <div
              style={{
                width: "5px",
              }}
            ></div>
          </Grid>
          <Grid>
            <div
              className="m768"
              style={{
                minWidth: "calc(40vw)",
                width: "100%",
                height: "87px",
              }}
            >
              <ins
                className="adsbygoogle"
                style={{
                  display: "block",
                  minWidth: "calc(40vw)",
                  width: "100%",
                  height: "87px",
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
