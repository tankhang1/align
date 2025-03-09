import { Rating } from "@smastrom/react-rating";
import React, { useState } from "react";
import { openWebview } from "zmp-sdk";
import { Input, Select } from "zmp-ui";

type TAppInput = {
  index: number;
  title: string;
  placeholder?: string;
  type: React.HTMLInputTypeAttribute | "group" | "rating" | "select";
  required?: boolean;
  answers?: string[];
  isBold?: boolean;
  link?: string;
  isText?: boolean;
  pattern?: RegExp;
  errorTxt?: string;
  onChangeText: (
    questionIndex: number,
    type: React.HTMLInputTypeAttribute | "group" | "rating" | "select",
    value: string,
    isOther?: boolean
  ) => void;
  setOtherValue?: (value: string) => void;
};
const { Option } = Select;

const PROVINCES = [
  { label: "An Giang", value: "An Giang" },
  { label: "Bà Rịa - Vũng Tàu", value: "Bà Rịa - Vũng Tàu" },
  { label: "Bắc Giang", value: "Bắc Giang" },
  { label: "Bắc Kạn", value: "Bắc Kạn" },
  { label: "Bắc Ninh", value: "Bắc Ninh" },
  { label: "Bến Tre", value: "Bến Tre" },
  { label: "Bình Định", value: "Bình Định" },
  { label: "Bình Dương", value: "Bình Dương" },
  { label: "Bình Phước", value: "Bình Phước" },
  { label: "Bình Thuận", value: "Bình Thuận" },
  { label: "Cà Mau", value: "Cà Mau" },
  { label: "Cần Thơ", value: "Cần Thơ" },
  { label: "Cao Bằng", value: "Cao Bằng" },
  { label: "Đà Nẵng", value: "Đà Nẵng" },
  { label: "Đắk Lắk", value: "Đắk Lắk" },
  { label: "Đắk Nông", value: "Đắk Nông" },
  { label: "Điện Biên", value: "Điện Biên" },
  { label: "Đồng Nai", value: "Đồng Nai" },
  { label: "Đồng Tháp", value: "Đồng Tháp" },
  { label: "Gia Lai", value: "Gia Lai" },
  { label: "Hà Giang", value: "Hà Giang" },
  { label: "Hà Nam", value: "Hà Nam" },
  { label: "Hà Nội", value: "Hà Nội" },
  { label: "Hà Tĩnh", value: "Hà Tĩnh" },
  { label: "Hải Dương", value: "Hải Dương" },
  { label: "Hải Phòng", value: "Hải Phòng" },
  { label: "Hậu Giang", value: "Hậu Giang" },
  { label: "Hòa Bình", value: "Hòa Bình" },
  { label: "Hồ Chí Minh", value: "Hồ Chí Minh" },
  { label: "Hưng Yên", value: "Hưng Yên" },
  { label: "Khánh Hòa", value: "Khánh Hòa" },
  { label: "Kiên Giang", value: "Kiên Giang" },
  { label: "Kon Tum", value: "Kon Tum" },
  { label: "Lai Châu", value: "Lai Châu" },
  { label: "Lâm Đồng", value: "Lâm Đồng" },
  { label: "Lạng Sơn", value: "Lạng Sơn" },
  { label: "Lào Cai", value: "Lào Cai" },
  { label: "Long An", value: "Long An" },
  { label: "Nam Định", value: "Nam Định" },
  { label: "Nghệ An", value: "Nghệ An" },
  { label: "Ninh Bình", value: "Ninh Bình" },
  { label: "Ninh Thuận", value: "Ninh Thuận" },
  { label: "Phú Thọ", value: "Phú Thọ" },
  { label: "Phú Yên", value: "Phú Yên" },
  { label: "Quảng Bình", value: "Quảng Bình" },
  { label: "Quảng Nam", value: "Quảng Nam" },
  { label: "Quảng Ngãi", value: "Quảng Ngãi" },
  { label: "Quảng Ninh", value: "Quảng Ninh" },
  { label: "Quảng Trị", value: "Quảng Trị" },
  { label: "Sóc Trăng", value: "Sóc Trăng" },
  { label: "Sơn La", value: "Sơn La" },
  { label: "Tây Ninh", value: "Tây Ninh" },
  { label: "Thái Bình", value: "Thái Bình" },
  { label: "Thái Nguyên", value: "Thái Nguyên" },
  { label: "Thanh Hóa", value: "Thanh Hóa" },
  { label: "Thừa Thiên Huế", value: "Thừa Thiên Huế" },
  { label: "Tiền Giang", value: "Tiền Giang" },
  { label: "Trà Vinh", value: "Trà Vinh" },
  { label: "Tuyên Quang", value: "Tuyên Quang" },
  { label: "Vĩnh Long", value: "Vĩnh Long" },
  { label: "Vĩnh Phúc", value: "Vĩnh Phúc" },
  { label: "Yên Bái", value: "Yên Bái" },
];

