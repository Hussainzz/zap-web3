"use client";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { TextField } from "@/components/Common/TextField";
import * as Yup from "yup";
import SelectField from "@/components/Common/SelectField";
import useZapContractAPI from "@/hooks/useZapContractAPI";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  contractEventsState,
  contractLoadedState,
  eventCountState,
} from "@zap/recoil";
import LoadingBtn from "@/components/Common/LoadingBtn";
import toast from "react-hot-toast";

const validate = Yup.object().shape({
  contractAddress: Yup.string().required("Contract address is required"),
  chainNetwork: Yup.string().required("Chain network is required"),
});

interface CreateContractFormValues {
  contractAddress: string;
  chainNetwork: string;
  abi?: string;
}

const initValues: CreateContractFormValues = {
  contractAddress: "",
  chainNetwork: "sepolia",
};

const networkChainOptions = [
  { value: "sepolia", label: "Sepolia (Testnet)" },
  { value: "mumbai", label: "Polygon (Mumbai Testnet)" },
];

const CreateContractForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setContractEvents = useSetRecoilState(contractEventsState);
  const setContractLoaded = useSetRecoilState(contractLoadedState);
  const createdEventCount = useRecoilValue(eventCountState);
  const { getContract } = useZapContractAPI();

  const createLoadContractFormHandler = async (
    formValues: CreateContractFormValues
  ) => {
    if (createdEventCount >= 2) return;
    setIsLoading(true);
    const events = await getContract(
      formValues?.contractAddress,
      formValues?.chainNetwork
    );
    const resultData = events?.data ?? null;
    if(!resultData) {
      toast.error('Contract not found / invalid');
      setIsLoading(false);
      setContractLoaded(false);
      setContractEvents(null);
      return;
    }
    const contractEvents = resultData?.events ?? [];
    const msg = resultData?.message;
    if(contractEvents?.length <= 0 && msg === 'success') {
      toast.error('Not events found 🥲');
      setContractLoaded(false);
      setContractEvents(null);
    }else if(msg !== 'success'){
      toast.error(`${msg} 🥲`);
      setContractLoaded(false);
      setContractEvents(null);
    }else if(contractEvents?.length > 0 && msg === 'success'){
      setContractEvents({
        events: contractEvents,
        contractId: events?.data?.contractId ?? null,
      });
      setContractLoaded(true);
    }
    setIsLoading(false);
  };

  const btnClass =
    createdEventCount < 2
      ? "bg-gold hover:bg-gold_1"
      : "bg-gray5 opacity-60 text-zinc cursor-not-allowed";
  return (
    <>
      <Formik
        initialValues={initValues}
        validationSchema={validate}
        onSubmit={createLoadContractFormHandler}
        enableReinitialize
      >
        {(formik) => (
          <Form className="space-y-6">
            <div>
              <TextField
                label="Contract Address"
                name="contractAddress"
                type="contractAddress"
                autoComplete="off"
              />
              <em>Test Address: 0x146488169dc642b59faa73334e6d01f4fd213d68</em>
            </div>
            <div>
              <SelectField
                id="chainNetwork"
                instanceId="chainNetwork"
                label={"Choose Network Chain"}
                name="chainNetwork"
                options={networkChainOptions}
                placeholder="Select Network Chain"
              />
            </div>

            <div className="flex items-center">
              {!isLoading ? (
                <button
                  type="submit"
                  className={`${btnClass} rounded-md py-3 px-8 text-center font-semibold text-black transition-all w-full`}
                  disabled={createdEventCount >= 2}
                >
                  Load Contract
                </button>
              ) : (
                <LoadingBtn />
              )}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateContractForm;
