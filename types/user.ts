export default interface User {
  BanStarted: number;
  Banned: boolean;
  Warns: string[];
  email: string;
  emailVerified: any;
  havingPoint: number;
  id: string;
  image: string;
  name: string;
  nameColor: string;
  nickName: string;
  permission: string[];
  solvedProblems: string[];
  UserBackgroundImgIndex: number;
  HavingBackgroundImgIndexes: number[];
}
