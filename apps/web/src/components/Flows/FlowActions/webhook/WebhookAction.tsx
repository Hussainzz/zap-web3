"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import ReactJson from "react-json-view";
import {
  FlowActionPayload,
  WebhookParamsInterface,
  addNewActionBoolState,
  newFlowActionAppEndpointState,
  newFlowActionAppState,
  newFlowActionState,
  selectedZapEventFlowState,
} from "@zap/recoil";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import WebhookParams from "@/components/Flows/FlowActions/webhook/WebhookParams";
import WebhookParamsList from "@/components/Flows/FlowActions/webhook/WebhookParamsList";

const WebhookAction = () => {
  const setEventApp = useSetRecoilState(newFlowActionAppState);
  const setAddNewActionBool = useSetRecoilState(addNewActionBoolState);
  const setNewActionFlow = useSetRecoilState(newFlowActionState);
  const eventFlow = useRecoilValue(selectedZapEventFlowState);
  const [newFlowActionAppEndpoint, setNewFlowActionEndpoint] = useRecoilState(
    newFlowActionAppEndpointState
  );
  const methodOptions = [
    {
      label: "GET",
      value: "GET",
    },
    {
      label: "POST",
      value: "POST",
    },
  ];

  const [webhookURL, setWebhookURL] = useState("");
  const [webhookMethod, setWebhookMethod] = useState("GET");
  const [json, setJson] = useState({});
  const [params, setParams] = useState<WebhookParamsInterface[]>([]);

  useEffect(() => {
    if (eventFlow?.Event?.event_payload?.inputs) {
      let jsonBody: any = {};
      eventFlow?.Event?.event_payload?.inputs?.forEach((i: any) => {
        if (i?.name && !jsonBody[i.name]) {
          jsonBody[i.name] = `{{${i.name}}}`;
        }
      });
      setJson(jsonBody);
    }
  }, [eventFlow]);

  useEffect(() => {
    if (webhookURL.length) {
      const url = new URL(webhookURL);
      let queryParams: {
        [key: string]: string;
      } = getQueryParams();
      url.search = new URLSearchParams(queryParams).toString();
      setWebhookURL(url?.toString());
    }
  }, [params]);

  const getQueryParams = () => {
    let queryParams: {
      [key: string]: string;
    } = {};
    params?.forEach((param) => {
      if (!queryParams[param.key]) {
        queryParams[param.key] = param.val;
      }
    });
    return queryParams;
  };

  const addActionHandler = () => {
    if (!webhookURL.length || !params.length || !Object.keys(json).length)
      return;
    let queryParams: {
      [key: string]: string;
    } = getQueryParams();

    const wUrl = new URL(webhookURL);
    wUrl.search = '';
    const actionPayload = {
      method: webhookMethod,
      url: wUrl.toString(),
      queryParams,
      jsonBody: json,
    };
    if (newFlowActionAppEndpoint?.endpointId) {
      const flowActionData: FlowActionPayload = {
        actionPayload,
        appEndpoint: newFlowActionAppEndpoint,
      };
      setNewActionFlow((prevActions) => {
        return [...prevActions, flowActionData];
      });
      setNewFlowActionEndpoint(null);
      setEventApp(null);
      setAddNewActionBool(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div>
        {newFlowActionAppEndpoint && (
          <>
            <h4 className="text-sm mb-2">Select Method</h4>
            <Select
              defaultValue={methodOptions[0]}
              isSearchable={false}
              name="webhookMethods"
              options={methodOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(mValue) => {
                if(!mValue) return;
                setWebhookMethod(mValue?.value);
              }}
            />
            <div className="mt-2 mb-3">
              <input
                id="webhookUrl"
                className={` border w-full rounded-lg py-2  px-2`}
                autoComplete="off"
                placeholder="URL"
                value={webhookURL}
                onChange={(e) => {
                  try {
                    const wUrl = new URL(e.target.value);
                    const allParams = new URLSearchParams(wUrl.search);
                    setWebhookURL(e.target.value);
                    if(allParams.size > 0){
                      let queryParams: WebhookParamsInterface[] = [];
                      Array.from(allParams.keys()).forEach((key) => {
                        if(key.length && allParams.get(key)?.length){
                          queryParams.push({
                            key,
                            val: allParams.get(key)
                          })
                        }
                      });
                      setParams(prev => {
                        const prevMap = new Map(prev.map((param) => [param.key, param]));
                        const filteredParams = queryParams.filter((param) => !prevMap.has(param.key));
                        return [...prev, ...filteredParams];
                      });
                    }
                  } catch (error) {}
                }}
              />
            </div>
            <span className="text-xl font-extrabold mt-4">
              <em>{webhookURL}</em>
            </span>
            {!!webhookURL.length && (
              <>
                <div className="grid grid-cols-2 grid-rows-1 mt-3">
                  <div className="col-span-2">
                    <span className="font-semibold">
                      <em>Params</em>
                    </span>
                    <WebhookParams setParams={setParams} />
                    <WebhookParamsList params={params} setParams={setParams} />
                  </div>
                </div>
                <div className="grid grid-cols-2 grid-rows-1 mt-3">
                  <div className="col-span-2">
                    <span className="font-semibold">
                      <em>Body</em>
                    </span>
                    <ReactJson
                      name={false}
                      theme={"monokai"}
                      src={json}
                      displayDataTypes={false}
                      iconStyle="square"
                      onAdd={(data) => {
                        setJson(data?.updated_src);
                      }}
                      onEdit={(data) => {
                        setJson(data?.updated_src);
                      }}
                      onDelete={(data) => {
                        setJson(data?.updated_src);
                      }}
                      style={{
                        padding: 30,
                      }}
                    />
                  </div>
                </div>
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
            ADD WEBHOOK ACTION
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebhookAction;
