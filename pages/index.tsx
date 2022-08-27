import type { NextPage } from "next";
import MyHead from "../components/head";
import MainArticle from "./../components/MainPage/main";

const Home: NextPage = () => {
  return (
    <>
      <MyHead /> {/* 헤드 */}
      <MainArticle />
    </>
  );
};

export default Home;
