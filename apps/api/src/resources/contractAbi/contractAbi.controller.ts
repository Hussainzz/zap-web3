// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Request, Response, NextFunction } from "express";
import etherScanApi from "etherscan-api";
import axios from "axios";
import AppError from "@zap/core/src/utils/appError";
import catchAsync from "@zap/core/src/utils/catchAsync";

import {getContract, createNewContract} from "@zap/core/src/repositories/contract.repo";

const networkInfo = process.env.NETWORK_INFO as string;

const NETWORK_DETAILS = JSON.parse(networkInfo);

/**
 * Gets Contract ABI
 * @name getContractEvents
 * @return {json} returns contract events.
 */
export const getContractEvents = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let abiEvents = null;
    let { contractAddress, chainName } = req.params;
    contractAddress = contractAddress.toLowerCase();
    if (!contractAddress || !chainName) {
      return next(new AppError("Bad Request", 400, "error"));
    }

    let contractId = null;

    const networkInfo = NETWORK_DETAILS.find(
      (chain: any) => chain.network === chainName.toLowerCase()
    );
    if (!networkInfo?.network) {
      return next(new AppError("Invalid Chain", 400, "error"));
    }

    const contractRecord = await getContract({
      where: { contract_address: contractAddress, chainName: networkInfo?.network },
    });
    if (contractRecord) {
      contractId = contractRecord?.id ?? null;
      const { abi } = contractRecord;
      abiEvents = abi.filter((a: any) => a.type === "event");
    } else {
      const { network, etherscanEndpoint, etherscanApiKey, chainId } =
        networkInfo;
      const timeout = 10000;
      const client = axios.create({
        baseURL: etherscanEndpoint,
        timeout: timeout,
      }); 
      
      const etherscanClient = etherScanApi.init(
        etherscanApiKey,
        network,
        timeout,
        client
      );
      if (etherscanClient) {
        try {
          const contractABI =
            await etherscanClient.contract.getabi(contractAddress);
          if (contractABI && contractABI?.result?.length) {
            const abi = JSON.parse(contractABI?.result);
            const createdEvent = await createNewContract({
              contract_address: contractAddress,
              abi,
              chainName: network,
              chainId: chainId,
            });
            contractId = createdEvent?.dataValues?.id ?? null;
            abiEvents = abi.filter((a: any) => a.type === "event");
          }
        } catch (error: any) {
          return next(
            new AppError(error || "Something went wrong!", 500, "error")
          );
        }
      }
    }

    res.status(200).json({
      status: "success",
      events: abiEvents,
      contractId
    });
  }
);
