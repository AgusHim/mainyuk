import Link from "next/link";
import Image from "next/image";
import { Chat } from "@/types/chat";
import { useState } from "react";

const chatData: Chat[] = [
  {
    avatar: "/images/user/user-01.png",
    name: "Devid Heilo",
    text: "Note: In order to render QR Codes in <canvas> on high density displays, we scale the canvas element to contain an appropriate number of pixels and then use inline styles to scale back down. We will merge any additional styles, with custom height and width overriding our own values. This allows scaling to percentages but if scaling beyond the size, you will encounter blurry images. I recommend detecting resizes with something like react-measure to detect and pass the appropriate size when rendering to <canvas>.",
    time: 12,
    textCount: 3,
    dot: 3,
  },
  {
    avatar: "/images/user/user-02.png",
    name: "Henry Fisher",
    text: "Waiting for you!",
    time: 12,
    textCount: 0,
    dot: 1,
  },
  {
    avatar: "/images/user/user-04.png",
    name: "Jhon Doe",
    text: "What's up?",
    time: 32,
    textCount: 0,
    dot: 3,
  },
  {
    avatar: "/images/user/user-05.png",
    name: "Jane Doe",
    text: "Great",
    time: 32,
    textCount: 2,
    dot: 6,
  },
  {
    avatar: "/images/user/user-01.png",
    name: "Jhon Doe",
    text: "How are you?",
    time: 32,
    textCount: 0,
    dot: 3,
  },
  {
    avatar: "/images/user/user-03.png",
    name: "Jhon Doe",
    text: "How are you?",
    time: 32,
    textCount: 3,
    dot: 6,
  },
  {
    avatar: "/images/user/user-01.png",
    name: "Devid Heilo",
    text: "How are you?",
    time: 12,
    textCount: 3,
    dot: 3,
  },
  {
    avatar: "/images/user/user-02.png",
    name: "Henry Fisher",
    text: "Waiting for you!",
    time: 12,
    textCount: 0,
    dot: 1,
  },
  {
    avatar: "/images/user/user-04.png",
    name: "Jhon Doe",
    text: "What's up?",
    time: 32,
    textCount: 0,
    dot: 3,
  },
  {
    avatar: "/images/user/user-05.png",
    name: "Jane Doe",
    text: "Great",
    time: 32,
    textCount: 2,
    dot: 6,
  },
  {
    avatar: "/images/user/user-01.png",
    name: "Jhon Doe",
    text: "How are you?",
    time: 32,
    textCount: 0,
    dot: 3,
  },
  {
    avatar: "/images/user/user-03.png",
    name: "Jhon Doe",
    text: "How are you?",
    time: 32,
    textCount: 3,
    dot: 6,
  },
];

const LiveQna = () => {
  const [selected, setSelected] = useState<Chat>();

  const handleClick = (value: Chat) => {
    setSelected(value);
  };
  return (
    <div>
      {chatData.map((chat, key) => (
        <div
          onClick={() => handleClick(chat)}
          className={`flex items-center gap-5 py-3 px-3 md:py-3 md:px-7.5 border mb-2 rounded-md ${chat === selected?'border-primary border-4':''}`}
          key={key}
        >
          <div className="flex flex-1 items-center justify-between">
            <div>
              <div className="flex flex-row items-center">
                <div className="flex items-center text-center justify-center w-7 h-7 md:h-14 md:w-14 rounded-full bg-primary">
                  <h1 className="text-white text-lg md:text-xl">
                    {chat.name.charAt(0)}
                  </h1>
                </div>
                <h5 className="mx-3 font-bold text-white dark:text-white text-sm md:text-lg">
                  {chat.name}
                </h5>
              </div>
              <p className="my-3">
                <span
                  className={`text-white dark:text-white text-xl font-normal`}
                >
                  {chat.text}
                </span>
                <span className="text-md ml-5">{chat.time} min</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveQna;
