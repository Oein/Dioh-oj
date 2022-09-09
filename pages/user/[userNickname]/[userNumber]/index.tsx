import axios from "axios";
import { Table, Grid, Image, Link } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MyHead from "../../../../components/head";
import { uid } from "uid";
import User from "../../../../types/user";

export default function Mypage() {
  let [user, setUser] = useState<User>({
    Banned: false,
    BanStarted: -1,
    email: "Loading...",
    emailVerified: false,
    havingPoint: 0,
    id: "Loading...",
    image: "Loading...",
    name: "Loading...",
    nameColor: "Loading...",
    nickName: "Loading...",
    permission: [],
    solvedProblems: ["Loading..."],
    Warns: [],
  });
  let [temp__________, temp__________s] = useState("");

  const forceRefresh = () => {
    temp__________s(uid());
  };

  let router = useRouter();
  let { query } = router;
  let { userNickname, userNumber } = query;

  useEffect(() => {
    axios
      .get(`/api/user/get/nickname/${userNickname}/${userNumber}`)
      .then((v) => {
        console.log(v.data);
        setUser(v.data as User);
        forceRefresh();
      });
  }, [userNickname, userNumber]);

  return (
    <>
      {/* JSON State 는 Update 안됨 -> Force Updater */}
      <div
        style={{
          display: "none",
        }}
      >
        {temp__________}
      </div>
      <MyHead />
      <article className="container">
        <div
          style={{
            padding: "20px",
            borderRadius: "20px",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "1px var(--nextui-colors-accents3) solid",
            boxShadow: "var(--nextui-shadows-md)",
            marginBottom: "30px",
            backgroundImage:
              "url(https://cdn.discordapp.com/attachments/1017382361618456587/1017603918789885982/unknown.png)",
          }}
        >
          <Grid.Container>
            <Grid>
              <Image
                showSkeleton
                src={user.image}
                alt="Profile Image"
                width="6rem"
                height="6rem"
                style={{
                  borderRadius: "50%",
                  border: "3px solid var(--nextui-colors-accents6)",
                }}
              />
            </Grid>
            <Grid>
              <div
                style={{
                  width: "10px",
                }}
              ></div>
            </Grid>
            <Grid>
              <div
                className="centerH"
                style={{
                  fontSize: "var(--nextui-fontSizes-2xl)",
                  color: `${user.nameColor}`,
                }}
              >{`${user.nickName}`}</div>
            </Grid>
          </Grid.Container>
        </div>
        <div>
          <Table>
            <Table.Header>
              <Table.Column> 맞은 문제 수 </Table.Column>
              <Table.Column> 소유한 포인트 </Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  {`${(user.solvedProblems || []).length}`}개
                </Table.Cell>
                <Table.Cell>
                  <Grid.Container>
                    <Grid>
                      <div
                        style={{
                          fontSize: "var(--nextui-fontSizes-xl)",
                        }}
                        className="centerH"
                      >{`${user.havingPoint}`}</div>
                    </Grid>
                    <Grid>
                      {
                        <Image
                          showSkeleton
                          src="/images/point.svg"
                          alt="P"
                          width={"var(--nextui-fontSizes-md)"}
                          className="centerH"
                        />
                      }
                    </Grid>
                  </Grid.Container>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
        <div>
          <details
            style={{
              marginTop: "30px",
              borderRadius: "var(--nextui-radii-xl)",
            }}
          >
            <summary
              style={{
                borderRadius: "var(--nextui-radii-xl)",
              }}
            >
              <div
                style={{
                  padding: "10px",
                  background: "var(--nextui-colors-background)",
                }}
              >
                <div
                  style={{
                    borderRadius: "var(--nextui-radii-xl)",
                    padding: "10px",
                    background: "var(--nextui-colors-accents0)",
                    color: "var(--nextui-colors-accents7)",
                  }}
                >
                  <strong>맞은 문제</strong> | 눌러서 열기 / 닫기
                </div>
              </div>
            </summary>
            <div
              style={{
                padding: "10px",
                background: "var(--nextui-colors-background)",
              }}
            >
              {(user.solvedProblems || []).map((v, idx) => {
                return (
                  <Link
                    href={`/problem/${v}`}
                    key={idx}
                    style={{
                      color: "var(--nextui-colors-text)",
                      display: "inline-block",
                      marginRight: "5px",
                    }}
                  >
                    <div>{v}</div>
                  </Link>
                );
              })}
            </div>
          </details>
        </div>
      </article>
    </>
  );
}
