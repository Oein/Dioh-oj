import { Button, Input, Text, Image, Grid } from "@nextui-org/react";
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
import { SubPage } from "../../pages/admin";

const markdownH3: HeadingComponent = ({ children, ...props }) => {
  return (
    <div className="borderBottom">
      <h3 className="borderBottomColored">{children}</h3>
    </div>
  );
};

let update: SubPage = {
  name: "Update Problems",
  Page: (prop) => {
    return (
      <article className="container">
        <Text id="Update Problems" size="$2xl">
          Update Problems
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
          max="100"
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
        <Grid.Container>
          <Grid xs={6}>
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
          </Grid>
          <Grid xs={6}>
            <div
              style={{
                padding: "3px",
                height: "500px",
                overflow: "auto",
                width: "100%",
              }}
            >
              {(() => {
                try {
                  return (
                    <>
                      {(
                        JSON.parse(`{ "a" : ${prop.monaco} }`)["a"] as (
                          | { input: string; output: string }
                          | number
                        )[][]
                      ).map((v, idx) => {
                        return (
                          <>
                            <details>
                              <summary>
                                <h3>
                                  <>
                                    Test case {idx + 1} / Score : {v[0]}
                                  </>
                                </h3>
                              </summary>
                              <div
                                style={{
                                  paddingLeft: "5px",
                                }}
                              >
                                {v.map((b, idxb) => {
                                  if (typeof b == "number") {
                                    if (idxb == 0) {
                                      return null;
                                    }
                                    throw new Error(`Test case must be like this 
[
  [
    score,
    {
      "input": "[Input]",
      "output": "[Output]",
    },
    {
      "input": "[Input]",
      "output": "[Output]",
    }
  ],
  [
    score,
    {
      "input": "[Input]",
      "output": "[Output]",
    },
    {
      "input": "[Input]",
      "output": "[Output]",
    }
  ]
]`);
                                  }

                                  return (
                                    <>
                                      <details>
                                        <summary>
                                          {" "}
                                          - Sub test case {idxb}
                                        </summary>
                                        <details>
                                          <summary>input</summary>
                                          <pre>
                                            <code>{b.input}</code>
                                          </pre>
                                        </details>
                                        <details>
                                          <summary>output</summary>
                                          <pre>
                                            <code>{b.output}</code>
                                          </pre>
                                        </details>
                                      </details>
                                    </>
                                  );
                                })}
                              </div>
                            </details>
                          </>
                        );
                      })}
                    </>
                  );
                } catch (e) {
                  return (
                    <>
                      <h2>Error was found in your json.</h2>
                      <div>
                        {((e as any).message as string)
                          .replace(/ /g, "\u00A0\u00A0")
                          .split("\n")
                          .map((a, b) => {
                            return <p key={b}>{a}</p>;
                          })}
                      </div>
                    </>
                  );
                }
              })()}
            </div>
          </Grid>
        </Grid.Container>

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
                height: "500px",
                overflow: "auto",
                width: "100%",
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

            details {
              border: 1px solid #aaa;
              border-radius: 4px;
              padding: .5em .5em 0;
              background: var(--nextui-colors-background);
            }
            
            summary {
              font-weight: bold;
              margin: -.5em -.5em 0;
              padding: .5em;
            }
            
            details[open] {
              padding: .5em;
            }
        `}</style>
      </article>
    );
  },
};

export default update;
