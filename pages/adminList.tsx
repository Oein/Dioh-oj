import type { NextPage } from "next";
import MyHead from "../components/head";
import MyFooter from "../components/footer";
import { Link, Popover, User } from "@nextui-org/react";

const AdminList: NextPage = () => {
  return (
    <>
      <MyHead /> {/* 헤드 */}
      <article className="container">
        <details
          style={{
            borderRadius: "5px",
          }}
        >
          <summary>
            <User
              src="https://avatars.githubusercontent.com/u/62917247?v=4"
              name="SungHyun#0219"
              description="Owner / Developer"
              bordered
              size="lg"
            ></User>
          </summary>
          <div
            style={{
              padding: "10px",
            }}
          >
            <Link href="https://github.com/oein">Github / @Oein</Link>
            <Link>Discord / oein#5694</Link>
            <Link href="mailto:oein0219@gmail.com">
              Email / oein0219@gmail.com
            </Link>
          </div>
        </details>
        <details
          style={{
            borderRadius: "5px",
            marginTop: "10px",
          }}
        >
          <summary>
            <User
              src="https://avatars.githubusercontent.com/u/110544189?v=4"
              name="SDnight#7447"
              description="Admin / Artist / Problem Maker"
              bordered
              size="lg"
            ></User>
          </summary>
          <div
            style={{
              padding: "10px",
            }}
          >
            <Link href="https://github.com/sdnight5">Github / @sdnight5</Link>
            <Link>Discord / 디나이트#7447</Link>
            <Link href="mailto:sdnight5@daum.net">
              Email / sdnight5@daum.net
            </Link>
            <Link href="/weAreDeving">전 한거 없어요</Link>
          </div>
        </details>
      </article>
      <MyFooter /> {/* 풋터 */}
    </>
  );
};

export default AdminList;
