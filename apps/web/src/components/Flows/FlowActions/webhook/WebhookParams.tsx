"use client";
import { WebhookParamsInterface } from "@zap/recoil";
import React, { useState } from "react";


const WebhookParams = ({setParams}:{
    setParams: React.Dispatch<React.SetStateAction<WebhookParamsInterface[]>>
}) => {
  const [paramKey, setParamKey] = useState("");
  const [paramVal, setParamVal] = useState("");

  const addParamNewHandler = () => {
    if(!paramKey.length || !paramVal.length)  return;
    setParams((prevParams) => {
        let currentParams = [...prevParams];
        let paramIdx = currentParams.findIndex(p => p.key === paramKey);
        const paramKeyVal = {
            key: paramKey,
            val: paramVal
        }
        if(paramIdx !== -1) {
            currentParams[paramIdx] = paramKeyVal
        }else{
            currentParams.push(paramKeyVal)
        }
        return currentParams
    });
    setParamKey('');
    setParamVal('');
  }

  return (
    <>
      <div className="grid grid-cols-3 grid-rows-1 gap-4">
        <div className="col-span-1">
          <input
            id="webhookParamKey"
            className={`border w-full rounded-lg py-2  px-2`}
            autoComplete="off"
            placeholder="KEY"
            value={paramKey}
            onChange={(e) => {
              setParamKey(e.target.value);
            }}
          />
        </div>
        <div className="col-span-1">
          <input
            id="webhookParamVal"
            className={`border w-full rounded-lg py-2  px-2`}
            autoComplete="off"
            placeholder="VALUE"
            value={paramVal}
            onChange={(e) => {
              setParamVal(e.target.value);
            }}
          />
        </div>
        <div className="col-span-1">
          <button
            type="button"
            className="bg-gold text-zinc active:bg-pink-600 font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            onClick={addParamNewHandler}
          >
            ➕
          </button>
        </div>
      </div>
    </>
  );
};

export default WebhookParams;
