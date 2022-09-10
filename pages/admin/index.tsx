import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Navbar, Text } from "@nextui-org/react";
import { Dispatch, SetStateAction, useState } from "react";

import update from "../../components/Admin/update";
import create from "../../components/Admin/create";
import Load from "../../components/Loading";

export interface prop {
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
  loading: boolean;
  load: Dispatch<SetStateAction<boolean>>;
}

export interface SubPage {
  name: string;
  Page: (prop: prop) => JSX.Element;
}

let pages: SubPage[] = [create, update];

export default function AdminPannel() {
  let [activedPage, setActivedPage] = useState(0);

  // Page 0
  let [idx, setIdx] = useState(1);
  let [memory, setMemory] = useState(128);
  let [point, setPoint] = useState(1);
  let [time, setTime] = useState(1000);
  let [name, setName] = useState("");
  let [loading, setLoading] = useState(false);
  let [monaco, setMonaco] = useState(`[
  [
      
  ]
]`);
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
        {loading ? <Load /> : null}
        <Navbar
          isCompact
          isBordered
          variant="sticky"
          onScrollPositionChange={(num) => {}}
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
                  <div
                    style={{
                      color: "var(--nextui-colors-text)",
                    }}
                  >
                    {page.name}
                  </div>
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
          loading: loading,
          load: setLoading,
        })}
      </div>
    );
  }
}
