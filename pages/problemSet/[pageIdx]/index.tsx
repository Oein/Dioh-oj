import { Pagination, Table, Text, Grid, Image } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import MyHead from "../../../components/head";

export default function Problems() {
  let [problems, setProblems] = useState<{ name: string; id: string }[]>([
    {
      name: "Loading...",
      id: "Loading...",
    },
  ]);

  let [pageCount, setPageCount] = useState(1);

  let router = useRouter();

  let { pageIdx } = router.query;

  useEffect(() => {
    axios
      .get(`/api/problems/get/page/${pageIdx as string}`)
      .then((v) => {
        console.log(v.data);
        setProblems(v.data);
      })
      .catch((err) => {
        setProblems([
          {
            id: "Error occured" as string,
            name: err.message as string,
          },
        ]);
      });

    axios.get("/api/problems/get/count").then((v) => {
      const cnt = (parseInt(v.data) - 1) / 100;
      setPageCount(cnt + 1);
    });
  }, [pageIdx]);

  return (
    <>
      <MyHead />
      <article className="container">
        <Grid.Container>
          <Grid>
            <Image
              showSkeleton
              width={"2em"}
              objectFit="contain"
              className="centerH"
              src="../../images/chart.svg"
              alt="Dina의 이미지"
              style={{
                cursor: "pointer",
              }}
            />
          </Grid>
          <Grid>
            <Text size="xx-large" className="font centerH">
              {parseInt(pageIdx as string) + 1}번째 페이지
            </Text>
          </Grid>
        </Grid.Container>
        <Table>
          <Table.Header>
            <Table.Column>문제 번호</Table.Column>
            <Table.Column>문제 이름</Table.Column>
          </Table.Header>
          <Table.Body>
            {problems.map((v, idx) => {
              return (
                <Table.Row key={idx}>
                  <Table.Cell>
                    <Link href={`/problem/${v.id}`}>
                      <div>{v.id}</div>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link href={`/problem/${v.id}`}>
                      <div>{v.name}</div>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <Pagination
          total={pageCount}
          initialPage={parseInt(pageIdx as string) + 1}
          onChange={(v) => {
            let dt = Math.floor(v) - 1;
            if (dt == NaN) {
              router.push(`/problemSet/0`);
              return;
            }
            router.push(`/problemSet/${dt}`);
          }}
        />
      </article>
    </>
  );
}
