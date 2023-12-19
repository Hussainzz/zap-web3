"use client";
import React, { useEffect } from "react";
import CreateContractForm from "@/components/Events/CreateContractForm";
import ContractEvents from "@/components/Events/ContractEvents";
import { useRecoilState, useRecoilValue } from "recoil";
import { contractLoadedState, eventCountState, hideLoadContractFormState } from "@zap/recoil";
import EventFlowForm from "@/components/EventFlow/EventFlowForm";
import Link from "next/link";
const EventsMain = () => {
  const [createdEventCount, setCreatedEventCount] = useRecoilState(eventCountState);
  const hideContractForm = useRecoilValue(hideLoadContractFormState);
  const cLoaded = useRecoilValue(contractLoadedState);

  useEffect(() => {
    (async () => {
      const eventStats = await fetchEventsCount();
      setCreatedEventCount(eventStats?.count ?? 0);
    })();
  }, []);

  const fetchEventsCount = async () => {
    const res = await fetch(`/api/event/stats`, {
      method: "GET"
    });
    if (!res.ok) {
      return 0;
    }
    return res.json();
  };
  

  return (
    <>
      {createdEventCount >= 2 && (
        <div className={`bg-low_gray text-center py-2 rounded-md mb-2`}>
          <div
            className="p-2 items-center text-zinc leading-none border-md flex lg:inline-flex"
            role="alert"
          >
            <span className="font-semibold mr-2 text-left flex-auto">
              You've reached the maximum limit for creating event flows. Each
              user is allowed to create up to two event flows. To create a new
              one, please delete an existing{" "}
              <Link href={"/flows"} className="text-gold_1">
                Event Flow
              </Link>
            </span>
          </div>
        </div>
      )}
      <div
        className={`grid ${
          hideContractForm ? "grid-cols-4" : "grid-cols-3"
        } grid-rows-1 gap-4`}
      >
        {!hideContractForm && (
          <div className="">
            <CreateContractForm />
          </div>
        )}

        <div className={`${!hideContractForm ? "col-span-2" : ""}`}>
          {!hideContractForm && !cLoaded ? (
            <div className="flex items-center flex-col justify-center mt-20">
              <span className="text-4xl">
                Enter your contract address to get started
              </span>
            </div>
          ) : (
            <ContractEvents />
          )}
        </div>
        {hideContractForm && (
          <div className="event-flow col-span-3">
            <EventFlowForm />
          </div>
        )}
      </div>
    </>
  );
};

export default EventsMain;

/* 

      <Link
        href={`/`}
        className=" border-jacarta-100 rounded-2.5xl relative flex items-center border bg-white p-8 transition-shadow hover:shadow-lg"
      >
        <figure className="mr-5 self-start">
            <Image
              src={image}
              alt={title}
              height={50}
              width={50}
              objectFit="cover"
              className="rounded-2lg"
              loading="lazy"
            />
          </figure> 

          <div>
          <h3 className="font-display text-jacarta-700 mb-1 text-base font-semibold ">
            FundMeTest2Event
          </h3>
          <span className="dark:text-jacarta-200 text-jacarta-500 mb-3 block text-sm">
            Event test description
          </span>
          <span className="text-jacarta-300 block text-xs">
            30 minutes 45 seconds ago
          </span>
        </div>
      </Link>
*/
