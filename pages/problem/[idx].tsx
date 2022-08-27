import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MyHead from "../../components/head";
import axios from "axios";
import { Grid, Image, Table, Tooltip } from "@nextui-org/react";

import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import docco from "react-syntax-highlighter/dist/cjs/styles/hljs/docco";
import { toast } from "react-toastify";

export default function ProblemPage() {
  let router = useRouter();
  let [problemName, setProblemName] = useState("Loading...");
  let [problemArticles, setProblemArticles] = useState("Loading...");
  let [problemMemory, setProblemMemory] = useState("Loading...");
  let [problemTime, setProblemTime] = useState("Loading...");

  // 1번만 실행
  useEffect(() => {
    if (!router.isReady) return;
    let query = router.query;
    console.log(`Find ${query.idx as string}`);
    axios.get(`/api/problems/get/num/${query.idx as string}`).then((res) => {
      let problem = res.data;

      if (problem.err) {
        setProblemName("Problem Not Found");
        console.log("ERR");
        return;
      }

      console.log(problem);

      setProblemName(`${problem.id} : ${problem.name}`);
      setProblemMemory(problem.maxMemoryMB + "MB");
      setProblemTime(problem.maxTime + "ms");
      setProblemArticles(problem.body);
    });
  }, [router.isReady, router.query]);

  return (
    <article className="container">
      <MyHead />
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
          <Table.Column>제한 시간</Table.Column>
          <Table.Column>메모리 제한</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{problemTime}</Table.Cell>
            <Table.Cell>{problemMemory}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      {/* 본문 */}
      <div className="borderBottom">
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <div className="copyToClipboardPar">
                  <CopyToClipboard
                    text={children as string}
                    onCopy={() => {
                      toast("Copied to clipboard", {
                        type: "success",
                      });
                    }}
                  >
                    <div className="copyToClipboard">C</div>
                  </CopyToClipboard>
                  <SyntaxHighlighter
                    language={match[1]}
                    PreTag="div"
                    {...props}
                    style={docco}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className={`${className}`} {...props}>
                  {children}
                </code>
              );
            },
            h2({ children, ...props }) {
              return (
                <div className="borderBottom">
                  <h2 className="borderBottomColored">{children}</h2>
                </div>
              );
            },
          }}
        >
          {problemArticles}
        </ReactMarkdown>
      </div>

      {/* css */}
      <style jsx>{`
        .borderBottom {
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .borderBottomColored {
          border-bottom: 2px solid var(--nextui-colors-primary);
          display: inline-block;
          margin: 0 0 -2px 0;
        }

        .copyToClipboardPar {
          position: relative;
        }

        .copyToClipboard {
          position: absolute;
          right: 10px;
          top: 8px;
          transition: all 0.1s ease;
          cursor: pointer;
        }

        .copyToClipboard:hover {
          transform: scale(1.5);
        }
      `}</style>
    </article>
  ); // http://localhost:3000/problem/1000
}
