"use client";
import React, { useEffect } from "react";
import {
  ContractEvent,
  UserZapFlowEvent,
  ZapDashboardEvents,
  addNewActionBoolState,
  selectedZapEventFlowState,
  zapDashboardEventsState,
  zapSocketState,
} from "@zap/recoil";
import UserZapAppsList from "@/components/Flows/UserZapAppsList";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import { BarLoader, BeatLoader } from "react-spinners";
import FlowActions from "@/components/Flows/FlowActions";
import ActivateAction from "@/components/Flows/ActivateAction";
import { Socket } from "socket.io-client";
import { FaAngleDoubleDown } from "react-icons/fa";
import FlowActionAppEndpoints from "@/components/Flows/FlowActions/FlowActionAppEndpoints";
import NewActions from "@/components/Flows/NewActions";
import CreateFlowAction from "@/components/Flows/CreateFlowAction";
import FlowMsg from "@/components/Messages/FlowMsg";

const EventFlowBoard = ({ eventFlow }: { eventFlow: UserZapFlowEvent }) => {
  const [addNewActionBool, setAddNewActionBool] = useRecoilState(
    addNewActionBoolState
  );
  const eventFlowAction = eventFlow?.FlowAction ?? [];
  const eventPayload = eventFlow?.Event?.event_payload as ContractEvent;
  const setSelectedZapEventFlow = useSetRecoilState(selectedZapEventFlowState);
  const [socket, setZapSocket] = useRecoilState(zapSocketState);
  const [zapDashboardEvents, setZapDashboardEvents] = useRecoilState(
    zapDashboardEventsState
  );
  const resetZapDashboardEvents = useResetRecoilState(zapDashboardEventsState);
  const zapSocket = socket as Socket;

  const updateZapDashFlowActionEvents = (
    prevEvents: ZapDashboardEvents,
    key: string,
    started: boolean,
    completed: boolean,
    error: boolean
  ): ZapDashboardEvents => {
    let eventFlowActionEvents = prevEvents?.eventFlowActionEvents;

    if (eventFlowActionEvents[key]) {
      eventFlowActionEvents[key].started = started;
      eventFlowActionEvents[key].completed = completed;
      eventFlowActionEvents[key].error = error;
    } else {
      eventFlowActionEvents = {
        ...eventFlowActionEvents,
        [key]: {
          key,
          started,
          completed,
          error,
        },
      };
    }
    return {
      ...prevEvents,
      eventFlowActionEvents,
    };
  };

  useEffect(() => {
    // //Socket connection to Zap Action Service
    // const socket = io("http://localhost:8005",{
    //   withCredentials: true,
    //   extraHeaders: {
    //     "zap-socket-key": "abcd"
    //   }
    // });
    let actionEventRegister: string[] = [];

    if (zapSocket?.connected && eventFlow && eventFlow.FlowAction.length) {
      const flowTitle = `flow${eventFlow?.id}`;
      const flowStarted = `${flowTitle}-started`;
      const flowCompleted = `${flowTitle}-completed`;
      const flowFailed = `${flowTitle}-failed`;

      actionEventRegister = [flowStarted, flowCompleted];

      zapSocket.on(flowStarted, (data: any) => {
        console.log("Flow Started");
        setZapDashboardEvents({
          ...zapDashboardEvents,
          eventFlowStarted: true,
          eventFlowCompleted: false,
          eventFlowStatus: 'started'
        });
      });

      zapSocket.on(flowCompleted, (data: any) => {
        console.log("Flow Completed");
        setZapDashboardEvents({
          ...zapDashboardEvents,
          eventFlowStarted: false,
          eventFlowCompleted: true,
          eventFlowStatus: 'completed'
        });
      });

      zapSocket.on(flowFailed, (data: any) => {
        console.log("Flow Failed");
        setZapDashboardEvents({
          ...zapDashboardEvents,
          eventFlowStarted: false,
          eventFlowCompleted: false,
          eventFlowStatus: 'error'
        });
      });

      const actionTitle = `${flowTitle}-action`;
      eventFlowAction?.forEach((fa) => {
        const endpointKey = fa?.AppEndpoint?.endpoint_key ?? null;
        if (endpointKey) {
          const started = `${actionTitle}-${endpointKey}-started`;
          const completed = `${actionTitle}-${endpointKey}-completed`;
          const error = `${actionTitle}-${endpointKey}-error`;
          zapSocket.on(started, (data: any) => {
            console.log(`Action ${endpointKey} started`);
            if (data) {
              const name = data?.name ?? "";
              //Started action true
              setZapDashboardEvents((prevEvents) =>
                updateZapDashFlowActionEvents(
                  prevEvents,
                  name,
                  true,
                  false,
                  false
                )
              );
            }
          });

          zapSocket.on(completed, (data: any) => {
            console.log(`Action ${endpointKey} completed`);
            if (data) {
              const name = data?.name ?? "";
              console.log("COMPLETED", zapDashboardEvents);
              //Completed action true
              setZapDashboardEvents((prevEvents) =>
                updateZapDashFlowActionEvents(
                  prevEvents,
                  name,
                  false,
                  true,
                  false
                )
              );
            }
          });

          zapSocket.on(error, (data: any) => {
            console.log(`Action ${endpointKey} error`);
            if (data) {
              const name = data?.name ?? "";
              //Error action true
              setZapDashboardEvents((prevEvents) =>
                updateZapDashFlowActionEvents(
                  prevEvents,
                  name,
                  false,
                  false,
                  true
                )
              );
            }
          });

          actionEventRegister.push(started);
          actionEventRegister.push(completed);
          actionEventRegister.push(error);
        }
      });
    }

    return () => {
      if (zapSocket && eventFlow) {
        //off Events
        if (actionEventRegister?.length) {
          actionEventRegister.forEach((actionTxt) => {
            zapSocket.off(actionTxt);
          });
        }
      }
    };
  }, [zapSocket, zapDashboardEvents]);

  useEffect(() => {
    return () => {
      if (zapSocket) {
        zapSocket?.disconnect();
        setZapSocket(null);
      }
    };
  }, []);

  return (
    <div className="grid grid-rows-1 gap-2">
      <span
        className="flex justify-end text-white hover:text-gold font-extrabold cursor-pointer underline underline-offset-1"
        onClick={() => {
          setSelectedZapEventFlow(null);
          resetZapDashboardEvents();
          if (zapSocket) {
            zapSocket?.disconnect();
            setZapSocket(null);
          }
        }}
      >
        CLOSE
      </span>
      <div className="event-flow-board row-span-1">
       
        <FlowMsg/>
        <div
          id="eventInfo"
          className="select-none rounded-md flex flex-1 items-center p-4  hover:shadow-lg bg-white text-zinc"
        >
          <div className="flex flex-col rounded-md w-10 h-10 bg-gray-300 justify-center items-center mr-4 text-xl">
            📣
          </div>
          <div className="flex-1 pl-1 mr-16">
            <div className="flex justify-between">
              <span className="text-sm text-blue">
                CONTRACT EVENT TO LISTEN...
              </span>
              {!!(eventFlowAction?.length && !eventFlow?.Event?.is_active) && (
                <span>
                  Click activate to start listening to{" "}
                  <span className="font-bold">{eventPayload?.name}</span>{" "}
                  contract event and trigger below actions 🔴
                </span>
              )}

              {!!eventFlow?.Event?.is_active && (
                <div>
                  <span className="font-extrabold">Listening...</span>
                  <span className="opacity-80 text-zinc">
                    <BeatLoader speedMultiplier={0.6} />
                  </span>
                </div>
              )}
            </div>
            <div className="text-md">{eventFlow?.flow_name?.toUpperCase()}</div>
            <div className="text-xl">{eventPayload?.name}</div>
            <div className="text-md italic">
              {eventFlow?.Event?.Contract?.contract_address}
            </div>

            <span className="text-sm text-blue font-bold">Event Arguments</span>
            <div className="text-md mt-2">
              {eventPayload?.inputs?.map((input, idx) => {
                return (
                  <span key={idx} className="bg-zinc text-white text-md font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{`${input.name}(${input.type})`}</span>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex justify-center my-2">
          <span className={`text-6xl text-gold`}>
            <FaAngleDoubleDown />
          </span>
        </div>

        <div className="flow-actions mb-5">
          {!!eventFlowAction?.length && <FlowActions />}
        </div>

        <NewActions />

        {addNewActionBool ? (
          <>
            <div className="flow-select-apps mb-7">
              <React.Suspense
                fallback={
                  <div className=" flex flex-col items-center justify-center user-apps-loading p-20 bg-white rounded-md">
                    <span className="fw-bold mb-2">Please Wait...</span>
                    <BarLoader />
                  </div>
                }
              >
                <UserZapAppsList />
              </React.Suspense>
            </div>

            <div className="flow-select-apps mb-7">
              <FlowActionAppEndpoints />
            </div>
          </>
        ) : (
          <div className="add-new-action flex justify-center mb-3">
            {!eventFlow?.Event?.is_active && (
              <button
                type="button"
                className="bg-gold text-zinc active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={async () => {
                  setAddNewActionBool(true);
                }}
              >
                ADD NEW FLOW ACTION
              </button>
            )}
          </div>
        )}

        <CreateFlowAction />
        {!!eventFlowAction?.length && (
          <div className="action-controls rounded-md flex flex-1 items-center p-3  hover:shadow-lg bg-white text-zinc">
            <ActivateAction />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventFlowBoard;
