import { useTheme } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function MyHead() {
  let { theme } = useTheme();
  const { data: session, status } = useSession();

  const lpad = function (padString: string, length: number) {
    var str = padString;
    while (str.length < length) str = "0" + str;
    return str;
  };

  function getUsername() {
    if (status != "authenticated") return "";
    let idonlynum = parseInt(session?.user?.id.replace(/\D/g, "") as string);
    let a = session?.user?.name;
    let b = session?.user?.email;
    return `${a}#${lpad((idonlynum % 10000).toString(), 4)}`;
  }

  return (
    <div
      style={{
        color: `${theme?.colors.green500}`,
        position: "fixed",
        top: "0px",
        left: "0px",
        right: "0px",
        height: "76px",
        padding: "7px",
        paddingTop: "0px",
        borderBottom: `1px solid ${theme?.colors.neutralBorder}`,
      }}
    >
      <Link href="/" style={{}}>
        <h1
          style={{
            cursor: "pointer",
          }}
        >
          Dioh
        </h1>
      </Link>
      <div
        style={{
          display: "inline-block",
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          color: `${theme?.colors.black.value}`,
        }}
      >
        {status == "loading" ? (
          <div>Loading...</div>
        ) : (
          <>
            {status == "authenticated" ? `@${getUsername()} ` : ""}
            {status == "authenticated" ? (
              <Link href="/api/auth/signout">
                <div
                  style={{
                    display: "inline-block",
                    cursor: "pointer",
                  }}
                >
                  | Sign Out
                </div>
              </Link>
            ) : (
              <Link href="/api/auth/signin">
                <div
                  style={{
                    cursor: "pointer",
                  }}
                >
                  Sign In
                </div>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
