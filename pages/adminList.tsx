import type { NextPage } from "next";
import MyHead from "../components/head";
import MyFooter from "../components/footer";
import { Link, User } from "@nextui-org/react";

interface Admin {
  name: string;
  role: string;
  src: string;
  LINKS: JSX.Element;
}

const admins: Admin[] = [
  {
    name: "SungHyun#0219",
    role: "Owner / Developer",
    src: "https://avatars.githubusercontent.com/u/62917247?v=4",
    LINKS: (
      <>
        <Link href="https://github.com/oein">Github / @Oein</Link>
        <Link>Discord / oein#5694</Link>
        <Link href="mailto:oein0219@gmail.com">Email / oein0219@gmail.com</Link>
      </>
    ),
  },
  {
    name: "SDnight#7447",
    role: "Admin / Artist / Problem Maker",
    src: "https://avatars.githubusercontent.com/u/110544189?v=4",
    LINKS: (
      <>
        <Link href="https://github.com/sdnight5">Github / @sdnight5</Link>
        <Link>Discord / 디나이트#7447</Link>
        <Link href="mailto:sdnight5@daum.net">Email / sdnight5@daum.net</Link>
        <Link href="/weAreDeving">전 한거 없어요</Link>
      </>
    ),
  },
  {
    name: "pokmui9909#8971",
    role: "Problem Maker",
    src: "https://cdn.discordapp.com/embed/avatars/3.png",
    LINKS: (
      <>
        <Link>Discord / pokmui9909#3263</Link>
      </>
    ),
  },
];

const AdminList: NextPage = () => {
  return (
    <>
      <MyHead /> {/* 헤드 */}
      <article className="container">
        {admins.map((admin, idx) => {
          return (
            <details
              style={{
                borderRadius: "5px",
                marginTop: "10px",
              }}
              key={idx}
            >
              <summary>
                <User
                  src={admin.src}
                  name={admin.name}
                  description={admin.role}
                  bordered
                  size="lg"
                ></User>
              </summary>
              <div
                style={{
                  padding: "10px",
                }}
              >
                {admin.LINKS}
              </div>
            </details>
          );
        })}
      </article>
      <MyFooter /> {/* 풋터 */}
    </>
  );
};

export default AdminList;
