import { Grid, Spacer, useTheme } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Image } from "@nextui-org/react";
import NoSSR from "react-no-ssr";

export default function MyHead() {
  let { theme } = useTheme();
  const { data: session, status } = useSession();

  const lpad = function (padString: string, length: number) {
    var str = padString;
    while (str.length < length) str = "0" + str;
    return str;
  };

  function getUsername() {
    if (status != "authenticated") return "";
    let x = 0;
    for (let i = 0; i < (session?.user?.email as string).length; i++) {
      x += (session?.user?.email as string).charCodeAt(i);
    }
    let idonlynum = Math.floor(
      parseInt((session?.user?.id as string).replace(/\D/g, "") as string) *
        1.25 *
        3 +
        x
    );
    let a = session?.user?.name;
    return `${a}#${lpad((idonlynum % 10000).toString(), 4)}`;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "0px",
        left: "0px",
        right: "0px",
        height: "76px",
        padding: "7px",
        paddingTop: "0px",
        borderBottom: `1px solid ${theme?.colors.neutralBorder.value}`,
        background: `${theme?.colors.background.value}`,
        zIndex: "12345",
      }}
      className="container"
    >
      <Link href="/" style={{}}>
        <h1
          style={{
            cursor: "pointer",
          }}
        >
          Dioh
        </h1>
      </Link>
      <div
        style={{
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          color: `${theme?.colors.black.value}`,
        }}
      >
        <NoSSR>
          {status == "loading" ? (
            <div>Loading...</div>
          ) : (
            <>
              <Grid.Container>
                {/* Profile Image */}
                <Grid>
                  {status == "authenticated" ? (
                    <Image
                      showSkeleton
                      alt="Your profile"
                      src={`${session?.user?.image}`}
                      width="40px"
                      objectFit="contain"
                      className="centerH"
                      css={{
                        display: "inline-block",
                        borderRadius: "20px",
                        border: "2px solid rgba(0,0,0,0.5)",
                      }}
                    />
                  ) : null}
                </Grid>
                {/* Profile Name */}
                <Grid>
                  <div
                    style={{
                      width: "8px",
                    }}
                  ></div>
                </Grid>
                {/* Sign In & Out */}
                <Grid>
                  {status == "authenticated" ? (
                    <div
                      style={{
                        display: "inline-block",
                        fontSize: "var(--nextui-fontSizes-xl)",
                      }}
                      className="centerH"
                    >
                      @{getUsername()}
                    </div>
                  ) : null}
                </Grid>
                <Grid>
                  <div
                    style={{
                      width: "8px",
                    }}
                  ></div>
                </Grid>
                <Grid>
                  {status == "authenticated" ? (
                    <Link href="/api/auth/signout">
                      <div
                        style={{
                          display: "inline-block",
                          cursor: "pointer",
                          fontSize: "var(--nextui-fontSizes-xl)",
                        }}
                        className="centerH"
                      >
                        Sign Out
                      </div>
                    </Link>
                  ) : (
                    <Link href="/api/auth/signin">
                      <div
                        style={{
                          cursor: "pointer",
                          fontSize: "var(--nextui-fontSizes-xl3)",
                        }}
                        className="centerH"
                      >
                        Sign In
                      </div>
                    </Link>
                  )}
                </Grid>
              </Grid.Container>
            </>
          )}
        </NoSSR>
      </div>
    </div>
  );
}