const AppInput = ({
  index,
  title,
  placeholder,
  type,
  required,
  answers,
  errorTxt,
  pattern,
  isBold = true,
  link,
  onChangeText,
  isText = true,
  setOtherValue,
}: TAppInput) => {
  const [rating, setRating] = useState(0);
  const [isOtherClick, setIsOtherClick] = useState(false);
  const [isError, setIsError] = useState(false);
  const onHandleWebview = async () => {
    if (link)
      try {
        try {
          await openWebview({
            url: link,
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
    <div className="flex flex-col gap-2 mb-2 w-full flex-wrap bg-white px-4 py-5 rounded-lg border shadow-sm">
      <span className={`text-base ${isBold ? "font-semibold" : "font-normal"}`}>
        {isText && index + ". "}
        {title}{" "}
        {link && (
          <span
            className="text-blue-600 cursor-pointer"
            onClick={onHandleWebview}
          >
            {link}
          </span>
        )}
        {required && <span className="text-lg text-red-700 ml-1">*</span>}
      </span>

      <div
        className={`${
          type !== "group" &&
          type !== "rating" &&
          type !== "select" &&
          isText === true &&
          "border-b-[1px] h-10"
        } flex`}
      >
        {type === "group" ? (
          <div className="flex flex-col gap-3">
            {answers?.map((answer, answerIndex) => {
              if (answer === "Other")
                return (
                  <span key={answerIndex} className="flex items-center mr-4 ">
                    <input
                      type="checkbox"
                      id={`answer-${answerIndex}`}
                      name="custom-radio"
                      className="mr-2"
                      onClick={(e) => {
                        setIsOtherClick(e.currentTarget.checked);
                        setOtherValue?.("");
                      }}
                    />
                    <label
                      htmlFor={`answer-${answerIndex}`}
                      className="text-base"
                    >
                      {isOtherClick ? (
                        <input
                          key={index}
                          type={type}
                          className="input !text-base"
                          placeholder={"Nhập thông tin khác"}
                          onChange={(e) => setOtherValue?.(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        "Thông tin khác"
                      )}
                    </label>
                  </span>
                );
              return (
                <span key={answerIndex} className="flex items-center mr-4 ">
                  <input
                    type="checkbox"
                    id={`answer-${answerIndex}`}
                    name="custom-radio"
                    className="mr-2"
                    onClick={(e) => {
                      onChangeText(index, type, answer);
                    }}
                  />
                  <label
                    htmlFor={`answer-${answerIndex}`}
                    className="text-base"
                  >
                    {answer}
                  </label>
                </span>
              );
            })}
          </div>
        ) : type === "rating" ? (
          <div>
            <Rating
              style={{ maxWidth: 200 }}
              value={rating}
              items={4}
              onChange={(value: number) => {
                setRating(value);
                onChangeText(index, type, value.toString());
              }}
            />
          </div>
        ) : type === "select" ? (
          <Select
            placeholder="VD: Hồ Chí Minh"
            maskCloseable
            closeOnSelect
            onChange={(value) =>
              onChangeText(index, type, value?.toString() || "")
            }
          >
            {PROVINCES.map((province, index) => (
              <Option
                key={index}
                value={province.value}
                title={province.label}
              />
            ))}
          </Select>
        ) : isText ? (
          <input
            key={index}
            type={type}
            min={0}
            className="input !text-base"
            placeholder={placeholder}
            onChange={(e) => {
              const value = e.target.value;
              if (pattern) {
                if (pattern.test(value)) {
                  setIsError(false);
                  onChangeText(index, type, value); // Valid email
                } else {
                  setIsError(true);
                  onChangeText(index, type, value); // Valid email
                }
              } else {
                setIsError(false);
                onChangeText(index, type, value);
              }
            }}
          />
        ) : null}
      </div>
      {isError && <p style={{ color: "red", fontSize: 13 }}>{errorTxt}</p>}
    </div>
  );
};

export default AppInput;
