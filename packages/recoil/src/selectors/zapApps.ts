import { atom, selector } from "recoil";
import axios from "axios";
import { UserZapApp, UserZapFlowEvent, ZapApp } from "../types";
import { zapAllAppsReloader, zapEventFlowsReloader } from "../atoms";

export const zapApps = selector({
  key: "zapApps",
  get: async ({ get }) => {
    const reloadData = await get(zapAllAppsReloader);
    if (reloadData?.apps?.length) {
      return reloadData.apps;
    }
    let apps: ZapApp[] = [];
    try {
      const response = await axios.get("/api/zap-apps");
      if (response?.data?.apps) {
        apps = response.data?.apps;
      }
    } catch (error) {}
    return apps;
  },
});

export const zapAppsAtom = atom({
  key: "zapAppsAtom",
  default: zapApps,
});

export const zapEventFlows = selector({
  key: "zapEventFlows",
  get: async ({ get }) => {
    const reloadData = await get(zapEventFlowsReloader);
    if (!reloadData?.flowData?.length || reloadData?.reloadNow) {
      let eventFlows: UserZapFlowEvent[] = [];
      try {
        const response = await axios.get(`/api/zap-events`);
        if (response?.data?.userEventFlows) {
          eventFlows = response.data?.userEventFlows;
        }
      } catch (error: any) {
        console.log(error?.message);
      }
      return eventFlows;
    }
    return reloadData?.flowData;
  },
});

export const zapEventFlowsAtom = atom({
  key: "zapEventFlowsAtom",
  default: zapEventFlows,
});

export const UserZapApps = selector({
  key: "userZapApps",
  get: async ({ get }) => {
    let apps: UserZapApp[] = [];
    try {
      const response = await axios.get("/api/user-zap-apps");
      if (response?.data?.apps) {
        apps = response.data?.apps;
      }
    } catch (error) {}
    return apps;
  },
});
