import { Grid, useTheme } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Image } from "@nextui-org/react";
import NoSSR from "react-no-ssr";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MyHead() {
  let { theme } = useTheme();
  const { data: session, status } = useSession();
  let [userName, setUserName] = useState("Loading...");
  let [isAdmin, setIsAdmin] = useState(false);
  let [nameColor, setNameColor] = useState("var(--nextui-colors-text)");
  let [point, setPoint] = useState("Loading...");
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

  useEffect(() => {
    if (status != "authenticated") return;
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
    setUserName(`${a}#${lpad((idonlynum % 10000).toString(), 4)}`);
  }, [session?.user?.email, session?.user?.id, session?.user?.name, status]);

  useEffect(() => {
    if (status != "authenticated") return;
    axios.get(`/api/user/get/token/${session.user?.id}`).then((v) => {
      setUserName(v.data.nickName);
      setNameColor(v.data.nameColor);
      setPoint(v.data.havingPoint);
      if ((v.data.permission as string[]).includes("admin")) {
        setIsAdmin(true);
      }
    });
  }, [session?.user?.id, status]);

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
        zIndex: "9999",
      }}
    >
      <article
        className="container"
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
          zIndex: "9999",
        }}
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
                  {/* Go to Admin Dashboard */}
                  {isAdmin ? (
                    <Grid>
                      <Link href="/admin">
                        <div
                          style={{
                            display: "inline-block",
                            fontSize: "var(--nextui-fontSizes-md)",
                            cursor: "pointer",
                          }}
                          className="centerH m768"
                        >
                          Admin-Dashboard
                        </div>
                      </Link>
                    </Grid>
                  ) : null}
                  {isAdmin ? (
                    <Grid>
                      <div
                        style={{
                          width: "8px",
                        }}
                        className="m768"
                      ></div>
                    </Grid>
                  ) : null}
                  {/* Profile Image */}
                  <Grid>
                    {status == "authenticated" ? (
                      <Link
                        href={`/user/${userName.split("#")[0]}/${
                          userName.split("#")[1]
                        }`}
                      >
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
                            cursor: "pointer",
                          }}
                        />
                      </Link>
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
                  <Grid>
                    {status == "authenticated" ? (
                      <div className="centerH m375">
                        <Link
                          style={{
                            color: nameColor,
                          }}
                          href={`/user/${userName.split("#")[0]}/${
                            userName.split("#")[1]
                          }`}
                        >
                          <div
                            style={{
                              display: "inline-block",
                              fontSize: "var(--nextui-fontSizes-xl)",
                              color: nameColor,
                              margin: "0px",
                              padding: "0px",
                              cursor: "pointer",
                            }}
                            className="font"
                          >
                            {userName}
                          </div>
                        </Link>
                        <div
                          style={{
                            margin: "0px",
                            padding: "0px",
                            transform:
                              "translateY(calc(var(--nextui-fontSizes-md) * -1 + var(--nextui-fontSizes-sm) * 0.5))",
                          }}
                          className="font"
                        >
                          Point:{" "}
                          {point
                            .toString()
                            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                          P
                        </div>
                      </div>
                    ) : null}
                  </Grid>
                  {/* Sign In & Out */}
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
      </article>
    </div>
  );
}
