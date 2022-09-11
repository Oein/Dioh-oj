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

import { Image } from "@nextui-org/react";

export default function MD(props: { text: string }) {
  const markdownH3: HeadingComponent = ({ children, ...props }) => {
    return (
      <div className="borderBottom">
        <h3 className="borderBottomColored">{children}</h3>
      </div>
    );
  };

  return (
    <>
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
                  {("\n" + String(children) + "_EMEMEM_")
                    .replace(/\n$/, "")
                    .replaceAll(" ", "␣")
                    .replace("_EMEMEM_", " ")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={`${className}`} {...props}>
                {("\n" + String(children) + "_EMEMEM_")
                  .replace(/\n$/, "")
                  .replaceAll(" ", "␣")
                  .replace("_EMEMEM_", " ")}
              </code>
            );
          },
          h2: markdownH3,
          h1: markdownH3,
          h3: markdownH3,
          p: ({ children }) => {
            return <p className="">{children}</p>;
          },
        }}
      >
        {props.text}
      </ReactMarkdown>

      {/* css */}
      <style jsx>{`
        .copyToClipboardPar {
          position: relative;
        }

        .copyToClipboard {
          position: absolute;
          right: 10px;
          top: 8px;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .copyToClipboard:hover {
          transform: scale(1.5) rotateZ(360deg);
        }
      `}</style>
    </>
  );
}
