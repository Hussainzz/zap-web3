import { selector } from "recoil";
import { selectedZapEventFlowState } from "../atoms";

export const selectedZapEventFlow = selector({
  key: "selectedZapEventFlow",
  get: ({ get }) => {
    const zapEventFlow = get(selectedZapEventFlowState);
    return zapEventFlow;
  },
});