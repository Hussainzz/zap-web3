"use client";
import useZapSocket from "@/hooks/useZapSocket";
import {
  UserZapFlowEvent,
  selectedZapEventFlowState,
  zapEventFlowsAtom,
} from "@zap/recoil";
import Link from "next/link";
import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import RemoveEventFlowBtn from "@/components/Flows/RemoveEventFlowBtn";
const EventFlowsList = () => {
  const allZapEventFlows = useRecoilValue(zapEventFlowsAtom);
  const setSelectedZapEventFlow = useSetRecoilState(selectedZapEventFlowState);
  const { connectToZapSocket } = useZapSocket();

  const viewEventFlowHandler = async (eventFlow: UserZapFlowEvent) => {
    if (!eventFlow) return;
    let selectEventFlow = { ...eventFlow };
    setSelectedZapEventFlow(selectEventFlow);
    connectToZapSocket();
  };

  if (!allZapEventFlows?.length) {
    return (
      <div className="h-screen flex items-center flex-col justify-center">
        <span className="text-5xl">No Flows Found</span>
        <Link
          className="underline decoration-gold hover:text-gold text-xl"
          href="/events"
        >
          Create Event Here
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className="flex flex-col p-4 pt-0 rounded-md">
        {allZapEventFlows?.map((eventFlow, idx) => (
          <li
            className="border-gray-400 flex flex-row mb-2 bg-grey_dark"
            key={`zef-${idx}`}
          >
            <div className="select-none cursor-pointer  rounded-md flex flex-1 items-center p-4  hover:shadow-lg bg-zinc text-white">
              <div className="flex flex-col rounded-md w-10 h-10 bg-gray-300 justify-center items-center mr-4 text-xl">
                🌊
              </div>
              <div className="flex-1 pl-1 mr-16">
                <div className="text-md">
                  <span className="text-sm">Event Name:</span>{" "}
                  {eventFlow?.Event?.event_name?.toUpperCase()}
                </div>
                <div className="text-md">
                  <span className="text-sm">Flow Name:</span>{" "}
                  {eventFlow?.flow_name?.toUpperCase()}
                </div>
                <div className="text-sm">
                  <span className="text-sm">ACTIVE:</span>{" "}
                  {eventFlow?.Event?.is_active ? "🟢" : "🔴"}
                </div>
              </div>

              <div className="flex justify-between gap-2 ">
                <button
                  type="button"
                  className="rounded-md px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-gold text-zinc"
                  onClick={() => {
                    viewEventFlowHandler(eventFlow);
                  }}
                >
                  <span
                    className={`absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-gold top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease`}
                  ></span>
                  <span
                    className={`relative text-gold transition duration-300 group-hover:text-zinc ease `}
                  >
                    {eventFlow?.FlowAction?.length ? "View" : "CREATE ACTION"}
                  </span>
                </button>
                <RemoveEventFlowBtn eventFlow={eventFlow} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default EventFlowsList;
