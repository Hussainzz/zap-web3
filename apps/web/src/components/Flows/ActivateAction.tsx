"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import useZapContractAPI from "@/hooks/useZapContractAPI";
import { selectedZapEventFlowState, zapDashboardEventsState, zapEventFlowsAtom } from "@zap/recoil";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import LoadingBtn from "@/components/Common/LoadingBtn";

const ActivateAction = () => {
  const [eventFlow, setEventFlow] = useRecoilState(selectedZapEventFlowState);
  const setAllZapEventFlows = useSetRecoilState(zapEventFlowsAtom);
  const { registerEvent, removeEvent } = useZapContractAPI();
  const [isLoading, setIsLoading] = useState(false);
  const resetZapDashboardEvents = useResetRecoilState(zapDashboardEventsState);

  const activateActionHandler = async () => {
    if (!eventFlow?.eventId) {
      throw new Error("Please select a flow");
    }
    try {

      setIsLoading(true);
      resetZapDashboardEvents();
      const result = await registerEvent(eventFlow.eventId);
  
      if (result === "success") {
        updateStateData();
        toast.success("Flow activated successfully");
      } else {
        throw new Error("Failed to activate flow");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const deActivateActionHandler = async () => {
    if (!eventFlow?.eventId) {
      throw new Error("Please select a flow");
    }
    try {
      resetZapDashboardEvents();
      setIsLoading(true);
      const result = await removeEvent(eventFlow.eventId);
  
      if (result === "success") {
        updateStateData(0);
        toast.success("Flow deactivated successfully");
      } else {
        throw new Error("Failed to deactivate flow");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStateData = (stat = 1) => {
    if (!eventFlow) return;
    setEventFlow((prevEventFlow) => {
      if (!prevEventFlow) {
        return prevEventFlow;
      }
      return {
        ...prevEventFlow,
        Event: {
          ...prevEventFlow?.Event,
          is_active: stat,
        },
      };
    });

    setAllZapEventFlows((prevZapEventFlows) => {
      if (!prevZapEventFlows) {
        return [];
      }

      const updatedArray = [...prevZapEventFlows];
      const recordIdx = updatedArray.findIndex((e) => e.id === eventFlow.id);

      if (recordIdx !== -1) {
        // Create a new object for the updated element
        updatedArray[recordIdx] = {
          ...updatedArray[recordIdx],
          Event: {
            ...updatedArray[recordIdx].Event,
            is_active: stat,
          },
        };
      }

      return updatedArray;
    });
  };

  if(isLoading){
    return  <LoadingBtn />
  }

  return (
    <>
      {eventFlow?.Event?.is_active ? (
        <button
          type="button"
          className="bg-red text-zinc rounded-md py-3 px-8 text-center font-semibold transition-all w-full"
          onClick={deActivateActionHandler}
        >
          DEACTIVATE
        </button>
      ) : (
        <button
          type="button"
          className="bg-green hover:bg-green text-zinc rounded-md py-3 px-8 text-center font-semibold transition-all w-full"
          onClick={activateActionHandler}
        >
          ACTIVATE
        </button>
      )}
    </>
  );
};

export default ActivateAction;
