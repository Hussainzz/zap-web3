"use client";
import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  ContractEvent,
  contractEventDetails,
  hideLoadContractFormState,
  selectedContractEventState,
} from "@zap/recoil";
const ContractEvents = () => {
  const contractEvents = useRecoilValue(contractEventDetails);
  const setSelectedContractEvent = useSetRecoilState(
    selectedContractEventState
  );
  const [hideContractForm, setHideLoadContractForm] = useRecoilState(
    hideLoadContractFormState
  );

  const selectEventHandler = (event: ContractEvent) => {
    setSelectedContractEvent({
      event: event,
      contractId: contractEvents?.contractId ?? null,
    });
    if (!hideContractForm) {
      setHideLoadContractForm(true);
    }
  };

  return (
    <div className={`container mx-auto w-full items-center justify-center`}>
      {contractEvents?.events?.length && (
        <ul className="flex flex-col bg-low_gray p-4 rounded-md">
          {contractEvents?.events?.map((event, idx) => (
            <li
              key={idx}
              className="border-gray-400 mb-2"
              onClick={() => {
                selectEventHandler(event);
              }}
            >
              <div className="select-none cursor-pointer bg-white rounded-md flex flex-1 items-center p-4  transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                <div className="flex flex-col rounded-md w-10 h-10 bg-gray-300 justify-center items-center mr-4">
                  📣
                </div>
                <div className="flex-1 pl-1 mr-16">
                  <div className="font-medium">{event?.name}</div>
                  <div className="text-gray-600 text-sm">
                    {event.inputs
                      .reduce(
                        (acc, input) => `${acc}${input.name}(${input.type})\n`,
                        ""
                      )
                      .trim()}
                  </div>
                </div>
                <div className="text-gray-600 text-xs">{event?.type}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContractEvents;
