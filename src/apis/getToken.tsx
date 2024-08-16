import { BASE_URL } from "constants";
import PATH from "constants/path";
import { FETCHApi } from "utils";
type TGetTokenRES = {
  token: string;
};
const getToken = () => {
  return FETCHApi(BASE_URL, PATH.JWT_TOKEN, "POST", {
    data: {
      username: "admin",
      password: "admin",
    },
  }) as Promise<TGetTokenRES>;
};
export default getToken;
