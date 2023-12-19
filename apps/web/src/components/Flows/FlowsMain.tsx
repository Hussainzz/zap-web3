"use client";
import React from "react";
import EventFlowsList from "@/components/Flows/EventFlowsList";
import { useRecoilValue } from "recoil";
import { selectedZapEventFlowState } from "@zap/recoil";
import EventFlowBoard from "@/components/Flows/EventFlowBoard";
import LoaderBox from "@/components/Common/LoaderBox";
import TabsComponent from "@/components/Common/TabsComponent";
import ActionLogs from "@/components/Flows/ActionLogs";

const FlowsMain = () => {
  const eventFlow = useRecoilValue(selectedZapEventFlowState);

  const items = [
    {
      title: "FLOW ACTIONS",
      content: (
        <>
          {eventFlow && (
            <>
              <EventFlowBoard eventFlow={eventFlow} />
            </>
          )}
        </>
      ),
    },
    {
      title: "ACTION LOGS",
      content: (
        <>
          {eventFlow && (
            <>
              <ActionLogs/>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full items-center justify-center">
      <div className={`grid grid-cols-3 grid-rows-1 gap-4`}>
        <div className={`${eventFlow ? "col-span-1" : "col-span-3"}`}>
          <React.Suspense fallback={<LoaderBox />}>
            <EventFlowsList />
          </React.Suspense>
        </div>

        {eventFlow && (
          <div className="col-span-2 bg-zinc rounded-md p-4">
            <TabsComponent items={items} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowsMain;
