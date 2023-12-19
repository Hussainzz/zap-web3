import { atom } from "recoil";
import {ContractEventInfo, SelectedContractEvent} from "../types";

export const contractEventsState = atom<ContractEventInfo | null>({
  key: "contractEventsState",
  default: null,
});

export const hideLoadContractFormState = atom<boolean>({
  key: "hideLoadContractFormState",
  default: false,
});

export const contractLoadedState = atom<boolean>({
  key: "contractLoadedState",
  default: false,
});

export const selectedContractEventState = atom<SelectedContractEvent | null>({
  key: "selectedContractEventState",
  default: null,
});

export const eventCountState = atom<number>({
  key: "eventCountState",
  default: 0,
});