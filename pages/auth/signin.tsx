import {
  getProviders,
  signIn,
  getCsrfToken,
  useSession,
} from "next-auth/react";
import { InferGetServerSidePropsType } from "next";
import { Button, Grid, Image } from "@nextui-org/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { CtxOrReq } from "next-auth/client/_utils";
import { Modal, Text } from "@nextui-org/react";

const SignIn = ({
  providers,
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [router, session]);

  return (
    <Modal open width="340px" preventClose>
      <Modal.Header>
        <Text size="xx-large" className="">
          Sign In
        </Text>
      </Modal.Header>
      <Modal.Body>
        {providers
          ? Object.values(providers).map((provider, i) => {
              if (provider.id !== "email") {
                return (
                  <div
                    key={provider.name}
                    onClick={() => {
                      signIn(provider.id);
                    }}
                    style={{
                      cursor: "pointer",
                      border: "1px solid rgba(0 , 0 , 0 , 0.5)",
                      borderRadius: "5px",
                      padding: "5px",
                    }}
                  >
                    <Grid.Container alignContent="center">
                      <Grid justify="center">
                        <Image
                          showSkeleton
                          width={"2em"}
                          objectFit="contain"
                          src={`/images/${provider.name.toLocaleLowerCase()}.svg`}
                          alt="Dina의 이미지"
                          color="black"
                          css={{
                            filter:
                              "invert(0%) sepia(0%) saturate(7500%) hue-rotate(294deg) brightness(107%) contrast(102%);",
                            fill: "Black",
                            cursor: "pointer",
                          }}
                        />
                      </Grid>
                      <Grid justify="center">
                        <div
                          style={{
                            position: "relative",
                            top: "50%",
                            margin: "0px",
                            padding: "0px",
                            transform: "translate(10px , -50%)",
                            fontSize: "var(--nextui-fontSizes-xl)",
                            cursor: "pointer",
                            textAlign: "center",
                          }}
                          className=""
                        >
                          Sign In with <strong>{provider.name}</strong>
                        </div>
                      </Grid>
                    </Grid.Container>
                  </div>
                );
              }
            })
          : ""}{" "}
      </Modal.Body>
      <Modal.Footer>
        <Button
          style={{
            fontSize: "var(--nextui-fontSizes-xl)",
          }}
          color="gradient"
          onClick={() => {
            router.push("/");
          }}
        >
          Go Back
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const getServerSideProps = async (context: CtxOrReq | undefined) => {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: { providers, csrfToken },
  };
};

export default SignIn;
