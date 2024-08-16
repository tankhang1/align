import { BASE_URL } from "constants";
import PATH from "constants/path";
import { TFormSubmit, TZaloRecord } from "types";
import { FETCHApi } from "utils";
type TSubmitFormRES = {
  data: number;
  status: number;
  message: string;
};
const submitSurveyForm = async (
  bearerToken: string,
  formResult: TFormSubmit
) => {
  return (await FETCHApi(BASE_URL, PATH.CONFIRM_SURVEY, "POST", {
    headers: {
      Authorization: bearerToken ? `Bearer ${bearerToken}` : undefined,
    },
    data: formResult,
  })) as Promise<TSubmitFormRES>;
};
export default submitSurveyForm;
