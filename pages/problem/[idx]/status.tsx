import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MyHead from "../../../components/head";
import MyFooter from "../../../components/footer";
import axios from "axios";
import { Grid, Image, Link, Table, Button } from "@nextui-org/react";
import { RealtimeClient } from "@supabase/realtime-js";
import { SourceCode } from "@prisma/client";
import DTT from "../../../util/dateToTime";
import { uid } from "uid";
import realtimeMSG from "../../../types/realtimeMSG";
import Load from "../../../components/Loading";
import { toast } from "react-toastify";

const langName: { [key: string]: string } = {
  cpp: "C++",
  js: "JavaScript",
  py: "Python",
};

export default function SubmitStatus() {
  let [submits, setSubmits] = useState<SourceCode[]>([]);
  let [submits2, setSubmits2] = useState<SourceCode[]>([]);
  let [temp__________, temp__________s] = useState("");
  let [loading, load] = useState(false);
  let [cursor, setCursor] = useState("");
  let [problemName, setProblemName] = useState("Loading...");

  let router = useRouter();
  let query = router.query;

  const forceRefresh = () => {
    temp__________s(uid());
  };

  useEffect(() => {
    if (!router.isReady) return;
    let query = router.query;
    axios.get(`/api/problems/get/num/${query.idx as string}`).then((res) => {
      let problem = res.data;

      if (problem.err) {
        setProblemName("Problem Not Found");
        return;
      }

      setProblemName(`${problem.id} : ${problem.name}`);
    });
  }, [router.isReady, router.query]);

  useEffect(() => {
    let subs: SourceCode[] = submits;
    let nameDB: { [key: string]: string } = {};
    const socket = new RealtimeClient(
      process.env.NEXT_PUBLIC_REALTIME_URL || "ws://localhost:4000/socket",
      {
        params: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON as string,
        },
      }
    );
    socket.connect();

    var channel = socket.channel("realtime:public:*", {
      user_token: process.env.NEXT_PUBLIC_SUPABASE_ANON as string,
    });
    // DB에 추가
    channel.on("INSERT", (msg: realtimeMSG) => {
      // msg.record = SourceCode

      if (query.idx) {
        if (msg.record.problem != query.idx) {
          return;
        }
      }
      if (query.user) {
        if (msg.record.user != query.user) {
          return;
        }
      }

      let userID = msg.record.user;

      if (nameDB[userID]) {
        msg.record.user = nameDB[userID];
      } else {
        axios.get(`/api/user/get/token/${userID}`).then((v) => {
          let step_a = subs.find((c) => c.id == msg.record.id) as SourceCode;
          let step_b = subs.indexOf(step_a);

          msg.record.user = JSON.stringify({
            name: v.data.nickName,
            color: v.data.nameColor,
          });
          nameDB[userID] = JSON.stringify({
            name: v.data.nickName,
            color: v.data.nameColor,
          });
          subs[step_b].user = msg.record.user;
          setSubmits(subs);
        });
        msg.record.user = JSON.stringify({
          name: "Loading...",
          color: userID,
        });
      }

      subs = [msg.record].concat(subs);
      setSubmits(subs);
    });
    // DB 업데이트
    channel.on("UPDATE", (msg: realtimeMSG) => {
      // msg.record = SourceCode
      // msg.old_record = {
      //  id: "ID",
      // }
      try {
        let step_a = subs.find((c) => c.id == msg.old_record?.id) as SourceCode;
        let step_b = subs.indexOf(step_a);
        subs[step_b].score = msg.record.score;
        setSubmits(subs);
      } catch (e) {
        toast(`ERR / ${e}`, {
          type: "error",
        });
      }
    });
    channel.subscribe().receive("ok", () => console.log("Connected!"));

    // Set the JWT so Realtime can verify and keep the channel alive
    socket.setAuth(process.env.NEXT_PUBLIC_SUPABASE_ANON as string);

    let inter = setInterval(() => {
      forceRefresh();
    }, 1000);

    return () => {
      clearInterval(inter);
    };
  }, [query.idx, query.problem, query.user, submits]);

  useEffect(() => {
    load(true);
    axios
      .get(`/api/submitstatus/get?cursor=${cursor}&problem=${query.idx}`)
      .then((v) => {
        if (v.data.length == 0) {
          return;
        }
        console.log(v.data);
        setCursor(v.data[v.data.length - 1].id);
        setSubmits2(submits2.concat(v.data));
      })
      .catch((err) => {
        toast(`Err / ${err}`, {
          type: "error",
        });
      })
      .finally(() => {
        load(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.idx]);

  return (
    <>
      {loading ? <Load /> : null}
      <div
        style={{
          display: "none",
        }}
      >
        {temp__________}
      </div>
      <MyHead />
      <article className="container">
        {/* Option Menu */}
        <Grid.Container>
          <Grid>
            <Link
              href={`/problem/${query.idx}`}
              style={{
                color: "var(--nextui-colors-text)",
              }}
            >
              <div className="padding5px">문제</div>
            </Link>
          </Grid>
          <Grid>
            <div
              style={{
                width: "5px",
              }}
            ></div>
          </Grid>
          <Grid>
            <Link
              href={`/problem/${query.idx}/submit`}
              style={{
                color: "var(--nextui-colors-text)",
              }}
            >
              <div className="padding5px">제출</div>
            </Link>
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
              className="padding5px"
              style={{
                background: "var(--nextui-colors-success)",
                color: "white",
              }}
            >
              제출현황
            </div>
          </Grid>
        </Grid.Container>

        {/* Title */}
        <div
          style={{
            fontSize: "var(--nextui-fontSizes-xl3)",
            marginTop: "16px",
          }}
          className="borderBottom"
        >
          <Grid.Container>
            <Grid>
              <Image
                showSkeleton
                width={"1.4em"}
                objectFit="contain"
                src="/images/articles.svg"
                alt="Dina의 이미지"
              />
            </Grid>
            <Grid>
              <div className="centerH">{problemName}</div>
            </Grid>
          </Grid.Container>
        </div>

        <Table>
          <Table.Header>
            <Table.Column>제출 번호</Table.Column>
            <Table.Column>문제 번호</Table.Column>
            <Table.Column>유저 이름</Table.Column>
            <Table.Column>점수</Table.Column>
            <Table.Column>제출 언어</Table.Column>
            <Table.Column>제출 시각</Table.Column>
          </Table.Header>
          <Table.Body>
            {submits.concat(submits2).map((v, idx) => {
              return (
                <Table.Row key={idx}>
                  <Table.Cell>{v.id}</Table.Cell>
                  <Table.Cell>
                    <Link href={`/problem/${v.problem}`}>{v.problem}</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      href={`/user/${JSON.parse(v.user).name.split("#")[0]}/${
                        JSON.parse(v.user).name.split("#")[1]
                      }`}
                    >
                      <div
                        style={{
                          color: JSON.parse(v.user).color,
                        }}
                      >
                        {JSON.parse(v.user).name}
                      </div>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{v.score}</Table.Cell>
                  <Table.Cell>
                    {(langName[v.type as string] as string) ||
                      (v.type as string)}
                  </Table.Cell>
                  <Table.Cell>{DTT(new Date(v.time))}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <Button
          auto
          css={{
            marginTop: "10px",
            float: "right",
          }}
          onClick={() => {
            load(true);
            if (cursor == "" && submits.length > 0) {
              cursor = submits[submits.length - 1].id;
            }
            axios
              .get(
                `/api/submitstatus/get?cursor=${cursor}&problem=${query.idx}`
              )
              .then((v) => {
                if (v.data.length == 0) {
                  toast("No more data to load", {
                    type: "warning",
                  });
                  return;
                }
                console.log(v.data);
                setCursor(v.data[v.data.length - 1].id);
                setSubmits2(submits2.concat(v.data));
              })
              .catch((err) => {
                toast(`Err / ${err}`, {
                  type: "error",
                });
              })
              .finally(() => {
                load(false);
              });
          }}
          aria-label={`Load more cursor : ${cursor}`}
        >
          더 불러오기
        </Button>
      </article>
      <div
        style={{
          height: "50px",
        }}
      ></div>
      <MyFooter /> {/* 풋터 */}
    </>
  );
}
