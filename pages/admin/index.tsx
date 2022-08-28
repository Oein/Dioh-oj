import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Button,
  Input,
  Link,
  Navbar,
  Text,
  Image,
  Grid,
} from "@nextui-org/react";
import { Dispatch, SetStateAction, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

// Markdown
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import docco from "react-syntax-highlighter/dist/cjs/styles/hljs/docco";
import { HeadingComponent } from "react-markdown/lib/ast-to-react";

import { toast } from "react-toastify";

const markdownH3: HeadingComponent = ({ children, ...props }) => {
  return (
    <div className="borderBottom">
      <h3 className="borderBottomColored">{children}</h3>
    </div>
  );
};

interface prop {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  idx: number;
  setIDX: Dispatch<SetStateAction<number>>;
  time: number;
  setTime: Dispatch<SetStateAction<number>>;
  point: number;
  setPoint: Dispatch<SetStateAction<number>>;
  memory: number;
  setMemory: Dispatch<SetStateAction<number>>;
  session: any;
  monaco: string;
  setMonaco: Dispatch<SetStateAction<string>>;
  monaco2: string;
  setMonaco2: Dispatch<SetStateAction<string>>;
  body: string;
  setBody: Dispatch<SetStateAction<string>>;
}

interface SubPage {
  name: string;
  Page: (prop: prop) => JSX.Element;
}

let pages: SubPage[] = [
  {
    name: "Create Problems",
    Page: (prop) => {
      return (
        <article className="container">
          <Text id="Create Problems" size="$2xl">
            Create Problems
          </Text>

          {/* Problem Name */}
          <p
            style={{
              fontSize: "15px",
            }}
          >
            &nbsp;
          </p>
          <Input
            labelPlaceholder="Problem Name"
            fullWidth
            maxLength={50}
            value={prop.name}
            onChange={(e) => {
              prop.setName(e.target.value);
            }}
          />

          {/* Problem Number */}
          <p
            style={{
              fontSize: "20px",
            }}
          >
            &nbsp;
          </p>
          <Input
            labelPlaceholder="Problem Number"
            type="number"
            min="1"
            max="2147483647"
            fullWidth
            value={prop.idx}
            onChange={(e) => {
              prop.setIDX(parseInt(e.target.value));
            }}
          />

          {/* Problem Time */}
          <p
            style={{
              fontSize: "20px",
            }}
          >
            &nbsp;
          </p>
          <Input
            labelPlaceholder="Problem Max Time Limit (ms)"
            type="number"
            min="1"
            max="100000"
            fullWidth
            value={prop.time}
            onChange={(e) => {
              prop.setTime(parseInt(e.target.value));
            }}
          />

          {/* Problem Memory */}
          <p
            style={{
              fontSize: "20px",
            }}
          >
            &nbsp;
          </p>
          <Input
            labelPlaceholder="Problem Memory Limit (MB)"
            type="number"
            min="1"
            max="1024"
            fullWidth
            value={prop.memory}
            onChange={(e) => {
              prop.setMemory(parseInt(e.target.value));
            }}
          />

          {/* Problem Point */}
          <p
            style={{
              fontSize: "20px",
            }}
          >
            &nbsp;
          </p>
          <Input
            labelPlaceholder="Problem Point"
            type="number"
            min="0"
            max="10"
            fullWidth
            value={prop.point}
            onChange={(e) => {
              prop.setPoint(parseInt(e.target.value));
            }}
          />

          {/* Problem Test Case */}
          <p
            style={{
              fontSize: "8px",
            }}
          >
            &nbsp;
          </p>
          <Text size="$xl">TestCase</Text>
          <Editor
            theme="vs-dark"
            language="json"
            height="500px"
            defaultValue={`[
  [
    
  ]
]
`}
            value={prop.monaco}
            onChange={(e) => {
              prop.setMonaco(e || "");
            }}
          />

          {/* Problem Body */}
          <p
            style={{
              fontSize: "8px",
            }}
          >
            &nbsp;
          </p>
          <Text size="$xl">Body</Text>
          <Grid.Container>
            <Grid xs={6}>
              <Editor
                theme="vs-dark"
                language="markdown"
                height="500px"
                defaultValue={prop.body}
                value={prop.body}
                onChange={(e) => {
                  prop.setBody(e || "");
                }}
              />
            </Grid>
            <Grid xs={6}>
              <div
                style={{
                  margin: "5px",
                }}
              >
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
                            <div className="copyToClipboard">
                              <Image
                                showSkeleton
                                src="/images/copy.svg"
                                alt="Copy To Clipboard"
                                objectFit="contain"
                                width="1.5em"
                              />
                            </div>
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
                    h2: markdownH3,
                    h1: markdownH3,
                    h3: markdownH3,
                    p: ({ children }) => {
                      return <p className="font">{children}</p>;
                    },
                  }}
                >
                  {prop.body}
                </ReactMarkdown>
              </div>
            </Grid>
          </Grid.Container>

          {/* Problem Create Button */}
          <Button
            onPress={() => {
              axios(`/api/problems/create/${prop.session.data?.user.id}`, {
                params: {
                  name: prop.name,
                  time: prop.time,
                  memory: prop.memory,
                  point: prop.point,
                  id: prop.idx,
                  testcase: prop.monaco,
                  body: prop.body,
                },
              }).then((v) => {
                let res = v.data;
                if (res.err) {
                  toast(res.err, {
                    type: "error",
                  });
                }
                if (res.suc) {
                  toast(res.suc, {
                    type: "success",
                  });
                }
              });
            }}
          >
            Create
          </Button>

          {/* css */}
          <style jsx>{`
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

          <style>{`
            .rotateOnHover {
              transition: all 1s ease;
            }

            .rotateOnHover:hover {
              transform: translateY(-50%) rotate(360deg);
            }
        `}</style>
        </article>
      );
    },
  },
];

export default function AdminPannel() {
  let [activedPage, setActivedPage] = useState(0);

  // Page 0
  let [idx, setIdx] = useState(1);
  let [memory, setMemory] = useState(128);
  let [point, setPoint] = useState(1);
  let [time, setTime] = useState(1000);
  let [name, setName] = useState("");
  let [monaco, setMonaco] = useState("");
  let [monaco2, setMonaco2] = useState("");
  let [body, setBody] = useState("## 문제\n\n## 입력\n\n## 출력\n");

  // This Page

  let session = useSession();
  let router = useRouter();

  if (session.status == "loading") {
    return <>Loading...</>;
  }

  if (session.status == "unauthenticated") {
    router.push("/auth/signin");
    return;
  }

  if (session.status == "authenticated") {
    if (
      !((session.data.user?.permission as string[]) || []).includes("admin")
    ) {
      router.push("/auth/signin");
      return;
    }

    return (
      <div
        style={{
          marginTop: "-76px",
        }}
      >
        <Navbar
          isCompact
          isBordered
          variant="sticky"
          onScrollPositionChange={(num) => {
            console.log(num);
          }}
        >
          <Navbar.Brand>
            <Text size="$3xl">Dioh Admin Pannel</Text>
          </Navbar.Brand>
          <Navbar.Content
            variant="underline-rounded"
            hideIn="xs"
            activeColor="primary"
          >
            {pages.map((page, index) => {
              return (
                <Navbar.Item
                  isActive={index == activedPage}
                  key={index}
                  onClick={() => {
                    setActivedPage(index);
                  }}
                >
                  <Link href={`#${page.name}`}>
                    <div
                      style={{
                        color: "var(--nextui-colors-text)",
                      }}
                    >
                      {page.name}
                    </div>
                  </Link>
                </Navbar.Item>
              );
            })}
          </Navbar.Content>
        </Navbar>
        {pages[activedPage].Page({
          idx: idx,
          setIDX: setIdx,
          name: name,
          setName: setName,
          memory: memory,
          setMemory: setMemory,
          point: point,
          setPoint: setPoint,
          time: time,
          setTime: setTime,
          session: session,
          monaco: monaco,
          setMonaco: setMonaco,
          monaco2: monaco2,
          setMonaco2: setMonaco2,
          body: body,
          setBody: setBody,
        })}
      </div>
    );
  }
}
