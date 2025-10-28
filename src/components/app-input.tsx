import { Rating } from "@smastrom/react-rating";
import React, { useState } from "react";
import { openWebview } from "zmp-sdk";
import { Box, Input, Select, Sheet } from "zmp-ui";

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
  { label: "Bắc Ninh", value: "Bắc Ninh" },
  { label: "Cà Mau", value: "Cà Mau" },
  { label: "Cao Bằng", value: "Cao Bằng" },
  { label: "Cần Thơ", value: "Cần Thơ" },
  { label: "Đà Nẵng", value: "Đà Nẵng" },
  { label: "Đắk Lắk", value: "Đắk Lắk" },
  { label: "Điện Biên", value: "Điện Biên" },
  { label: "Đồng Nai", value: "Đồng Nai" },
  { label: "Đồng Tháp", value: "Đồng Tháp" },
  { label: "Gia Lai", value: "Gia Lai" },
  { label: "Hà Nội", value: "Hà Nội" },
  { label: "Hà Tĩnh", value: "Hà Tĩnh" },
  { label: "Hải Phòng", value: "Hải Phòng" },
  { label: "Hồ Chí Minh", value: "Hồ Chí Minh" },
  { label: "Huế", value: "Huế" },
  { label: "Hưng Yên", value: "Hưng Yên" },
  { label: "Khánh Hòa", value: "Khánh Hòa" },
  { label: "Lai Châu", value: "Lai Châu" },
  { label: "Lâm Đồng", value: "Lâm Đồng" },
  { label: "Lạng Sơn", value: "Lạng Sơn" },
  { label: "Lào Cai", value: "Lào Cai" },
  { label: "Nghệ An", value: "Nghệ An" },
  { label: "Ninh Bình", value: "Ninh Bình" },
  { label: "Phú Thọ", value: "Phú Thọ" },
  { label: "Quảng Ngãi", value: "Quảng Ngãi" },
  { label: "Quảng Ninh", value: "Quảng Ninh" },
  { label: "Quảng Trị", value: "Quảng Trị" },
  { label: "Sơn La", value: "Sơn La" },
  { label: "Tây Ninh", value: "Tây Ninh" },
  { label: "Thái Nguyên", value: "Thái Nguyên" },
  { label: "Thanh Hóa", value: "Thanh Hóa" },
  { label: "Tuyên Quang", value: "Tuyên Quang" },
  { label: "Vĩnh Long", value: "Vĩnh Long" },
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
  const [openSheet, setOpenSheet] = useState(false);
  const [itemClick, setItemClick] = useState("");
  const [provinceSearch, setProvinceSearch] = useState("");
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
          type !== "radio" &&
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
          <input
            key={index}
            type={type}
            min={0}
            className="input !text-base"
            placeholder={placeholder}
            onChange={(e) => {}}
            value={itemClick}
            onClick={() => setOpenSheet(true)}
          />
        ) : type === "radio" ? (
          <div className="flex flex-col gap-1">
            {answers?.map((answer, answerIndex) => {
              if (answer === "Other")
                return (
                  <span key={answerIndex} className="flex items-center mr-4">
                    <input
                      type="radio"
                      id={`radio-${answerIndex}`}
                      name={`radio-group-${index}`}
                      className="mr-2"
                      onChange={(e) => {
                        setIsOtherClick(e.currentTarget.checked);
                        setOtherValue?.("");
                        onChangeText(index, type, "Other");
                      }}
                    />
                    <label
                      htmlFor={`radio-${answerIndex}`}
                      className="text-base"
                    >
                      {isOtherClick ? (
                        <input
                          type="text"
                          className="input !text-base"
                          placeholder="Nhập thông tin khác"
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
                <span key={answerIndex} className="flex items-center mr-4">
                  <input
                    type="radio"
                    id={`radio-${answerIndex}`}
                    name={`radio-group-${index}`}
                    className="mr-2"
                    onChange={() => onChangeText(index, type, answer)}
                  />
                  <label htmlFor={`radio-${answerIndex}`} className="text-base">
                    {answer}
                  </label>
                </span>
              );
            })}
          </div>
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
      <Sheet
        visible={openSheet}
        onClose={() => {
          setOpenSheet(false);
          setProvinceSearch("");
        }}
        autoHeight
        mask
        handler
        swipeToClose
      >
        <Box p={4}>
          <Input
            placeholder="Tìm kiếm thông tin"
            defaultValue={provinceSearch}
            onChange={(e) => setProvinceSearch(e.target.value)}
          />
          <Box className="gap-4 flex flex-col overflow-y-auto h-[400px]">
            {PROVINCES.filter((item) =>
              item.label.toLowerCase().includes(provinceSearch.toLowerCase())
            ).map((province) => (
              <Box
                onClick={() => {
                  setItemClick(province.label);
                  setOpenSheet(false);
                  onChangeText(index, type, province.label);
                }}
                py={3}
                className="text-sm"
              >
                {province.label}
              </Box>
            ))}
          </Box>
        </Box>
      </Sheet>
    </div>
  );
};

export default AppInput;
