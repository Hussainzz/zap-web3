import { selector } from "recoil";
import { newFlowActionAppEndpointState, newFlowActionAppState, newFlowActionState, selectedZapEventFlowState, zapDashboardEventsState, zapSocketState } from "../atoms";

export const newFlowActionSelector = selector({
  key: "newFlowActionSelector",
  get: ({ get }) => {
    const newFlowActions = get(newFlowActionState);
    if(!newFlowActions.length) return []
    return newFlowActions?.map((a) => {
      return a.appEndpoint.app_key
    })
  },
});

/* 
export const newFlowActionAppEndpointState = atom<UserZapAppEndpoint | null>({
  key: "newFlowActionAppEndpointState",
  default: null,
});
*/
export const selectedFlowEndpointKeysSelector = selector({
  key: "selectedFlowEndpointKeysSelector",
  get: ({ get }) => {
    const selected = get(selectedZapEventFlowState);
    if(!selected?.FlowAction.length) return []

    return selected.FlowAction.map((a) => a.AppEndpoint?.endpoint_key);
  },
})

export const newFlowActionApp = selector({
  key: "newFlowActionApp",
  get: ({ get }) => {
    const newFlowActionApp = get(newFlowActionAppState);
    return newFlowActionApp;
  },
});

export const newFlowActionAppEndpoint = selector({
  key: "newFlowActionAppEndpoint",
  get: ({ get }) => {
    const newFlowActionAppEndpoint = get(newFlowActionAppEndpointState);
    return newFlowActionAppEndpoint;
  },
});


export const zapSocket = selector({
  key: "zapSocket",
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    const zapSocket = get(zapSocketState);
    return zapSocket;
  },
});

export const zapDashboardEventsSelector = selector({
  key: "zapDashboardEventsSelector",
  dangerouslyAllowMutability: true,
  get: ({ get }) => {
    const zapDashboardEvents = get(zapDashboardEventsState);
    return zapDashboardEvents;
  },
});