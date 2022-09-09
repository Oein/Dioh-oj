import type { NextPage } from "next";
import MyHead from "../components/head";
import MyFooter from "../components/footer";
import MainArticle from "./../components/MainPage/main";

const Home: NextPage = () => {
  return (
    <>
      <MyHead /> {/* 헤드 */}
      <MainArticle />
      <MyFooter /> {/* 풋터 */}
    </>
  );
};

export default Home;
