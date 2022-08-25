import { Grid, useTheme } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function MyHead() {
  let { theme } = useTheme();
  const { data: session, status } = useSession();

  return (
    <div
      style={{
        color: `${theme?.colors.green800}`,
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
        }}
      >
        {status == "authenticated" ? session.user?.name + " " : ""}
        {status == "authenticated" ? (
          <Link href="/api/auth/signout">
            <div
              style={{
                display: "inline-block",
                cursor: "pointer",
              }}
            >
              {" "}
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
      </div>
    </div>
  );
}
