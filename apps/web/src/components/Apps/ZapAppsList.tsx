"use client";
import { zapAppsAtom } from "@zap/recoil";
import React from "react";
import { FaSlack } from "react-icons/fa";
import { TbWebhook } from "react-icons/tb";
import { useRecoilValue } from "recoil";
import DisconnectAppBtn from "@/components/Apps/DisconnectAppBtn";
import ConnectAppBtn from "@/components/Apps/ConnectAppBtn";

const ZapAppsList = () => {
  const allZapApps = useRecoilValue(zapAppsAtom);
  return (
    <ul className="flex flex-col  p-4 rounded-md">
      {allZapApps?.map((app, idx) => (
        <li
          className="border-gray-400 flex flex-row mb-2 bg-grey_dark"
          key={`z-${app.id}-${app.app_key}`}
        >
          <div className="select-none cursor-pointer  rounded-md flex flex-1 items-center p-4  hover:shadow-lg bg-zinc text-white">
            <div className="flex flex-col rounded-md w-10 h-10 bg-gray-300 justify-center items-center mr-4 text-xl">
              {app.app_key?.toLowerCase() === "slack" && <FaSlack />}
              {app.app_key?.toLowerCase() === "webhook" && <TbWebhook />}
            </div>
            <div className="flex-1 pl-1 mr-16">
              <div className="text-xl">{app.app_name}</div>
            </div>
            {app?.UserApp?.length ? (
              <div className="flex-1 pl-1 mr-16">
                <DisconnectAppBtn appInfo={app} />
              </div>
            ) : (
              <div className="flex-1 pl-1 mr-16">
                <ConnectAppBtn appInfo={app}/>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ZapAppsList;
