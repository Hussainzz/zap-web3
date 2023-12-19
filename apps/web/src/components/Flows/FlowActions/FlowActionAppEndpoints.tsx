"use client";
import {
  newFlowActionAppEndpointState,
  newFlowActionAppState,
  selectedFlowEndpointKeysSelector,
} from "@zap/recoil";
import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Select from "react-select";
import SlackAction from "@/components/Flows/FlowActions/slack/SlackAction";
import WebhookAction from "@/components/Flows/FlowActions/webhook/WebhookAction";

const FlowActionAppEndpoints = () => {
  const [eventApp, setEventApp] = useRecoilState(newFlowActionAppState);
  const flowEndpointKeys = useRecoilValue(selectedFlowEndpointKeysSelector);

  const setNewFlowActionEndpoint = useSetRecoilState(
    newFlowActionAppEndpointState
  );

  const appEndpointOptions = eventApp?.AppEndpoint?.map((endpoint) => {
    const isEndpointAdded = flowEndpointKeys.includes(endpoint.endpoint_key);
    return {
      label: `${endpoint?.endpoint_name} ${isEndpointAdded?'(ALREADY ADDED)':''}`,
      endpointDescription: endpoint?.endpoint_description,
      endpointKey: endpoint?.endpoint_key,
      value: endpoint?.id,
      isDisabled: isEndpointAdded
    };
  });

  const formatOptionLabel = ({ value, label, endpointDescription }: any) => (
    <div>
      <div className="font-bold">{label}</div>
      <div style={{ marginLeft: "10px", color: "#ccc" }}>
        {endpointDescription}
      </div>
    </div>
  );

  const appEndpointChangeHandler = async (appEnd: {
    label: string;
    endpointDescription: string;
    endpointKey: string;
    value: string;
  }) => {
    if (!appEnd || !eventApp) return;

    const endpointId = appEnd.value;
    const endpointKey = appEnd.endpointKey;
    setNewFlowActionEndpoint({
      endpointId,
      endpointKey,
      endpointName: appEnd.label,
      endpointDescription: appEnd.endpointDescription,
      app_name: eventApp?.app_name,
      app_key: eventApp?.app_key,
    });
  };

  const appEndpoint = () => {
    switch (eventApp?.app_key) {
      case "slack":
        return <SlackAction />;
      case "webhook":
        return <WebhookAction />;
      default:
        break;
    }
    return false;
  };

  return (
    <>
      {eventApp !== null && (
        <div className="user-app-endpoints px-3 py-2 bg-white rounded-md mt-4">
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gold text-zinc active:bg-pink-600 font-bold uppercase text-xs px-2 py-1 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              onClick={() => {
                setEventApp(null);
              }}
            >
              CANCEL
            </button>
          </div>
          {!!(eventApp?.AppEndpoint?.length && appEndpointOptions) && (
            <>
              <h4 className="text-sm mb-3s">Select App Endpoint</h4>
              <Select
                isSearchable={false}
                name="appEndpoints"
                options={appEndpointOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                formatOptionLabel={formatOptionLabel}
                onChange={appEndpointChangeHandler}
              />
            </>
          )}

          <div className="mt-1">{appEndpoint()}</div>
        </div>
      )}
    </>
  );
};

export default FlowActionAppEndpoints;
