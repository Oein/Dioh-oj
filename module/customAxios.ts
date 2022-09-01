import axios from "axios";
import { getSession } from "next-auth/react";

const ApiClient = () => {
  const instance = axios.create();
  instance.interceptors.request.use(async (request) => {
    const session = await getSession();

    if (session) {
      request.headers!.Authorization = `${session.user?.id}`;
    }
    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(`error`, error);
    }
  );

  return instance;
};

export default ApiClient();
