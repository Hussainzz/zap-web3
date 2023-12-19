"use client";
import useZapContractAPI from "@/hooks/useZapContractAPI";
import { useMutation } from "@tanstack/react-query";
import { ZapApp, zapAppsAtom } from "@zap/recoil";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSetRecoilState } from "recoil";

const DisconnectAppBtn = ({ appInfo }: { appInfo: ZapApp }) => {
  const { disconnectApp } = useZapContractAPI();
  const pressTimeout = useRef<any>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [deleteTriggered, setDeleteTriggered] = useState(false);
  const appId = appInfo.id;
  const setZapAppsAtom = useSetRecoilState(zapAppsAtom);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const result = await disconnectApp(appId);
        if (result?.status === "success") {
          setZapAppsAtom((prevReload) => {
            const currentApps = [...prevReload];
            const appIdx  = currentApps.findIndex((app) => app.id === appId);
            if(appIdx !== -1){
              currentApps[appIdx] = {
                ...currentApps[appIdx],
                UserApp: []
              };
            }
            return currentApps;
          });
          toast.success(result?.message);
        } else {
          throw new Error(result?.message || "Failed To Disconnect");
        }
      } catch (error: any) {
        toast.error(error?.message || "Something went wrong!");
      } finally {
        setIsPressed(false);
      }
    },
  });

  const startPress = () => {
    setIsPressed(true);
    pressTimeout.current = setTimeout(() => {
      setDeleteTriggered(true);
      if (!appInfo?.id) return;
      mutate();
    }, 1000);
  };

  const endPress = () => {
    setIsPressed(false);
    clearTimeout(pressTimeout.current);
  };

  const isPressedClass = `${
    isPressed
      ? `group-hover:h-64 group-hover:-translate-y-32 ease delay-1500`
      : ""
  }`;

  if (deleteTriggered && isPending) {
    return (
      <button
        className="inline-flex items-center justify-center  rounded-md px-3.5 py-2 m-1 overflow-hidden relative group cursor-progress font-medium bg-red text-white"
        disabled
      >
        <svg
          className={`animate-spin -ml-1 mr-3 h-5 w-5`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>Please Wait...</span>
      </button>
    );
  }

  return (
    <button
      className="rounded-md px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-red text-zinc"
      onMouseDown={startPress}
      onMouseUp={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
    >
      <span
        className={`absolute w-64 h-0 transition-all duration-1000 origin-center rotate-45 -translate-x-20 bg-red top-1/2 ${isPressedClass}`}
      ></span>
      <span
        className={`relative text-red transition duration-1000 ${
          isPressed ? "group-hover:text-white ease" : ""
        } `}
      >
        Hold To Disconnect
      </span>
    </button>
  );
};

export default DisconnectAppBtn;
