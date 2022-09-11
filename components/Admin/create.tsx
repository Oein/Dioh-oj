import { Button, Input, Text, Grid } from "@nextui-org/react";
import Editor from "@monaco-editor/react";
import axios from "axios";

import { toast } from "react-toastify";
import { SubPage } from "../../pages/admin";
import { Suspense } from "react";
import NFullLoad from "../Loading/nFull";
import dynamic from "next/dynamic";

const MD = dynamic(() => import("../ProblemPage/md"), {
  suspense: true,
});

let create: SubPage = {
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
              <Suspense fallback={`Loading...`}>
                <Suspense fallback={<NFullLoad />}>
                  <MD text={prop.body} />
                </Suspense>
              </Suspense>
            </div>
          </Grid>
        </Grid.Container>

        {/* Problem Create Button */}
        <Button
          onPress={() => {
            prop.load(true);
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
            })
              .then((v) => {
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
              })
              .finally(() => {
                prop.load(false);
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

export default create;
