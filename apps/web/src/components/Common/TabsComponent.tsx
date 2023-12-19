"use client";
import { useState, useEffect, useRef } from "react";

interface TabsComponentProps {
  items: {
    title: string;
    content: any;
  }[];
}

const TabsComponent = ({ items }: TabsComponentProps) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const firstBtnRef = useRef<any>();

  useEffect(() => {
    firstBtnRef.current.focus();
  }, []);

  return (
    <div className="">
      <div className="w-full">
        <div className="bg-blue-400 p-1  rounded-xl flex justify-between items-center gap-x-2 font-bold text-white">
          {items.map((item: any, index: any) => (
            <button
              ref={index === 0 ? firstBtnRef : null}
              key={index}
              onClick={() => setSelectedTab(index)}
              className={`outline-none w-full p-2 hover:bg-gold rounded-lg text-center ease-out duration-300 focus:bg-gold ${
                selectedTab === index ? "bg-gold text-zinc" : ""
              } `}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="p-2 rounded-xl">
          {items.map((item: any, index: any) => (
            <div className={`${selectedTab === index ? "" : "hidden"}`} key={`tab-content-${index}`}>
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabsComponent;
