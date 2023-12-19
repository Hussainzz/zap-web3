"use client";
import { getUserAppInfoLbl } from "@/utils/helper";
import {
  FlowActionPayload,
  actionEndpointPayloadState,
  addNewActionBoolState,
  newFlowActionAppEndpointState,
  newFlowActionAppState,
  newFlowActionState,
} from "@zap/recoil";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import Select from "react-select";
import PostMessageToChannel from "@/components/Flows/FlowActions/slack/PostMessageToChannel";

const SlackAction = () => {
  const [eventApp, setEventApp] = useRecoilState(newFlowActionAppState);
  const [newFlowActionAppEndpoint, setNewFlowActionAppEndpoint] = useRecoilState(
    newFlowActionAppEndpointState
  );
  
  const [actionEndpointPayload, setActionEndpointPayload] = useRecoilState(actionEndpointPayloadState);
  const setAddNewActionBool = useSetRecoilState(addNewActionBoolState);
  const setNewActionFlow = useSetRecoilState(newFlowActionState);
  const [userAppInfo, setUserAppInfo] = useState<any[]>([]);

  const getEndpointInfo = async () => {
    try {
      const appUserInfoResult = await axios.post("/api/user-app-info", {
        appKey: eventApp?.app_key,
        appEndpointId: newFlowActionAppEndpoint?.endpointId,
      });
      if (appUserInfoResult?.data?.data?.length > 0) {
        const infoOptions = appUserInfoResult?.data?.data?.map((info: any) => {
          return {
            label: info?.name,
            value: info?.id,
            info
          };
        });
        setUserAppInfo(infoOptions);
      }
    } catch (error: any) {}
  };

  useEffect(() => {
    (async () => {
      if (newFlowActionAppEndpoint?.endpointId) {
        await getEndpointInfo();
      }
    })();
  }, [newFlowActionAppEndpoint]);

  const endpointComponentMap: {
    [key: string]: React.ComponentType<any>;
  } = {
    postMessageToChannel: PostMessageToChannel,
  };

  const getEndpointComponent = (key: string) => {
    const Component = endpointComponentMap[key];
    if (!Component) {
      return null;
    }
    return <Component />;
  };

  const addActionHandler = () => {
    if (actionEndpointPayload && newFlowActionAppEndpoint) {
      const actionPayload = {
        ...actionEndpointPayload?.payload
      };
      const flowActionData: FlowActionPayload = {
        actionPayload,
        appEndpoint: newFlowActionAppEndpoint,
      };
      setNewActionFlow((prevActions) => {
        return [...prevActions, flowActionData];
      });
      setNewFlowActionAppEndpoint(null);
      setEventApp(null);
      setAddNewActionBool(false);
    }
    // if (!webhookURL.length || !params.length || !Object.keys(json).length)
    //   return;
    // let queryParams: {
    //   [key: string]: string;
    // } = getQueryParams();
    // const actionPayload = {
    //   url: webhookURL,
    //   queryParams,
    //   jsonBody: json,
    // };
    // if (newFlowActionAppEndpoint?.endpointId) {
    //   const flowActionData: FlowActionPayload = {
    //     actionPayload,
    //     appEndpoint: newFlowActionAppEndpoint,
    //   };
    //   setNewActionFlow((prevActions) => {
    //     return [...prevActions, flowActionData];
    //   });
    //   setNewFlowActionEndpoint(null);
    //   setEventApp(null);
    //   setAddNewActionBool(false);
    // }
  };

  const useAppInfoChangeHandler = (data: {
    label: string;
    value: string;
    info: any
  }) => {
    if(newFlowActionAppEndpoint){
      setNewFlowActionAppEndpoint((prev) => {
        if(!prev) return null;
        return {
          ...prev,
          endpointAppInfo: data?.info ?? null
        }
      })
    } 
  }

  return (
    <div>
      {!!userAppInfo?.length && (
        <>
          <h4 className="text-sm mb-3s">
            {getUserAppInfoLbl(newFlowActionAppEndpoint?.endpointKey ?? "")}
          </h4>
          <Select
            isSearchable={false}
            name="appEndpointInfo"
            options={userAppInfo}
            className="basic-multi-select cursor-pointer"
            classNamePrefix="select"
            onChange={useAppInfoChangeHandler}
          />

          {newFlowActionAppEndpoint && (
            <>
              {getEndpointComponent(
                newFlowActionAppEndpoint?.endpointKey ?? ""
              )}
            </>
          )}
        </>
      )}

      <div className="mt-2">
        <button
          type="button"
          className="bg-gold hover:bg-orange text-zinc rounded-md py-3 px-8 text-center font-semibold transition-all w-full"
          onClick={addActionHandler}
        >
          ADD SLACK ACTION
        </button>
      </div>
    </div>
  );
};

export default SlackAction;
