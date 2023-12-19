"use client";
import {
  UserZapApp,
  UserZapApps,
  addNewActionBoolState,
  newFlowActionAppEndpointState,
  newFlowActionAppState,
  newFlowActionSelector,
  newFlowActionState,
} from "@zap/recoil";
import React, { useState } from "react";
import { FaCheckCircle, FaSlack } from "react-icons/fa";
import { TbWebhook } from "react-icons/tb";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Select from "react-select";
import axios from "axios";
import { getUserAppInfoLbl } from "@/utils/helper";
import CreateFlowAction from "@/components/Flows/CreateFlowAction";

const UserZapAppsList = () => {
  const userZapApps = useRecoilValue(UserZapApps);
  const flowActionApps = useRecoilValue(newFlowActionSelector);
  const setNewFlowActionEndpoint = useSetRecoilState(
    newFlowActionAppEndpointState
  );
  const setAddNewActionBool = useSetRecoilState(
    addNewActionBoolState
  );
  const [newActionFlow, setNewFlowAction] = useRecoilState(newFlowActionState);
  const [eventApp, setEventApp] = useRecoilState(newFlowActionAppState);
  const [eventAppEndpointKey, setEventAppEndpointKey] = useState<string>("");
  const [userAppInfo, setUserAppInfo] = useState<any[]>([]);
  const [tempMsg, setTempMsg] = useState<string>("");
  const [loadingEndpointInfo, setLoadingEndpointInfo] =
    useState<boolean>(false);
  const chooseAppHandler = (app: UserZapApp) => {
    if (!app?.id) return;
    setEventApp(app);
  };

  // const appEndpointOptions = eventApp?.AppEndpoint?.map((endpoint) => {
  //   return {
  //     label: endpoint?.endpoint_name,
  //     endpointDescription: endpoint?.endpoint_description,
  //     endpointKey: endpoint?.endpoint_key,
  //     value: endpoint?.id,
  //   };
  // });

  // const formatOptionLabel = ({ value, label, endpointDescription }: any) => (
  //   <div>
  //     <div className="font-bold">{label}</div>
  //     <div style={{ marginLeft: "10px", color: "#ccc" }}>
  //       {endpointDescription}
  //     </div>
  //   </div>
  // );

  // const appEndpointChangeHandler = async (appEnd: {
  //   label: string;
  //   endpointDescription: string;
  //   endpointKey: string;
  //   value: string;
  // }) => {
  //   if (!appEnd || !eventApp) return;
  //   setLoadingEndpointInfo(true);
  //  const endpointId = appEnd.value;
  //   try {
  //     const appUserInfoResult = await axios.post("/api/user-app-info", {
  //       appKey: eventApp?.app_key,
  //       appEndpointId: endpointId,
  //     });
  //     if (appUserInfoResult?.data?.data?.length > 0) {
  //       const infoOptions = appUserInfoResult?.data?.data?.map((info: any) => {
  //         return {
  //           label: info?.name,
  //           value: info?.id,
  //         };
  //       });
  //       setUserAppInfo(infoOptions);
  //       setEventAppEndpointKey(appEnd?.endpointKey);
  //       setNewFlowAction({
  //           ...newActionFlow,
  //           appEndpoint: parseInt(endpointId)
  //       });
  //     }
  //   } catch (error: any) {}
  //   setLoadingEndpointInfo(false);
  //};

  if (flowActionApps.length === userZapApps.length) return null;

  return (
    <>
      <div className="user-apps p-3 bg-white rounded-md">
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-gold text-zinc active:bg-pink-600 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            onClick={() => {
              setAddNewActionBool(false);
            }}
          >
            CANCEL
          </button>
        </div>
        <h4 className="text-sm font-semibold">
          CHOOSE APP TO CREATE FLOW ACTION ⬇️
        </h4>
        <div className="items-center grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
          {userZapApps?.map((app: UserZapApp, idx) => {
            return (
              <React.Fragment key={idx}>
                <div
                  key={`z-${app.id}-${app.app_key}`}
                  className="bg-zinc text-white text-lg font-bold p-4  rounded-lg"
                >
                  <div className="info flex justify-evenly">
                    <div>
                      {app.app_key?.toLowerCase() === "slack" && <FaSlack />}
                      {app.app_key?.toLowerCase() === "webhook" && (
                        <TbWebhook />
                      )}
                      <span>{app.app_name?.toUpperCase()}</span>
                    </div>
                    <div className="mt-2">
                      {eventApp !== null && eventApp?.id === app.id ? (
                        <span className="text-2xl text-green">
                          <FaCheckCircle />
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="bg-gold hover:bg-orange text-zinc text-sm rounded-md py-2 px-3 text-center font-semibold cursor-pointer transition-all"
                          onClick={() => {
                            setNewFlowActionEndpoint(null);
                            chooseAppHandler(app);
                          }}
                        >
                          CHOOSE
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* {eventApp !== null && (
        <div className="user-app-endpoints p-3 bg-white rounded-md mt-4">
          {eventApp?.AppEndpoint?.length && appEndpointOptions && (
            <>
              <h4 className="text-sm mb-3s">Select App Endpoint</h4>
              <Select
                isSearchable={false}
                //defaultValue={[appEndpointOptions[0]]}
                name="appEndpoints"
                options={appEndpointOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                formatOptionLabel={formatOptionLabel}
                onChange={appEndpointChangeHandler}
                isLoading={loadingEndpointInfo}
              />
            </>
          )}
          {!!userAppInfo?.length && (
            <div className="mt-3">
              <h4 className="text-sm mb-3s">
                {getUserAppInfoLbl(eventAppEndpointKey)}
              </h4>
              <Select
                isSearchable={false}
                name="appEndpointInfo"
                options={userAppInfo}
                className="basic-multi-select cursor-pointer"
                classNamePrefix="select"
                isLoading={loadingEndpointInfo}
                onChange={(val) => {
                    const actionPayload = {
                        channel: val?.value
                    }
                    setNewFlowAction({
                        ...newActionFlow,
                        actionPayload: actionPayload
                    });
                }}
              />
               <textarea
                id="channelMsg"
                rows={4}
                className="border border-zinc block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg mt-3 mb-3"
                placeholder="Msg to post here..."
                value={tempMsg}
                onChange={(e) => {
                    const currentActionPayload = newActionFlow?.actionPayload ?? {};
                    setNewFlowAction({
                        ...newActionFlow,
                        actionPayload: {
                            ...currentActionPayload,
                            text: e.target.value
                        }
                    });
                    setTempMsg(e.target.value);
                }}
                ></textarea>

                <CreateFlowAction />
            </div>
          )}
        </div>
      )} */}
    </>
  );
};

export default UserZapAppsList;
