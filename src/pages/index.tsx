import checkDeviceId from "apis/checkDeviceId";
import getToken from "apis/getToken";
import updateZaloInfo from "apis/updateZaloInfo";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { deviceState, tokenState } from "state";
import { TZaloRecord } from "types";
import { FETCHApi } from "utils";
import {
  authorize,
  closeApp,
  getAccessToken,
  getDeviceId,
  getDeviceIdAsync,
  getLocation,
  getPhoneNumber,
  getUserInfo,
  openWebview,
} from "zmp-sdk";
import { List, Page, Icon, useNavigate, Button, Modal } from "zmp-ui";

const HomePage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [tokenValue, setTokenValue] = useRecoilState(tokenState);
  const [deviceId, setDeviceId] = useRecoilState(deviceState);
  const [isLoading, setIsLoading] = useState(false);
  const [openIsExistDeviceId, setIsExistDeviceId] = useState(false);
  const onNavQuestionScreen = () => {
    //await updateZaloInfo(tokenValue, info);
    navigate("/question");
  };

  const onCheckDeviceId = async () => {
    const res = await checkDeviceId(tokenValue, deviceId);
    if (res.status === -2) {
      setIsExistDeviceId(true);
    } else {
      setIsExistDeviceId(false);
      onNavQuestionScreen();
    }
  };
  const JWT_Token = useCallback(async () => {
    const res = await getToken();
    if (res) {
      setTokenValue(res.token);
    }
  }, []);

  const getDeviceId = async () => {
    await getDeviceIdAsync().then((value) => {
      if (value) {
        setDeviceId(value);
      }
    });
  };

  useEffect(() => {
    JWT_Token();
    getDeviceId();
  }, []);
  return (
    <Page className="home-page">
      <div className="flex flex-col justify-center items-start h-full">
        <h3 className="text-white text-5xl font-bold">Event Survey</h3>
        <div className="h-6" />
        <div className="h-6" />
        <p className="text-white text-sm">
          Cảm ơn quý BS đã tham dự sự kiện hôm nay. Hi vọng bác sĩ đã có những
          trải nghiệm và thông tin hữu ích để phục vụ cho chuyên môn và thực
          hành. Chúng tôi mong muốn lắng nghe phản hồi của bác sĩ để có thể hỗ
          trợ tốt hơn. Xin vui lòng hoàn thành phiếu khảo sát sau đây.
        </p>
        <div className="h-6" />
      </div>
      <Button
        className="!bg-white !text-blue-400 !rounded-xl w-full !h-14 !text-base"
        onClick={onCheckDeviceId}
        loading={isLoading}
      >
        Tham gia ngay
      </Button>

      <Modal
        visible={openIsExistDeviceId}
        onClose={() => {
          setIsExistDeviceId(false);
        }}
        modalStyle={{
          backgroundColor: "white",
        }}
      >
        <div className="bg-white py-1 rounded-lg flex flex-col justify-center items-start">
          <h2 className="text-lg mb-4 text-black font-bold">Thông báo:</h2>
          <p className="text-base ">
            Bạn đã hoàn thành bài khảo sát này. Vui lòng quay lại khi có bài
            khảo sát mới.
          </p>
          <p className="text-base ">Cảm ơn sự hợp tác của bạn!</p>
        </div>
      </Modal>
    </Page>
  );
};

export default HomePage;
