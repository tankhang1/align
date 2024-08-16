import { BASE_URL } from "constants";
import PATH from "constants/path";
import { FETCHApi } from "utils";
type TRefreshTokenRES = {
  data: string;
  status: number;
  message: string;
};
const refreshToken = async (bearerToken: string) => {
  return (await FETCHApi(BASE_URL, PATH.JWT_REFRESH_TOKEN, "POST", {
    headers: {
      Authorization: bearerToken ? `Bearer ${bearerToken}` : undefined,
    },
  })) as Promise<TRefreshTokenRES>;
};
export default refreshToken;
