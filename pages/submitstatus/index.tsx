import { Suspense, useEffect, useState } from "react";
import {
  Button,
  Link,
  Table,
  Input,
  Grid,
  Modal,
  Text,
} from "@nextui-org/react";
import MyHead from "../../components/head";
import { RealtimeClient } from "@supabase/realtime-js";
import { SourceCode } from "@prisma/client";
import DTT from "../../util/dateToTime";
import { uid } from "uid";
import realtimeMSG from "../../types/realtimeMSG";
import { useRouter } from "next/router";
import Load from "../../components/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import customAxios from "../../util/customAxios";
import NFullLoad from "../../components/Loading/nFull";

import Editor from "@monaco-editor/react";
import dynamic from "next/dynamic";

const langName: { [key: string]: string } = {
  cpp: "C++",
  js: "JavaScript",
  py: "Python",
};

const MD = dynamic(() => import("../../components/ProblemPage/md"), {
  suspense: true,
});

export default function SubmitStatus() {
  // Realtime submits
  let [submits, setSubmits] = useState<SourceCode[]>([]);

  // Old submits
  let [submits2, setSubmits2] = useState<SourceCode[]>([]);

  // force update
  let [temp__________, temp__________s] = useState("");

  // 로딩
  let [loading, load] = useState(false);

  // 다음 로드 커서
  let [cursor, setCursor] = useState("");

  // 조건
  let [input_1, setI1] = useState("");
  let [input_2, setI2] = useState("");

  // Source code
  let [json_state, setJSONSTATE] = useState<{ [key: string]: any }>({});
  let [modalSID, setMODALSID] = useState("");

  let router = useRouter();
  let query = router.query;

  const forceRefresh = () => {
    temp__________s(uid());
  };

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

      if (query.problem) {
        if (msg.record.problem != query.problem) {
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
    channel.subscribe().receive("ok", () => {});

    // Set the JWT so Realtime can verify and keep the channel alive
    socket.setAuth(process.env.NEXT_PUBLIC_SUPABASE_ANON as string);

    let inter = setInterval(() => {
      forceRefresh();
    }, 1000);

    setI1((query.problem as string) || "");
    setI2(((query.user as string) || "").replace(".-.", "#"));

    load(true);
    if (cursor == "" && submits.length > 0) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      cursor = submits[submits.length - 1].id;
    }
    axios
      .get(
        `/api/submitstatus/get?cursor=${cursor}&problem=${query.problem}&user=${query.user}`
      )
      .then((v) => {
        if (v.data.length == 0) {
          return;
        }
        if (v.data.err) {
          return;
        }
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

    return () => {
      clearInterval(inter);
    };
  }, [query.problem, query.user, submits]);

  useEffect(() => {
    if (modalSID.length > 0) {
      customAxios
        .get(`/api/source/get/${modalSID}`)
        .then((v) => {
          if (v.data.err) {
            toast(`ERR / ${v.data.err}`, {
              type: "error",
            });
            setMODALSID("");
            setJSONSTATE({});
            return;
          }
          setJSONSTATE(v.data);
          console.log(v.data);
        })
        .catch((err) => {
          toast(`ERR / ${err}`, {
            type: "error",
          });
          setMODALSID("");
          setJSONSTATE({});
        });
    } else {
      setJSONSTATE({});
    }
  }, [modalSID]);

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
      <Modal
        open={modalSID.length > 0}
        onClose={() => {
          setMODALSID("");
          setJSONSTATE({});
        }}
        width="95vw"
        scroll
        closeButton
      >
        <Modal.Header>
          <Text size={"$2xl"}>Result of Submit [{modalSID}]</Text>
        </Modal.Header>
        <Modal.Body>
          {Object.keys(json_state).length == 0 ? (
            <NFullLoad />
          ) : (
            <div>
              <Grid.Container>
                <Grid>
                  {json_state["a"].error == "Timeout" ? (
                    json_state["a"].score == 0 ? (
                      <div
                        style={{
                          color: "var(--nextui-colors-error)",
                          fontSize: "var(--nextui-fontSizes-3xl)",
                        }}
                      >
                        TLE
                      </div>
                    ) : (
                      <div
                        style={{
                          color: "var(--nextui-colors-warning)",
                          fontSize: "var(--nextui-fontSizes-3xl)",
                        }}
                      >
                        TLE / {json_state["a"].score}
                      </div>
                    )
                  ) : json_state["a"].score == 100 ? (
                    <div
                      style={{
                        color: "var(--nextui-colors-success)",
                        fontSize: "var(--nextui-fontSizes-3xl)",
                      }}
                    >
                      Success
                    </div>
                  ) : json_state["a"].score == 0 ? (
                    (json_state["a"].error || "").length > 0 ? (
                      <div
                        style={{
                          color: "var(--nextui-colors-error)",
                          fontSize: "var(--nextui-fontSizes-3xl)",
                        }}
                      >
                        ERR
                      </div>
                    ) : (
                      <div
                        style={{
                          color: "var(--nextui-colors-error)",
                          fontSize: "var(--nextui-fontSizes-3xl)",
                        }}
                      >
                        0
                      </div>
                    )
                  ) : (
                    <div
                      style={{
                        color: "var(--nextui-colors-warning)",
                        fontSize: "var(--nextui-fontSizes-3xl)",
                      }}
                    >
                      {json_state["a"].score}
                    </div>
                  )}
                </Grid>
                <Grid>
                  <div
                    style={{
                      width: "5px",
                    }}
                  ></div>
                </Grid>
                <Grid>
                  <div className="centerH">
                    {json_state["a"].usedTime}ms eslaped
                  </div>
                </Grid>
                <Grid>
                  <div
                    style={{
                      marginLeft: "5px",
                      marginRight: "5px",
                    }}
                    className="centerH"
                  >
                    |
                  </div>
                </Grid>
                <Grid>
                  <div className="centerH">
                    {json_state["a"].usedMemory}bytes needed
                  </div>
                </Grid>
              </Grid.Container>
              <div
                className="borderBottom"
                style={{
                  marginBottom: "5px",
                }}
              >
                <h3 className="borderBottomColored">제출 코드</h3>
              </div>
              <Editor
                height="50vh"
                language={json_state["a"].type.toLocaleLowerCase()}
                defaultValue={json_state["b"].code}
                theme="vs-dark"
                options={{
                  readOnly: true,
                }}
              />
              {json_state["a"].error.length > 0 &&
              json_state["a"].error != "Timeout" ? (
                <>
                  <div
                    className="borderBottom"
                    style={{
                      marginBottom: "5px",
                    }}
                  >
                    <h3 className="borderBottomColored">에러</h3>
                  </div>
                  <div
                    style={{
                      borderRadius: "15px",
                    }}
                  >
                    <Suspense fallback={`Loading...`}>
                      <Suspense fallback={<NFullLoad />}>
                        <MD
                          text={"```js\n" + json_state["a"].error + "\n```"}
                        />
                      </Suspense>
                    </Suspense>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </Modal.Body>
      </Modal>
      <article className="container">
        <Grid.Container
          style={{
            marginBottom: "10px",
          }}
        >
          <Grid xs={4}>
            <Input
              labelPlaceholder="문제 번호"
              value={input_1}
              fullWidth
              onChange={(e) => {
                setI1(e.target.value);
              }}
            />
          </Grid>
          <Grid xs={4}>
            <Input
              labelPlaceholder="유저 이름"
              value={input_2}
              fullWidth
              onChange={(e) => {
                setI2(e.target.value);
              }}
            />
          </Grid>
          <Grid>
            <Button
              auto
              onClick={() => {
                router
                  .push(
                    `/submitstatus?problem=${input_1}&user=${input_2.replace(
                      "#",
                      ".-."
                    )}`
                  )
                  .then(() => {
                    router.reload();
                  });
              }}
            >
              검색
            </Button>
          </Grid>
        </Grid.Container>
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
                  <Table.Cell>
                    <div
                      onClick={() => {
                        setMODALSID(v.id);
                      }}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      {v.id}
                    </div>
                  </Table.Cell>
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
                  <Table.Cell>
                    {v.error == "Timeout" ? (
                      v.score == 0 ? (
                        <div
                          style={{
                            color: "var(--nextui-colors-error)",
                          }}
                        >
                          TLE
                        </div>
                      ) : (
                        <div
                          style={{
                            color: "var(--nextui-colors-warning)",
                          }}
                        >
                          TLE / {v.score}
                        </div>
                      )
                    ) : v.score == 100 ? (
                      <div
                        style={{
                          color: "var(--nextui-colors-success)",
                        }}
                      >
                        100
                      </div>
                    ) : v.score == 0 ? (
                      (v.error || "").length > 0 ? (
                        <div
                          style={{
                            color: "var(--nextui-colors-error)",
                          }}
                        >
                          ERR
                        </div>
                      ) : (
                        <div
                          style={{
                            color: "var(--nextui-colors-error)",
                          }}
                        >
                          0
                        </div>
                      )
                    ) : (
                      <div
                        style={{
                          color: "var(--nextui-colors-warning)",
                        }}
                      >
                        {v.score}
                      </div>
                    )}
                  </Table.Cell>
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
                `/api/submitstatus/get?cursor=${cursor}&problem=${
                  query.problem
                }&user=${(query.user as string) || ""}`
              )
              .then((v) => {
                if (v.data.length == 0) {
                  toast("No more data to load", {
                    type: "warning",
                  });
                  return;
                }
                if (v.data.err) {
                  toast(`ERR / ${v.data.err}`, {
                    type: "error",
                  });
                  return;
                }
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

      <style>{`
        .monaco-editor {
          border-radius: 16px;
        }
      `}</style>
    </>
  );
}
