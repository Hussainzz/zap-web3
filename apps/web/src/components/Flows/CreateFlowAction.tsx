"use client";
import {
  newFlowActionState,
  selectedZapEventFlowState,
  zapEventFlowsAtom,
  zapEventFlowsReloader,
} from "@zap/recoil";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import LoadingBtn from "@/components/Common/LoadingBtn";

interface ActionCreationPayload {
  flowId: number;
  appEndpointId: number;
  actionPayload: any;
}
const CreateFlowAction = () => {
  const [savingChanges, setSavingChanges] = useState(false);
  const userEventFlows = useRecoilValue(zapEventFlowsAtom);
  const [newActionFlows, setNewActionFlows] =
    useRecoilState(newFlowActionState);
  const [eventFlow, setEventFlow] = useRecoilState(selectedZapEventFlowState);
  const reloadEventFlows = useSetRecoilState(zapEventFlowsReloader);

  const createFlowActionHandler = async () => {
    let actionCreationPayload: ActionCreationPayload[] = [];
    if (newActionFlows.length && eventFlow?.id) {
      newActionFlows.forEach((action) => {
        if (action.appEndpoint.endpointId) {
          actionCreationPayload.push({
            flowId: eventFlow?.id,
            appEndpointId: parseInt(action.appEndpoint.endpointId),
            actionPayload: action.actionPayload,
          });
        }
      });
    }
    if (!actionCreationPayload.length) return;
    setSavingChanges(true);
    try {
      const result = await axios.post("/api/flow-action", {
        flowActions: actionCreationPayload,
      });
      if (result?.data && result?.data?.status === "success") {
        const resultE = await axios.get(
          `/api/zap-events?flowId=${eventFlow?.id}`
        );
        const updatedEventFlow = resultE?.data?.userEventFlows?.[0] ?? null;
        if (updatedEventFlow) {
          setEventFlow(updatedEventFlow);
          const currentData = userEventFlows;
          const updatedData = [...currentData];
          const actionIdx = updatedData?.findIndex(
            (e) => e.id === eventFlow?.id
          );
          if (actionIdx !== -1) {
            updatedData[actionIdx] = {
              ...updatedEventFlow,
            };
          }
          reloadEventFlows((prevReload) => {
            return {
              ...prevReload,
              reload: prevReload.reload + 1,
              flowData: updatedData,
            };
          });
          setNewActionFlows([]);
          toast.success(result?.data?.message);
          setSavingChanges(false);
          return;
        }
      }
    } catch (error: any) {
      console.log(error?.message);
    }
    setSavingChanges(false);
  };

  return (
    <>
      {!!newActionFlows.length && (
        <div className="action-controls rounded-md flex justify-evenly gap-x-2 p-3  hover:shadow-lg bg-white text-zinc mt-2">
          <button
            type="button"
            className="bg-red hover:bg-red text-white rounded-md py-3 px-8 text-center font-semibold transition-all w-full"
            onClick={() => {
              setNewActionFlows([]);
            }}
          >
            Cancel
          </button>

          {savingChanges ? (
            <LoadingBtn />
          ) : (
            <button
              type="button"
              className="bg-green hover:bg-green text-white rounded-md py-3 px-8 text-center font-semibold transition-all w-full"
              onClick={createFlowActionHandler}
            >
              SAVE FLOW CHANGES
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default CreateFlowAction;

/* 
// update flowActionLogs to have attempts and status
// handle updatation of flowActionLog's same record by action id to update max attempts and also work on loggin failed action 
*/
