import AppInput from "components/app-input";
import React, { useState } from "react";
import { Page, Button, Modal, Sheet, Input, Box } from "zmp-ui";
import Gift from "../../assets/QUA TANG.jpg";
import { useRecoilState, useRecoilValue } from "recoil";
import { deviceState, surveyLocationUuid, tokenState } from "state";
import submitSurveyForm from "apis/submitSurveyForm";
import refreshToken from "apis/refreshToken";
import {
  authorize,
  getAccessToken,
  getPhoneNumber,
  getUserInfo,
  openWebview,
} from "zmp-sdk";
import updateZaloInfo from "apis/updateZaloInfo";
import { TZaloRecord } from "types";
type TQuestion = {
  questionName: string;
  placeholder?: string;
  type: React.HTMLInputTypeAttribute | "group" | "rating";
  required?: boolean;
  answers?: string[];
  isBold?: boolean;
  link?: string;
  isText?: boolean;
  pattern?: RegExp;
  errorTxt?: string;
};
const QUESTIONS: TQuestion[] = [
  {
    questionName: "Tên bác sĩ và địa chỉ nha khoa",
    placeholder: "VD: Bác sĩ A, trưởng khoa bệnh viện Ung Bứu",
    required: true,
    type: "text",
  },
  {
    questionName: "Tỉnh thành",
    placeholder: "VD: Hồ Chí Minh",
    required: true,
    type: "select",
  },
  {
    placeholder: "VD: 03568556xx",
    questionName: "Số điện thoại",
    required: true,
    type: "tel",
  },
  {
    placeholder: "VD: dk@gmail.com",
    questionName: "Email",
    required: true,
    type: "email",
    pattern: /^[^s@]+@[^s@]+.[^s@]+$/,
    errorTxt: "Sai định dạng email",
  },

  {
    questionName: "Sản phẩm bác sĩ hiện đang dùng trong chỉnh nha",
    required: false,
    type: "group",
    answers: [
      "Mắc cài kim loại",
      "Invisalign",
      "Angel Aligner",
      "Clear Correct",
      "Smartee",
      "Zenyum",
      "Khay-in-house",
      "Other",
    ],
  },
  {
    questionName: "Máy scan trong miệng mà bác sĩ đang dùng",
    required: false,
    type: "text",
    placeholder: "Nhập thông tin",
  },
  {
    questionName: "Bác sĩ có muốn đặt lịch thực hành với máy quét iTero không?",
    required: true,
    type: "radio",
    answers: ["Có", "Không"],
  },
  {
    questionName:
      "Mức độ quan tâm của bác sĩ về việc tăng thêm doanh thu từ chỉnh nha bằng khay trong suốt",
    required: true,
    type: "rating",
  },
];
type TForm = {
  result1: string;
  result2: string;
  result3: string;
  result4: string;
  result5: string;
  result6: string;
  result7: string;
  result8: string;
  zalo_device_id: string;
  survey_location_uuid: string;
};
const QuestionPage: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [openSubmitSuccess, setOpenSubmitSuccess] = useState(false);
  const [openSubmitError, setOpenSubmitError] = useState(false);
  const [openSubmitPhoneError, setOpenSubmitPhoneError] = useState(false);
  const [openFormError, setOpenFormError] = useState(false);
  const [openSystemError, setOpenSystemError] = useState(false);
  const [openTokenError, setOpenTokenError] = useState(false);
  const deviceId = useRecoilValue(deviceState);
  const [token, setToken] = useRecoilState(tokenState);
  const surveyUUID = useRecoilValue(surveyLocationUuid);
  const [openCancelGetInfo, setOpenCancelGetInfo] = useState(false);
  const [openRuleModal, setOpenRuleModal] = useState(false);
  const [otherValue, setOtherValue] = useState("");
  const [openGroupLink, setOpenGroupLink] = useState(false);
  const [answer, setAnswer] = useState<TForm>({
    result1: "",
    result2: "",
    result3: "",
    result4: "",
    result5: "",
    result6: "",
    result7: "",
    result8: "",
    zalo_device_id: deviceId,
    survey_location_uuid: surveyUUID,
  });
  const onChangeText = (
    questionIndex: number,
    type: React.HTMLInputTypeAttribute | "group" | "rating",
    value: string
  ) => {
    let tmp = answer;
    if (type === "group") {
      if (answer[`result${questionIndex}`].includes(value)) {
        const listResult = answer[`result${questionIndex}`]
          .split(",")
          .filter((item) => item !== value)
          .join(",");
        tmp = {
          ...tmp,
          [`result${questionIndex}`]: listResult,
        };
      } else {
        tmp = {
          ...tmp,
          [`result${questionIndex}`]:
            answer[`result${questionIndex}`] + "," + value,
        };
      }
    } else {
      tmp = {
        ...tmp,
        [`result${questionIndex}`]: value,
      };
    }
    setAnswer(tmp);
  };

  const onValidateForm = async (type: "cancel" | "submit") => {
    console.log({
      ...answer,
      result5: answer.result5 + "," + otherValue,
    });
    let flag = -1;
    setIsLoading(true);
    Object.keys(answer).forEach((item, index) => {
      if (
        item !== "zalo_device_id" &&
        item !== "survey_location_uuid" &&
        QUESTIONS[index].required &&
        answer[item] === ""
      ) {
        setIsLoading(false);
        setOpenFormError(true);
        flag = 0;
        return;
      }
    });
    if (flag === 0) return;
    const tmp = answer;
    console.log({
      ...tmp,
      result5: answer.result5 + "," + otherValue,
    });
    await submitSurveyForm(token, {
      ...tmp,
      result5: answer.result5 + "," + otherValue,
    })
      .then(async (value) => {
        setIsLoading(false);
        if (value.status === -1) {
          setOpenSystemError(true);
        }
        if (value.status === -2) {
          setOpenFormError(true);
        }
        if (value.status === -4) {
          setOpenSubmitError(true);
        }
        if (value.status === -3) {
          setOpenSubmitPhoneError(true);
        }
        if (value.status === 0) {
          if (type === "cancel") setOpenCancelGetInfo(true);
          else {
            setOpenSubmitSuccess(true);
            setTimeout(() => {
              setOpenGroupLink(true);
            }, 2000);
          }
        }
        if (value.code === "ERR_BAD_REQUEST") {
          setIsLoading(true);
          await refreshToken(token).then(async (value) => {
            await submitSurveyForm(value.data, {
              ...tmp,
              result5: answer.result5 + "," + otherValue,
            })
              .then(async (value) => {
                setIsLoading(false);
                if (value.status === -1) {
                  setOpenSystemError(true);
                }
                if (value.status === -2) {
                  setOpenFormError(true);
                }
                if (value.status === -4) {
                  setOpenSubmitError(true);
                }
                if (value.status === -3) {
                  setOpenSubmitPhoneError(true);
                }
                if (value.status === 0) {
                  if (type === "cancel") setOpenCancelGetInfo(true);
                  else setOpenSubmitSuccess(true);
                }
              })
              .catch(() => setIsLoading(false));
          });
        }
      })
      .catch(async (e) => {
        setIsLoading(false);
      });
  };
  const onSubmit = () => {
    setOpenRuleModal(false);
    setIsLoading(true);
    requestPrivateInfo();
  };
  const onCancel = () => {
    setOpenRuleModal(false);

    setIsLoading(true);
    onValidateForm("cancel");
  };
  const requestPrivateInfo = async () => {
    let info: TZaloRecord = {
      access_token: "",
      avatar: "",
      code_get_phone: "",
      is_sensitive: false,
      name: "",
      zalo_app_id: "564860906168559957",
      zalo_device_id: deviceId,
      followed_oa: false,
    };
    const accessToken = await getAccessToken();

    if (accessToken) {
      info = { ...info, access_token: accessToken };
    }
    try {
      const authorizeInfo = await authorize({
        scopes: ["scope.userInfo", "scope.userPhonenumber"],
      });

      if (authorizeInfo["scope.userInfo"]) {
        try {
          const userInfo = await getUserInfo();
          if (userInfo) {
            info = {
              ...info,
              followed_oa: userInfo.userInfo.followedOA,
              avatar: userInfo.userInfo.avatar,
              name: userInfo.userInfo.name,
              is_sensitive: userInfo.userInfo.isSensitive ?? false,
            };
          }
        } catch (error) {
          setIsLoading(false);
        }
      }
      if (authorizeInfo["scope.userPhonenumber"]) {
        try {
          await getPhoneNumber().then((value) => {
            if (value?.token) {
              info = { ...info, code_get_phone: value.token };
            }
          });
        } catch (error) {
          setIsLoading(false);
        }
      }

      await updateZaloInfo(token, info);
      onValidateForm("submit");
    } catch (error) {
      setIsLoading(false);
      //  await closeApp({});
    }
  };
  const onHandleWebview = async () => {
    try {
      try {
        await openWebview({
          url: "https://www.invisalign.com.vn/privacy-policy",
          config: {
            style: "bottomSheet",
            leftButton: "back",
          },
        });
      } catch (error) {
        // xử lý khi gọi api thất bại
      }
    } catch (error) {}
  };
  return (
    <Page className="question-page">
      {/* <div className="text-2xl bg-[#595a9a] text-white py-4 px-5">
        Sự kiện khảo sát
      </div> */}
      <div className="overflow-y-auto h-fit p-5">
        {QUESTIONS.map((question, questionIndex) => (
          <AppInput
            key={questionIndex}
            index={questionIndex + 1}
            placeholder={question.placeholder}
            title={question.questionName}
            type={question.type}
            required={question.required}
            answers={question.answers}
            isBold={question.isBold}
            link={question.link}
            errorTxt={question?.errorTxt}
            pattern={question.pattern}
            onChangeText={onChangeText}
            isText={question.isText}
            setOtherValue={setOtherValue}
          />
        ))}
        <Button
          className="!bg-white !text-blue-400 !rounded-xl w-full !h-14 !text-base"
          onClick={() => setOpenRuleModal(true)}
          loading={isLoading}
        >
          Nộp kết quả
        </Button>
      </div>
      <Modal
        visible={openRuleModal}
        onClose={() => {
          setOpenRuleModal(false);
        }}
        modalStyle={{
          backgroundColor: "white",
        }}
      >
        <div className="bg-white py-1 rounded-lg max-w-xl mx-auto">
          {/* <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Khảo sát Align
          </h3>
          <p className="mb-4">
            Nhận thông tin, quà tặng và thông báo về sản phẩm của{" "}
            <strong>Align</strong> (Invisalign, iTero, Vivera, Exocad)
          </p> */}

          <span>
            Bác sĩ đồng ý với việc thu thập thông tin và xử lý dữ liệu cá nhân
            bởi <strong>Align Technology Inc</strong>. cũng như tất cả công ty
            liên kết và công ty con ("<strong>Align</strong>") cho mục đích nhận
            thông tin và thông báo về sản phẩm của <strong>Align</strong>{" "}
            (Invisalign, iTero, Vivera, Exocad). Bác sĩ theo đây cũng đồng ý
            rằng Bác sĩ sẽ được <strong>Align</strong> hoặc một đại diện được{" "}
            <strong>Align</strong> ủy quyền liên hệ thông qua email, điện thoại
            hoặc các hình thức liên lạc khác cho mục đích này. Dữ liệu cá nhân
            của bác sĩ sẽ được xử lý theo Chính sách bảo mật của{" "}
            <strong>Align</strong> tại{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={onHandleWebview}
            >
              https://www.invisalign.com.vn/privacy-policy.
            </span>
          </span>
          <div className="flex justify-between gap-2 my-4">
            <Button
              className="!text-black !bg-gray-200 !rounded-xl w-full !h-14 !text-base"
              onClick={onCancel}
            >
              Từ chối
            </Button>
            <Button
              className="!text-white !bg-blue-400 !rounded-xl w-full !h-14 !text-base"
              onClick={onSubmit}
            >
              Đồng ý
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        visible={openSubmitSuccess}
        onClose={() => {}}
        modalStyle={{
          backgroundColor: "white",
        }}
      >
        <div className="bg-white py-1 rounded-lg flex flex-col justify-center items-center">
          {/* <img src={Gift} className=" h-44 " /> */}
          <div className="mb-4">
            <p className="text-2xl text-[#4caf50] text-center">
              🎉 Chúc mừng!🎉
            </p>
            <p className="text-xl text-[#4caf50] text-center">
              Bác sĩ đã hoàn thành khảo sát!
            </p>
          </div>
          <p className="text-lg ">
            Cảm ơn bác sĩ đã dành thời gian quý báu để chia sẻ thông tin của
            mình. Phản hồi của bác sĩ rất có giá trị và sẽ giúp chúng tôi cải
            thiện sản phẩm/dịch vụ tốt hơn trong tương lai.
          </p>
          <span className="font-bold text-sm mb-6">
            <span className="text-red-600">* </span>Vui lòng giữ màn hình này và
            gửi cho nhân viên hỗ trợ để nhận quà.
          </span>
          <Button
            className="!text-white !bg-blue-400 !rounded-xl w-full !h-14 !text-base"
            onClick={() => setOpenSubmitSuccess(false)}
          >
            Xác nhận
          </Button>
        </div>
      </Modal>
      <Modal
        visible={openSubmitError}
        onClose={() => {
          setOpenSubmitError(false);
        }}
        modalStyle={{
          backgroundColor: "white",
        }}
      >
        <div className="bg-white py-1 rounded-lg flex flex-col justify-center items-start">
          <h2 className="text-lg mb-4 text-black font-bold">
            Lỗi: Đã Nộp Quá Số Lần Cho Phép
          </h2>
          <p className="text-base ">
            Chúng tôi xin thông báo rằng bác sĩ đã nộp khảo sát này quá một lần.
            Mỗi người chỉ được phép nộp khảo sát một lần duy nhất.
          </p>
          <p className="text-base ">Cảm ơn bác sĩ đã hiểu và hợp tác! </p>
        </div>
      </Modal>
      <Modal
        visible={openSubmitPhoneError}
        onClose={() => {
          setOpenSubmitPhoneError(false);
        }}
        modalStyle={{
          backgroundColor: "white",
        }}
      >
        <div className="bg-white py-1 rounded-lg flex flex-col justify-center items-start">
          <h2 className="text-lg mb-4 text-black font-bold">
            Lỗi: Số điện thoại không hợp lệ
          </h2>
          <p className="text-base ">
            Chúng tôi xin thông báo rằng số điện bác sĩ cung cấp không hợp lệ.
            Vui lòng liên hệ Align để được hỗ trợ.
          </p>
          <p className="text-base ">Cảm ơn bác sĩ đã hiểu và hợp tác! </p>
        </div>
      </Modal>
      <Modal
        visible={openFormError}
        onClose={() => {
          setOpenFormError(false);
        }}
        modalStyle={{
          backgroundColor: "white",
        }}
      >
        <div className="bg-white py-1 rounded-lg flex flex-col justify-center items-start">
          <h2 className="text-lg mb-4 text-black font-bold">
            Lỗi: Thiếu Thông Tin
          </h2>
          <p className="text-base ">
            Chúng tôi nhận thấy rằng một số thông tin cần thiết chưa được điền
            đầy đủ trong khảo sát. Vui lòng kiểm tra lại và hoàn tất các mục bắt
            buộc trước khi gửi.
          </p>
          <p className="text-base ">Cảm ơn bác sĩ đã hiểu và hợp tác! </p>
        </div>
      </Modal>
      <Modal
        visible={openSystemError}
        onClose={() => {
          setOpenSystemError(false);
        }}
        modalStyle={{
          backgroundColor: "white",
        }}
      >
        <div className="bg-white py-1 rounded-lg flex flex-col justify-center items-start">
          <h2 className="text-lg mb-4 text-black font-bold">Lỗi Hệ Thống</h2>
          <p className="text-base ">
            Rất tiếc, chúng tôi gặp sự cố kỹ thuật trong quá trình xử lý yêu cầu
            của bác sĩ. Vui lòng thử lại sau hoặc liên hệ với chúng tôi nếu vấn
            đề vẫn tiếp diễn.
          </p>
          <p className="text-base ">
            Chúng tôi xin lỗi về sự bất tiện này và cảm ơn bác sĩ đã kiên nhẫn.
          </p>
        </div>
      </Modal>
      <Modal
        visible={openCancelGetInfo}
        onClose={() => {
          setOpenCancelGetInfo(false);
        }}
        modalStyle={{
          backgroundColor: "white",
        }}
      >
        <div className="bg-white py-1 rounded-lg flex flex-col justify-center items-start">
          <h2 className="text-lg mb-4 text-black font-bold">Thông báo:</h2>
          <p className="text-base ">
            Cảm ơn bác sĩ đã tham gia chương trình khảo sát của chúng tôi!
          </p>
          <p className="text-base ">Cảm ơn sự hợp tác của bác sĩ!</p>
        </div>
      </Modal>
      <Modal
        visible={openTokenError}
        onClose={() => {
          setOpenTokenError(false);
        }}
        modalStyle={{
          backgroundColor: "white",
        }}
      >
        <div className="bg-white py-1 rounded-lg flex flex-col justify-center items-start">
          <h2 className="text-lg mb-4 text-black font-bold">
            Phiên Hoạt Động Hết Hạn
          </h2>
          <p className="text-base ">
            Phiên hoạt động của bác sĩ đã hết hạn. Để đảm bảo rằng tất cả thông
            tin của bác sĩ được lưu trữ đúng cách, vui lòng nộp kết quả thêm một
            lần nữa.
          </p>
          <p className="text-base ">Cảm ơn sự hợp tác của bác sĩ!</p>
        </div>
      </Modal>
      <Modal
        visible={openGroupLink}
        onClose={() => {
          setOpenGroupLink(false);
        }}
        modalStyle={{
          backgroundColor: "white",
        }}
      >
        <div className="bg-white py-1 rounded-lg flex flex-col justify-center items-start">
          <h2 className="text-lg mb-4 text-black font-bold">Tham Gia Nhóm</h2>
          <p className="text-base ">
            Nếu Bác sĩ chưa là Invisalign Provider, vui lòng tham gia nhóm Zalo{" "}
            <a className="text-blue-600 font-bold">"Invisalign Non-Provider"</a>{" "}
            để cập nhật thêm thông tin.
          </p>

          <div className="mt-6 flex items-center justify-end w-full gap-3">
            <button
              onClick={() => setOpenGroupLink(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                setOpenGroupLink(false);
                openWebview({
                  url: "https://zalo.me/g/bombjm652",
                });
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400"
            >
              Tham Gia
            </button>
          </div>
        </div>
      </Modal>
    </Page>
  );
};

export default QuestionPage;
