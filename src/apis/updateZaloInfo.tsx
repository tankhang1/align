import { BASE_URL } from "constants";
import PATH from "constants/path";
import { TZaloRecord } from "types";
import { FETCHApi } from "utils";
type TUpdateZaloInfoRES = {
  data: string;
  status: number;
  message: string;
};
const updateZaloInfo = (bearerToken: string, zaloInfo: TZaloRecord) => {
  return FETCHApi(BASE_URL, PATH.UPDATE_ZALO_INFO, "POST", {
    headers: {
      Authorization: bearerToken ? `Bearer ${bearerToken}` : undefined,
    },
    data: zaloInfo,
  }) as Promise<TUpdateZaloInfoRES>;
};
export default updateZaloInfo;
