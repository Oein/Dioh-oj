import axios from "axios";
import { Table, Grid, Image, Link } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MyHead from "../../../../components/head";
import { uid } from "uid";
import User from "../../../../types/user";
import { useSession } from "next-auth/react";
import backgroundImgURLS, {
  backgroundNames,
} from "../../../../util/backgroundImgURLS";
import Select from "react-select";
import Load from "../../../../components/Loading";
import customAxios from "../../../../util/customAxios";
import { toast } from "react-toastify";

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
    UserBackgroundImgIndex: 0,
    HavingBackgroundImgIndexes: [0],
  });
  let [options, setOptions] = useState<
    {
      value: string;
      label: string;
      idx: number;
    }[]
  >([]);
  let [selectedOption, setSelectedOption] = useState<{
    value: string;
    label: string;
  }>();
  let [isMe, setIsMe] = useState(false);
  let [temp__________, temp__________s] = useState("");
  let [scrolled, setSCROLLY] = useState(0);
  let [loading__, load] = useState(false);

  const forceRefresh = () => {
    temp__________s(uid());
  };

  let router = useRouter();
  let { query } = router;
  let { userNickname, userNumber } = query;
  let session = useSession();

  useEffect(() => {
    axios
      .get(`/api/user/get/nickname/${userNickname}/${userNumber}`)
      .then((v) => {
        if (v.data.err) {
          return;
        }
        console.log(v.data);
        const havingBGS = v.data.HavingBackgroundImgIndexes as number[];
        console.log(havingBGS);
        let temp__: {
          value: string;
          label: string;
          idx: number;
        }[] = [];
        backgroundImgURLS.map((v, idx) => {
          if (havingBGS.includes(idx)) {
            temp__.push({
              value: v,
              label: backgroundNames[idx],
              idx: idx,
            });
          }
        });
        setOptions(temp__);
        setUser(v.data as User);
        setSelectedOption(
          temp__.find((x) => x.idx == (v.data.UserBackgroundImgIndex as number))
        );
        forceRefresh();
        if (
          session.status == "authenticated" &&
          session.data.user?.id == v.data.id
        ) {
          setIsMe(true);
        }
      });
  }, [
    session.data?.user?.id,
    session.status,
    userNickname,
    userNumber,
    temp__________,
  ]);

  useEffect(() => {
    document.addEventListener("scroll", (e) => {
      setSCROLLY(window.scrollY);
    });
  }, []);

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
      {loading__ ? <Load /> : null}
      <MyHead />

      <Image
        showSkeleton
        src={backgroundImgURLS[user.UserBackgroundImgIndex]}
        alt="Profile Background"
        width="100vw"
        objectFit="cover"
        css={{
          zIndex: "-123",
          transform: `translateY(calc(${scrolled}px / 2))`,
          maxHeight: "65vh",
        }}
        className="BGIMG"
      />
      <div
        className="container BGSELEC"
        style={{
          position: "absolute",
          top: "5px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div
          style={{
            position: "relative",
            left: "0px",
            top: "10px",
          }}
        >
          <Select
            options={options}
            defaultValue={selectedOption}
            value={selectedOption}
            onChange={(e: any) => {
              console.log(e);
              load(true);
              setSelectedOption(e);
              customAxios
                .get(`/api/user/update/background/${e.idx}`)
                .then((v) => {
                  if (v.data.err) {
                    toast(`ERR / ${v.data.err}`, {
                      type: "error",
                    });
                  }
                  if (v.data.suc) {
                    toast(`${v.data.suc}`, {
                      type: "success",
                    });
                  }
                })
                .catch((e) => {
                  toast(`ERR / ${e}`, {
                    type: "error",
                  });
                })
                .finally(() => {
                  load(false);
                  forceRefresh();
                });
            }}
          />
        </div>
      </div>

      <article className="container">
        <Grid.Container
          style={{
            transform: "translateY(-50%)",
          }}
        >
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
              style={{
                fontSize: "var(--nextui-fontSizes-2xl)",
                color: `${user.nameColor}`,
                position: "relative",
                top: "100%",
                transform: "translateY(-100%)",
                borderBottom: "var(--nextui-colors-accents7) 1px solid",
                paddingLeft: "5px",
                paddingRight: "5px",
              }}
            >{`${user.nickName}`}</div>
          </Grid>
        </Grid.Container>
      </article>
      <article
        className="container"
        style={{
          marginBottom: "100px",
        }}
      >
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

        <div
          style={{
            marginTop: "30px",
            borderRadius: "var(--nextui-radii-xl)",
            boxShadow: "var(--nextui-shadows-md)",
            padding: "var(--nextui-space-md) var(--nextui-space-sm)",
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
            <strong>맞은 문제</strong>
          </div>
          <div
            style={{
              padding: "10px",
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
        </div>
      </article>

      <style>{`
        .BGSELEC {
          opacity: 0;
          transition: all 0.3s ease;
        }

        ${
          isMe
            ? `.BGIMG:hover + .BGSELEC {
          opacity: 1;
        }

        .BGSELEC:hover {
          opacity: 1;
        }`
            : ""
        }
      `}</style>
    </>
  );
}
