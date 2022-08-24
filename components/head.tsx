import { Grid } from "@nextui-org/react";
import Link from "next/link";

export default function MyHead() {
  return (
    <div
      style={{
        position: "fixed",
        top: "0px",
        left: "0px",
        right: "0px",
        height: "76px",
        padding: "7px",
        paddingTop: "0px",
        borderBottom: "1px solid rgba(0 , 0 , 0 ,0.5)",
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
