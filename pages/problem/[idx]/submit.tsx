import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MyHead from "../../../components/head";
import MyFooter from "../../../components/footer";
import axios from "axios";
import { Button, Grid, Image, Link, Spacer } from "@nextui-org/react";

// Code
import Editor from "@monaco-editor/react";
import Select from "react-select";
import { toast } from "react-toastify";
import Load from "../../../components/Loading";
import { useSession } from "next-auth/react";

import customAxios from "../../../util/customAxios";

const options = [
  { value: "cpp", label: "CPP" },
  { value: "js", label: "JavaScript" },
  { value: "py", label: "Python" },
];

export default function ProblemPage() {
  let router = useRouter();
  let session = useSession();
  let { query } = router;
  let [problemName, setProblemName] = useState("Loading... / 제출");
  let [sourceCode, setSourceCode] = useState("");
  let [loadingT, load] = useState(true);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  // 1번만 실행
  useEffect(() => {
    if (!router.isReady) return;

    if (session.status == "unauthenticated") {
      toast("You are not signed in.", {
        type: "info",
      });
      router.push("/auth/signin");
      return;
    }

    if (session.status == "loading") {
      return;
    }

    load(false);

    let query = router.query;
    axios.get(`/api/problems/get/num/${query.idx as string}`).then((res) => {
      let problem = res.data;

      if (problem.err) {
        setProblemName("Problem Not Found");
        return;
      }

      setProblemName(`${problem.id} : ${problem.name} / 제출`);
    });
  }, [router, router.isReady, router.query, session.status]);

  return (
    <>
      <article className="container">
        <MyHead />

        {loadingT ? <Load /> : null}

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
            <div
              style={{
                background: "var(--nextui-colors-success)",
                color: "white",
              }}
              className="padding5px"
            >
              제출
            </div>
          </Grid>
          <Grid>
            <Link
              href={`/problem/${query.idx}/status`}
              style={{
                color: "var(--nextui-colors-text)",
              }}
            >
              <div className="padding5px">제출현황</div>
            </Link>
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

        {/* Submit Language */}
        <div className="borderBottom">
          <div
            className="borderBottom"
            style={{
              marginTop: "16px",
            }}
          >
            <h3 className="borderBottomColored">제출 언어</h3>
          </div>
          <Spacer />
          <Select
            options={options}
            defaultValue={selectedOption}
            onChange={(e: any) => {
              setSelectedOption(e);
            }}
          />
        </div>

        {/* Code */}
        <div className="borderBottom">
          <div
            className="borderBottom"
            style={{
              marginTop: "16px",
            }}
          >
            <h3 className="borderBottomColored">소스 코드</h3>
          </div>
          <Spacer />
          <Editor
            height="40vh"
            language={selectedOption.label.toLocaleLowerCase()}
            defaultValue={sourceCode}
            onChange={(v) => {
              setSourceCode(v || "");
            }}
            theme="vs-dark"
          />
        </div>

        {/* Submit button */}
        <div
          style={{
            width: "100%",
            position: "relative",
          }}
        >
          <Button
            style={{
              position: "absolute",
              right: "0px",
              top: "5px",
            }}
            onPress={() => {
              if (sourceCode == "") {
                toast("Source Code cannot be blank", {
                  type: "warning",
                });
                return;
              }
              if (problemName == "Problem Not Found") {
                toast("Problem Not Found", {
                  type: "error",
                });
                return;
              }
              if (problemName == "Loading... / 제출") {
                toast("Problem is loading...", {
                  type: "warning",
                });
                return;
              }
              customAxios
                .get("/api/problems/submit", {
                  params: {
                    type: selectedOption.value,
                    body: sourceCode,
                    problem: query.idx || "",
                  },
                })
                .then((v) => {
                  load(false);

                  if (v.data.err) {
                    toast(v.data.err, {
                      type: "error",
                    });
                  }

                  if (v.data.suc) {
                    toast(v.data.suc, {
                      type: "success",
                    });
                    router.push(`/problem/${query.idx}`);
                  }
                })
                .catch((err) => {
                  toast(`Error occured / ${err.message}`, {
                    type: "error",
                  });
                });
              load(true);
            }}
          >
            제출
          </Button>
        </div>
      </article>
      <MyFooter /> {/* 풋터 */}
    </>
  );
}
