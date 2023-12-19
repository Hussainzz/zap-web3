import { atom } from "recoil";
import { ActionEndpointPayload, FlowActionPayload, UserZapApp, UserZapAppEndpoint, ZapDashboardEvents } from "../types";

//New Flow Action Payload Atom State
export const newFlowActionState = atom<FlowActionPayload[] | []>({
  key: "newFlowActionState",
  default: [],
});


export const newFlowActionAppState = atom<UserZapApp | null>({
  key: "newFlowActionAppState",
  default: null,
});

export const newFlowActionAppEndpointState = atom<UserZapAppEndpoint | null>({
  key: "newFlowActionAppEndpointState",
  default: null,
});

export const zapSocketState = atom<any>({
  key: "zapSocketState",
  dangerouslyAllowMutability: true,
  default: null
});

export const zapDashboardEventsState = atom<ZapDashboardEvents>({
  key: "zapDashboardEventsState",
  dangerouslyAllowMutability: true,
  default: {
    eventFlowStarted: false,
    eventFlowCompleted: false,
    eventFlowStatus: 'none',
    eventFlowActionEvents: {}
  }
})

export const addNewActionBoolState = atom<Boolean>({
  key: "addNewActionBoolState",
  default: false
});

export const actionEndpointPayloadState = atom<ActionEndpointPayload | null>({
  key: "actionEndpointPayloadState",
  default: null
});