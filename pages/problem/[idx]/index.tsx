import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MyHead from "../../../components/head";
import MyFooter from "../../../components/footer";
import axios from "axios";
import { Grid, Image, Link, Table } from "@nextui-org/react";

import {
  MdMemory as Memory,
  MdPerson as User,
  MdAccessTime as Time,
  MdSend as Count,
} from "react-icons/md";

import dynamic from "next/dynamic";
import { Suspense } from "react";
const NFullLoad = dynamic(() => import("../../../components/Loading/nFull"), {
  suspense: true,
});
const MD = dynamic(() => import("../../../components/ProblemPage/md"), {
  suspense: true,
});

export default function ProblemPage() {
  let router = useRouter();
  let [problemName, setProblemName] = useState("Loading...");
  let [problemArticles, setProblemArticles] = useState("Loading...");
  let [problemMemory, setProblemMemory] = useState("Loading...");
  let [problemTime, setProblemTime] = useState("Loading...");
  let [problemPoint, setProblemPoint] = useState("Loading...");
  let [problemReqs, setProblemReqs] = useState("Loading...");
  let [problemSucs, setProblemSucs] = useState("Loading...");

  let { query } = router;

  // 1번만 실행
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
      setProblemMemory(problem.maxMemoryMB + "MB");
      setProblemTime(problem.maxTime + "ms");
      setProblemPoint(problem.point);
      setProblemReqs(problem.solveRequestedCount + "번");
      setProblemSucs(problem.solvedPeopleCount + "명");
      setProblemArticles(problem.body);
    });
  }, [router.isReady, router.query]);

  return (
    <>
      <article className="container">
        <MyHead />

        {/* Option Menu */}
        <Grid.Container>
          <Grid>
            <div
              className="padding5px"
              style={{
                background: "var(--nextui-colors-success)",
                color: "white",
              }}
            >
              문제
            </div>
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

        {/* 문제 제한 */}
        <Table shadow={false}>
          <Table.Header>
            <Table.Column>
              <Grid.Container>
                <Grid>
                  <Time size="1.5em" className="centerH rotateOnHover" />
                </Grid>
                <Grid>
                  <div className="centerH">제한 시간</div>
                </Grid>
              </Grid.Container>
            </Table.Column>
            <Table.Column>
              <Grid.Container>
                <Grid>
                  <Memory size="1.6em" className="centerH rotateOnHover" />
                </Grid>
                <Grid>
                  <div className="centerH">메모리 제한</div>
                </Grid>
              </Grid.Container>
            </Table.Column>
            <Table.Column>
              <Grid.Container>
                <Grid>
                  <Image
                    showSkeleton
                    src="/images/point.svg"
                    alt="P"
                    width={"1.4em"}
                    className="centerH"
                  />
                </Grid>
                <Grid>
                  <div className="centerH">포인트</div>
                </Grid>
              </Grid.Container>
            </Table.Column>
            <Table.Column>
              <Grid.Container>
                <Grid>
                  <Count size="1.6em" className="centerH flyer" />
                </Grid>
                <Grid>
                  <div className="centerH">제출 횟수</div>
                </Grid>
              </Grid.Container>
            </Table.Column>
            <Table.Column>
              <Grid.Container>
                <Grid>
                  <User size="1.6em" className="centerH flipOnHover" />
                </Grid>
                <Grid>
                  <div className="centerH">성공한 사람수</div>
                </Grid>
              </Grid.Container>
            </Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>{problemTime}</Table.Cell>
              <Table.Cell>{problemMemory}</Table.Cell>
              <Table.Cell>{problemPoint}</Table.Cell>
              <Table.Cell>{problemReqs}</Table.Cell>
              <Table.Cell>{problemSucs}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        {/* 본문 */}
        <div className="borderBottom">
          <Suspense fallback={`Loading...`}>
            <Suspense fallback={<NFullLoad />}>
              <MD text={problemArticles} />
            </Suspense>
          </Suspense>
        </div>

        <style>{`
      .rotateOnHover , .flipOnHover {
        transition: all 1s ease;
      }

      .rotateOnHover:hover {
        transform: translateY(-50%) rotate(360deg);
        color: black;
      }

      @keyframes fly {
        0%   {

        }
        15%  {
          transform: translateY(-50%) rotate(-45deg);
          color: lightblue;
        }
        20%  {
          transform: translateY(-50%) rotate(-45deg);
          color: lightblue;
        }
        50%  {
          transform: translate(20vw , -20vh) rotate(-45deg);
          color: lightblue;
        }
        50.0001%  {
          transform: translate(-20vw , 20vh) rotate(-45deg);
          color: lightblue;
        }
        80%  {
          transform: translateY(-50%) rotate(-45deg);
          color: lightblue;
        }
        100% {
          
        }
      }

      .flyer:hover {
        animation-name: fly;
        animation-duration: 3s;
        transition: all 1s ease;
      }

      .flipOnHover:hover {
        transform: translateY(-50%) rotateY(180deg);
        color: black;
      }
    `}</style>
      </article>
      <MyFooter /> {/* 풋터 */}
    </>
  );
}
