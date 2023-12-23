import axios from "axios";

const useZapContractAPI = () => {
  const getContract = async (contractAddress: string, chain: string) => {
    try {
      const contractEvents = await axios.get(
        `/api/abi/${contractAddress}/${chain}`
      );
      return contractEvents;
    } catch (error: any) {
      if(error?.response?.data){
        return {data: error?.response?.data}
      }
    }
    return null;
  };

  const getActionLogs = async (flowId:number | null, lastCursor: number | null, limit = 10) => {
    try {
      if(flowId){
        const result = await axios.get(`/api/action-logs`, {
          params: {
            flowId,
            limit,
            c: lastCursor,
          },
        });
        const { logs, cursor } = result?.data;
        return { logs, cursor };
      }
    } catch (error) {}
    return { logs: [], cursor: null };
  };

  const registerEvent = async (eventId: number) => {
    try {
      const result = await axios.post("/api/register-event", {
        eventId,
      });
      return result?.data?.status
    } catch (error) {}
    return 'error';
  }

  const removeEvent = async (eventId: number) => {
    try {
      const result = await axios.put("/api/remove-event", {
        eventId,
      });
      return result?.data?.status
    } catch (error) {}
    return 'error';
  }

  const removeAction = async (flowId: number, actionId: number) => {
    try {
      const result = await axios.delete("/api/flow-action", {
        params:{
          flowId,actionId
        }
      });
      return result?.data
    } catch (error) {}
    return {status:'error', message: 'Something went wrong!'};
  }

  const removeEventFlow = async (flowId: number, eventId: number) => {
    try {
      const result = await axios.delete("/api/event/flow", {
        params:{
          flowId,eventId
        }
      });
      return result?.data
    } catch (error) {}
    return {status:'error', message: 'Something went wrong!'};
  }

  const disconnectApp = async (appId: number) => {
    try {
      const result = await axios.post("/api/zap-app/revoke", {
        appId
      });
      return result?.data
    } catch (error) {}
    return {status:'error', message: 'Something went wrong!'};
  }

  return {
    getContract,
    getActionLogs,
    registerEvent,
    removeEvent,
    removeAction,
    removeEventFlow,
    disconnectApp
  };
};

export default useZapContractAPI;
