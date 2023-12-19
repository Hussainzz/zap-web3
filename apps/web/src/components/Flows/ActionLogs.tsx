"use client";

import useZapContractAPI from "@/hooks/useZapContractAPI";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlowActionLog, selectedZapEventFlowState } from "@zap/recoil";
import axios from "axios";
import React, { useEffect, useMemo } from "react";
import { FaCopy } from "react-icons/fa";
import { useRecoilValue } from "recoil";

interface GetAllLogsResponse {
  logs: FlowActionLog[] | [];
  cursor: number | null;
}

const ActionLogs = () => {
  const eventFlow = useRecoilValue(selectedZapEventFlowState);
  const { getActionLogs } = useZapContractAPI();
  const {
    data: allLogsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["logs"],
    initialPageParam: null,
    refetchOnWindowFocus: "always",
    getNextPageParam: (prevData: GetAllLogsResponse) => prevData.cursor,
    queryFn: ({ pageParam = null }) =>
      getActionLogs(eventFlow?.id ?? null, pageParam as number | null),
  });

  const logs = allLogsData?.pages?.reduce((acc: any, page) => {
    return [...acc, ...page?.logs];
  }, []);

  const memoizedData = useMemo(() => logs || [], [logs]) as
    | FlowActionLog[]
    | [];

  const reloadLogsData = async () => {
    await refetch();
  };

  return (
    <div className="grid grid-rows-1 gap-2">
      <div className="flex justify-end my-2">
        <button
          type="button"
          className={`bg-gold text-zinc active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${
            isRefetching ? "cursor-progress" : ""
          }`}
          onClick={reloadLogsData}
        >
          {isRefetching ? "Please Wait...." : "RELOAD"}
        </button>
      </div>
      <div className="rounded-md p-4 bg-white text-zinc">
        <table className="w-full">
          <thead className="bg-low_gray p-3 rounded-sm">
            <tr>
              <th>Action</th>
              <th>Status</th>
              <th>Response</th>
              <th>Executed On</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {memoizedData?.map((log, idx: any) => (
              <tr key={`${idx}-${log.id}`}>
                <td>{log.FlowAction.AppEndpoint?.endpoint_name}</td>
                <td
                  className={`font-bold ${
                    log.status === "success" ? "text-green" : "text-red"
                  }`}
                >
                  {log.status?.toUpperCase()}
                </td>
                <td className="flex justify-center">
                  <FaCopy
                    className="cursor-pointer hover:text-gold_1"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        JSON.stringify(log.resultPayload)
                      );
                    }}
                  />
                </td>
                <td>{log.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center">
          {memoizedData && memoizedData?.length <= 0 && (
            <div className="text-center p-11rem fw-bolder my-5">
              No Logs Found 📃
            </div>
          )}
          {hasNextPage && !isFetchingNextPage && (
            <span
              className="font-bold cursor-pointer"
              onClick={() => {
                fetchNextPage();
              }}
            >
              SHOW MORE
            </span>
          )}
          {isFetchingNextPage && <span className="font-bold">Loading...</span>}
        </div>
      </div>
    </div>
  );
};

export default ActionLogs;
