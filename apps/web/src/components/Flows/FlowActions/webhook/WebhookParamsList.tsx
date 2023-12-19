"use client";
import { WebhookParamsInterface } from "@zap/recoil";
import React from "react";
import { FaTrash } from "react-icons/fa";

const WebhookParamsList = ({
  params,
  setParams,
}: {
  params: WebhookParamsInterface[];
  setParams: React.Dispatch<React.SetStateAction<WebhookParamsInterface[]>>;
}) => {
  return (
    <div className="grid grid-cols-3 grid-rows-1 gap-4 mt-3">
      {params?.map((param, idx) => (
        <React.Fragment key={idx}>
          <div className="col-span-1">
            <input
              id="webhookParamKey"
              className={`border w-full rounded-lg py-2  px-2`}
              autoComplete="off"
              placeholder="KEY"
              value={param?.key}
              disabled={true}
            />
          </div>
          <div className="col-span-1">
            <input
              id="webhookParamVal"
              className={`border w-full rounded-lg py-2  px-2`}
              autoComplete="off"
              placeholder="VALUE"
              value={param?.val}    
              disabled={true}
            />
          </div>
          <div className="col-span-1">
            <button
              type="button"
              className="bg-gold text-zinc active:bg-pink-600 font-bold uppercase text-xs px-3 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              onClick={() => {
                const updatedParams = [...params];
                updatedParams.splice(idx, 1);
                setParams(updatedParams);
              }}
            >
              <FaTrash />
            </button>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default WebhookParamsList;
