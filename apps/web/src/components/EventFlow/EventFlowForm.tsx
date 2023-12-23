"use client";
import {
  hideLoadContractFormState,
  selectedContractEventState,
  contractLoadedState,
  zapEventFlowsReloader,
} from "@zap/recoil";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import LoadingBtn from "@/components/Common/LoadingBtn";
import { useRouter } from "next/navigation";

const EventFlowForm = () => {
  const router = useRouter();
  //const [useZapApps, setUserZapApps] = useState<UserZapApp[] | []>([]);
  const reloadEventFlows = useSetRecoilState(zapEventFlowsReloader);
  const selectedContractEvent = useRecoilValue(selectedContractEventState);
  const setHideContractForm = useSetRecoilState(hideLoadContractFormState);
  const setContractLoaded = useSetRecoilState(contractLoadedState);
  const [flowName, setFlowName] = useState<string>("");
  const [flowDesc, setFlowDesc] = useState<string>("");
  //const [eventAppId, setEventAppId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const result = await axios.get(`/api/user-zap-apps`);
  //       const appsData: UserZapApp[] | [] = result?.data?.apps ?? [];
  //       setUserZapApps(appsData);
  //     } catch (error) {}
  //   })();
  // }, []);

  const createEventHandler = async () => {
    if (
      !flowName?.length ||
      !flowDesc?.length ||
      !selectedContractEvent?.contractId ||
      !selectedContractEvent?.event
    ) {
      toast.error("Please fill all fields");
      return;
    }
    let errMsg = "Something went wrong";
    setIsLoading(true);
    try {
      const result = await axios.post(`/api/event`, {
        flowName,
        flowDesc,
        contractId: selectedContractEvent?.contractId,
        contractEvent: selectedContractEvent?.event,
      });
      const res = result?.data;
      if (res?.status === "success") {
        setIsLoading(false);
        setFlowName("");
        setFlowDesc("");
        setHideContractForm(false);
        reloadEventFlows((prevReload) => {
          return {
            ...prevReload,
            reload: prevReload.reload + 1,
            reloadNow: true,
          };
        });
        toast.success("Event created successfully");
        router.push("/flows");
        return;
      }
    } catch (error: any) {
      if(error?.response?.data?.message){
        errMsg = error.response?.data?.message;
      }
      console.log(error?.message);
    }
    setIsLoading(false);
    toast.error(errMsg);
  };

  // const chooseAppHandler = async (app: UserZapApp) => {
  //   setEventAppId(app?.id ?? null);
  // };

  const loadNewContractHandler = () => {
    setHideContractForm(false);
    setContractLoaded(false);
  };

  return (
    <div className={`container mx-auto w-full items-center justify-center`}>
      <div className="loadNewContract float-right">
        <button
          type="button"
          className="bg-gold text-zinc active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          onClick={loadNewContractHandler}
        >
          LOAD NEW CONTRACT
        </button>
      </div>
      <div className="selected-event mb-2">
        <span className="text-xs">selected event</span>
        <h1 className="text-2xl">📣 {selectedContractEvent?.event?.name}</h1>
        <span>
          {selectedContractEvent?.event?.inputs
            .reduce((acc, input) => `${acc}${input.name}(${input.type})\n`, "")
            ?.trim()}
        </span>
      </div>
      <div className="mb-2">
        <label
          htmlFor={"flowName"}
          className="font-display text-jacarta-700 mb-1 block text-sm"
        >
          Flow Name
        </label>
        <input
          id="flowName"
          className={`hover:ring-accent/10 border w-full rounded-lg py-3 hover:ring-2 px-3`}
          autoComplete="off"
          placeholder="Flow Name"
          value={flowName}
          onChange={(e) => {
            setFlowName(e.target.value);
          }}
        />
      </div>
      <div className="mb-3">
        <label
          htmlFor={"flowDescription"}
          className="font-display mb-1 block text-sm"
        >
          Flow Description
        </label>
        <textarea
          id="flowDescription"
          rows={4}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border"
          placeholder="Short flow description..."
          value={flowDesc}
          onChange={(e) => {
            setFlowDesc(e.target.value);
          }}
        ></textarea>
      </div>
      {/* <div className="user-apps mb-3">
        <h4>CHOOSE APP</h4>
        <div className="">
          <div className="flex items-center grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
            {useZapApps?.map((app: UserZapApp, idx) => (
              <div
                key={`z-${app.id}-${app.app_key}`}
                className="bg-zinc text-white text-lg font-bold p-4  rounded-lg"
              >
                <div className="info flex justify-evenly">
                  <div>
                    {app.app_key?.toLowerCase() === "slack" && <FaSlack />}
                    {app.app_key?.toLowerCase() === "webhook" && <TbWebhook />}
                    <span>{app.app_name?.toUpperCase()}</span>
                  </div>
                  <div className="mt-2">
                    {(eventAppId !== null && eventAppId === app.id )? (
                      <span className="text-2xl text-green">
                        <FaCheckCircle />
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="bg-gold hover:bg-orange text-zinc text-sm rounded-md py-2 px-3 text-center font-semibold cursor-pointer transition-all"
                        onClick={() => {
                          chooseAppHandler(app);
                        }}
                      >
                        CHOOSE
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
      <div>
        {isLoading ? (
          <LoadingBtn />
        ) : (
          <button
            type="button"
            className="bg-gold hover:bg-orange text-zinc rounded-md py-3 px-8 text-center font-semibold transition-all w-full"
            onClick={createEventHandler}
          >
            CREATE EVENT FLOW
          </button>
        )}
      </div>
    </div>
  );
};

export default EventFlowForm;
