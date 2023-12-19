"use client";
import { newFlowActionState } from "@zap/recoil";
import React from "react";
import { useRecoilValue } from "recoil";

const NewActions = () => {
  const newFlowActions = useRecoilValue(newFlowActionState);

  if (!newFlowActions?.length) {
    return null;
  }
  return (
    <>
      {newFlowActions?.map((action) => (
        <div
          key={`${action.appEndpoint.app_key}-${action.appEndpoint.endpointId}`}
          className="rounded-md items-center p-4  hover:shadow-lg bg-white text-zinc mb-2"
        >
          <div className="flex justify-between">
            <div className="flex flex-col action-endpoint-info">
              <span>
                App:{" "}
                <span className="font-bold">
                  {action?.appEndpoint?.app_name}
                </span>
              </span>
              <span>
                Action:{" "}
                <span className="font-bold">
                  {action?.appEndpoint?.endpointName}
                </span>
              </span>
              <span>
                Action Description:{" "}
                <span className="font-bold">
                  {action?.appEndpoint?.endpointDescription}
                </span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default NewActions;
