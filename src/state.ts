import { atom } from "recoil";
import { getUserInfo } from "zmp-sdk";

export const tokenState = atom({
  key: "tokenState",
  default: "",
});

export const deviceState = atom({
  key: "deviceState",
  default: "",
});
