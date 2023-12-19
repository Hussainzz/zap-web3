import { atom } from "recoil";
import { AllZapAppsReloader, UserEventFlowReloader, UserZapFlowEvent } from "../types";

export const selectedZapEventFlowState = atom<UserZapFlowEvent | null>({
  key: "selectedZapEventFlowState",
  default: null,
});

export const zapEventFlowsState = atom<UserZapFlowEvent[] | []>({
  key: "zapEventFlowsState",
  default: []
});

export const zapEventFlowsReloader = atom<UserEventFlowReloader>({
  key: "zapEventFlowsReloader",
  default: {
    reload: 0,
    flowData: []
  }
});

export const zapAllAppsReloader = atom<AllZapAppsReloader>({
  key: "zapAllAppsReloader",
  default: {
    reload: 0,
    apps: [],
  }
});