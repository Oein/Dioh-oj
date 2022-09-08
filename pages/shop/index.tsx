import MyHead from "../../components/head";
import { Grid, Image, Text, Modal, Button, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import Load from "../../components/Loading/index";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import customAxios from "../../module/customAxios";
import { toast } from "react-toastify";

const Item = ({
  imageURL,
  name,
  price,
  buyListener,
}: {
  imageURL: string;
  name: string;
  price: number;
  buyListener: () => void;
}) => {
  return (
    <div
      style={{
        width: "calc(100% / 3.3)",
        height: "calc(100% / 3.3)",
        background: "white",
        margin: "5px",
        display: "inline-block",
        boxShadow: "var(--nextui-shadows-md)",
        borderRadius: "var(--nextui-radii-md)",
        padding: "var(--nextui-radii-md)",
      }}
    >
      <Image showSkeleton width="70%" src={imageURL} alt="Item image" />
      <Text
        className="font"
        style={{
          fontSize: "var(--nextui-fontSizes-md)",
        }}
      >
        {name}
      </Text>

      <Grid.Container>
        <Grid>
          <div
            style={{
              fontSize: "var(--nextui-fontSizes-md)",
            }}
            className="centerH"
          >
            {price}
          </div>
        </Grid>
        <Grid>
          <div
            style={{
              width: "5px",
            }}
          ></div>
        </Grid>
        <Grid>
          <Image
            className="centerH"
            showSkeleton
            width="var(--nextui-fontSizes-md)"
            src={`/images/point.svg`}
            alt="Point"
          />
        </Grid>
      </Grid.Container>
      <Button
        css={{
          marginTop: "calc(var(--nextui-fontSizes-md) + 0.3rem)",
        }}
        auto
        className="centerH"
        onPress={buyListener}
      >
        구매
      </Button>
    </div>
  );
};

export default function Shop() {
  let [modalID, setModalID] = useState(-1);
  // Change nickname color
  let [color, setColor] = useColor("hex", "#000000");
  // Change nickname
  let [inputStr, setInputStr] = useState("");

  let [loading, load] = useState(false);
  let session = useSession();
  let router = useRouter();

  useEffect(() => {
    if (session.status == "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [router, session.status]);

  return (
    <>
      {session.status == "loading" ? <Load /> : null}
      {loading ? <Load /> : null}
      <MyHead />

      {/* 닉 변경 */}
      <Modal open={modalID == 0} onClose={() => setModalID(-1)}>
        <Modal.Header>
          <div
            style={{
              fontSize: "var(--nextui-fontSizes-xl)",
            }}
          >
            Change Nick Name
          </div>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              height: "14px",
            }}
          ></div>
          <Input
            labelPlaceholder="새로운 닉네임"
            value={inputStr}
            onChange={(e) => {
              setInputStr(e.target.value);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="success"
            onClick={() => {
              load(true);
              setModalID(-1);
              customAxios
                .get(`/api/user/update/nickname/${inputStr}`)
                .then((v) => {
                  if (v.data.err) {
                    toast(`Err occured / ${v.data.err}`, { type: "error" });
                  }
                  if (v.data.suc) {
                    toast(`${v.data.suc}`, { type: "success" });
                  }
                })
                .catch((e) => {
                  toast(`Err occured / ${e}`, { type: "error" });
                })
                .finally(() => {
                  load(false);
                });
            }}
          >
            구매
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 닉색 변경 */}
      <Modal open={modalID == 1} onClose={() => setModalID(-1)}>
        <Modal.Header>
          <div
            style={{
              fontSize: "var(--nextui-fontSizes-xl)",
            }}
          >
            Change Nick Color
          </div>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              position: "relative",
              left: "50%",
              top: "0px",
              transform: "translateX(-50%)",
              width: "fit-content",
            }}
          >
            <ColorPicker
              width={250}
              color={color}
              onChange={setColor}
              hideHSV
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="success"
            onClick={() => {
              load(true);
              setModalID(-1);
              customAxios
                .get(`/api/user/update/color/${color.hex.slice(1)}`)
                .then((v) => {
                  if (v.data.err) {
                    toast(`Err occured / ${v.data.err}`, { type: "error" });
                  }
                  if (v.data.suc) {
                    toast(`${v.data.suc}`, { type: "success" });
                  }
                })
                .catch((e) => {
                  toast(`Err occured / ${e}`, { type: "error" });
                })
                .finally(() => {
                  load(false);
                });
            }}
          >
            구매
          </Button>
        </Modal.Footer>
      </Modal>

      <article className="container m375">
        <Item
          imageURL="/images/articles.svg"
          name="닉네임 변경"
          price={100}
          buyListener={() => {
            setModalID(0);
          }}
        />
        <Item
          imageURL="/images/articles.svg"
          name="태그 번호 변경"
          price={100}
          buyListener={() => {
            alert("You bought!");
          }}
        />
        <Item
          imageURL="/images/articles.svg"
          name="이름 색상 변경"
          price={100}
          buyListener={() => {
            setModalID(1);
          }}
        />
      </article>

      <article className="nm375">
        <div
          style={{
            textAlign: "center",
            fontSize: "var(--nextui-fontSizes-3xl)",
          }}
        >
          : (
        </div>
        <div
          style={{
            textAlign: "center",
          }}
        >
          화면이 너무 작아 상점을 표시할 수 없습니다.
        </div>
      </article>
    </>
  );
}
