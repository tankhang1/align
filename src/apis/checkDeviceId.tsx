import { BASE_URL } from "constants";
import PATH from "constants/path";
import { FETCHApi } from "utils";
type TCheckDeviceId = {
  data: any;
  status: number; //1: success -2: Exists
};
const checkDeviceId = (bearerToken: string, deviceId: string) => {
  return FETCHApi(BASE_URL, PATH.CHECK_DEVICE_ID, "GET", {
    headers: {
      Authorization: bearerToken ? `Bearer ${bearerToken}` : undefined,
    },
    params: {
      d: deviceId,
    },
  }) as Promise<TCheckDeviceId>;
};
export default checkDeviceId;
