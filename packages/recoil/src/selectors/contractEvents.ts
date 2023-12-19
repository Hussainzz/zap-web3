import { selector } from "recoil";
import { contractEventsState, contractLoadedState, hideLoadContractFormState, selectedContractEventState } from "../atoms/contractEventsState";

export const contractEventDetails = selector({
  key: "contractEventDetails",
  get: ({ get }) => {
    const events = get(contractEventsState);
    return events;
  },
});

export const hideLoadContractForm = selector({
  key: "hideLoadContractForm",
  get: ({ get }) => {
    const flag = get(hideLoadContractFormState);
    return flag;
  },
});

export const contractLoaded = selector({
  key: "contractLoaded",
  get: ({ get }) => {
    const flag = get(contractLoadedState);
    return flag;
  },
});


export const selectedContractEvent = selector({
  key: "selectedContractEvent",
  get: ({ get }) => {
    const event = get(selectedContractEventState);
    return event;
  },
});


