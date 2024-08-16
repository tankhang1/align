import { Rating } from "@smastrom/react-rating";
import React, { useState } from "react";
import { openWebview } from "zmp-sdk";

type TAppInput = {
  index: number;
  title: string;
  placeholder?: string;
  type: React.HTMLInputTypeAttribute | "group" | "rating";
  required?: boolean;
  answers?: string[];
  isBold?: boolean;
  link?: string;
  isText?: boolean;
  onChangeText: (
    questionIndex: number,
    type: React.HTMLInputTypeAttribute | "group" | "rating",
    value: string,
    isOther?: boolean
  ) => void;
};

const AppInput = ({
  index,
  title,
  placeholder,
  type,
  required,
  answers,
  isBold = true,
  link,
  onChangeText,
  isText = true,
}: TAppInput) => {
  const [rating, setRating] = useState(0);
  const [isOtherClick, setIsOtherClick] = useState(false);
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
        {index}. {title}{" "}
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
                          onChange={(e) =>
                            onChangeText(index, type, e.target.value, true)
                          }
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
                    disabled={isOtherClick}
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
              onChange={(value: number) => {
                setRating(value);
                onChangeText(index, type, value.toString());
              }}
            />
          </div>
        ) : isText ? (
          <input
            key={index}
            type={type}
            min={0}
            className="input !text-base"
            placeholder={placeholder}
            onChange={(e) => onChangeText(index, type, e.target.value)}
          />
        ) : null}
      </div>
    </div>
  );
};

export default AppInput;