"use client";
import { zapDashboardEventsState } from "@zap/recoil";
import React from "react";
import { useRecoilValue } from "recoil";

const FlowMsg = () => {
  const zapDashboardEvents = useRecoilValue(zapDashboardEventsState);
  const stat = zapDashboardEvents.eventFlowStatus;
  let bgColor = null;
  if (stat == "completed") {
    bgColor = "bg-green";
  } else if (stat == "error") {
    bgColor = "bg-zinc";
  }
  if (!bgColor) return null;
  const msg =
    stat == "completed"
      ? "Flow Executed Successfully ⚡️"
      : "Flow Execution Failed ❌";
  return (
    <div className={`${bgColor} text-center py-2 rounded-md`}>
      <div
        className="p-2 items-center text-white leading-none border-md flex lg:inline-flex"
        role="alert"
      >
        <span className="font-semibold mr-2 text-left flex-auto">{msg}</span>
      </div>
    </div>
  );
};

export default FlowMsg;
