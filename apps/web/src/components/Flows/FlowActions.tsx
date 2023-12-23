"use client";
import useZapContractAPI from "@/hooks/useZapContractAPI";
import { useMutation } from "@tanstack/react-query";
import {
  selectedZapEventFlowState,
  zapDashboardEventsState,
} from "@zap/recoil";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import { useRecoilState, useRecoilValue } from "recoil";

const actionPayloadMap: {
  [key: string]: string;
} = {
  customWebhook: "jsonBody",
  postMessageToChannel: "text",
};

const actionPayloadLblMap: {
  [key: string]: string;
} = {
  customWebhook: "JSON Body",
  postMessageToChannel: "Slack Message",
};

const FlowActions = () => {
  const [deleteActionMode, setDeleteActionMode] = useState("");
  const deleteRef = useRef("");
  const [eventFlow, setEventFlow] = useRecoilState(selectedZapEventFlowState);
  const flowActions = eventFlow?.FlowAction;
  const zapDashboardEvents = useRecoilValue(zapDashboardEventsState);
  const { removeAction } = useZapContractAPI();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      flowId,
      actionId,
    }: {
      flowId: number;
      actionId: number;
    }) => {
      try {
        const result = await removeAction(flowId, actionId);
        if (result?.status === "success") {
          setEventFlow((prev) => {
            if (!prev) return null;
            const actions = prev?.FlowAction?.filter((a) => a.id !== actionId);
            return {
              ...prev,
              FlowAction: actions,
            };
          });
          toast.success(result?.message);
        } else {
          throw new Error("Failed to remove action");
        }
      } catch (error: any) {
        toast.error(error?.message || "Something went wrong!");
      } finally {
        deleteRef.current = "";
      }
    },
  });

  return (
    <>
      {flowActions?.map((flowAction, idx) => {
        const endpointKey = flowAction?.AppEndpoint?.endpoint_key ?? "";
        const actionEvents = zapDashboardEvents.eventFlowActionEvents;
        const isDeleting = deleteRef.current == endpointKey && isPending;
        const deleteMode = deleteActionMode === endpointKey;
        const isEventActive = eventFlow?.Event?.is_active ?? false;
        return (
          <div
            key={`${flowAction.appEndpointId}-${idx}`}
            className="rounded-md items-center p-4  hover:shadow-lg bg-white text-zinc mt-2"
          >
            <div className="flex justify-end">
              {(!isEventActive && !deleteMode) && (
                <button
                  type="button"
                  className={`bg-red text-white active:bg-pink-600 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${
                    isDeleting ? "cursor-progress" : ""
                  }`}
                  onClick={() => {
                    setDeleteActionMode(endpointKey);
                  }}
                >
                  {isDeleting ? "Please Wait" : "REMOVE ACTION"}
                </button>
              )}
              {deleteMode && (
                <div className="flex flex-col">
                  <span className="font-bold italic">
                    Are you sure ? you want to remove{" "}
                    {flowAction.AppEndpoint?.endpoint_name} and all it's actions
                    logs ?
                  </span>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className={`bg-zinc text-white active:bg-pink-600 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${
                        isDeleting ? "cursor-progress" : ""
                      }`}
                      onClick={() => {
                        setDeleteActionMode("");
                      }}
                    >
                      NO
                    </button>
                    <button
                      type="button"
                      className={`bg-red text-white active:bg-pink-600 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${
                        isDeleting ? "cursor-progress" : ""
                      }`}
                      onClick={() => {
                        if (!eventFlow?.id || !flowAction?.id) return;
                        deleteRef.current = endpointKey;
                        mutate({
                          flowId: eventFlow.id,
                          actionId: flowAction.id,
                        });
                      }}
                    >
                      {isDeleting ? "Please Wait" : "Yes"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col action-endpoint-info">
                <span>
                  App:{" "}
                  <span className="font-bold">
                    {flowAction?.AppEndpoint?.App?.app_name}
                  </span>
                </span>
                <span>
                  Action:{" "}
                  <span className="font-bold">
                    {flowAction?.AppEndpoint?.endpoint_name}
                  </span>
                </span>
                <span>
                  Action Description:{" "}
                  <span className="font-bold">
                    {flowAction?.AppEndpoint?.endpoint_description}
                  </span>
                </span>
              </div>
              {actionEvents[endpointKey]?.key === endpointKey && (
                <>
                  {actionEvents[endpointKey]?.started && (
                    <div className="flex flex-col justify-end action-endpoint-loader mt-6">
                      <span className="text-zinc font-extrabold">
                        Executing...
                        <BeatLoader speedMultiplier={0.6} />
                      </span>
                    </div>
                  )}
                  {actionEvents[endpointKey]?.completed && (
                    <div className="action-endpoint-done mt-6">
                      <span className="text-6xl text-green font-extrabold">
                        <FaCheckCircle />
                      </span>
                    </div>
                  )}
                  {actionEvents[endpointKey]?.error && (
                    <div className="action-endpoint-done mt-6">
                      <span className="text-6xl text-red font-extrabold">
                        <FaTimesCircle />
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
            {actionPayloadMap[endpointKey] && (
              <div className="flex flex-col">
                {flowAction.actionPayload?.url && (
                  <span className="font-bold">
                    URL: {flowAction.actionPayload?.url}
                  </span>
                )}
                <span className="font-bold">
                  {actionPayloadLblMap[endpointKey]}:
                </span>
                {endpointKey === "customWebhook" ? (
                  <pre>
                    {JSON.stringify(
                      flowAction.actionPayload?.[actionPayloadMap[endpointKey]],
                      null,
                      4
                    )}
                  </pre>
                ) : (
                  flowAction.actionPayload?.[actionPayloadMap[endpointKey]]
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default FlowActions;
