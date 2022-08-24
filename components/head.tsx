import { Grid, useTheme } from "@nextui-org/react";
import Link from "next/link";

export default function MyHead() {
  let { theme } = useTheme();
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
      <Grid.Container>
        <Grid>
          <Link href="/">
            <h1
              style={{
                cursor: "pointer",
              }}
            >
              Dioh
            </h1>
          </Link>
        </Grid>
      </Grid.Container>
    </div>
  );
}
