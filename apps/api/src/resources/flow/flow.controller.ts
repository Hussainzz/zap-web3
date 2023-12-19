import AppError from "@zap/core/src/utils/appError";
import catchAsync from "@zap/core/src/utils/catchAsync";
import {getContract} from "@zap/core/src/repositories/contract.repo";
import { createNewEventFlow } from "@zap/core/src/repositories/flow.repo";


/**
 * Create new event flow
 * @name createEventFlow
 * @return {json} returns success/failure.
 */
export const createEventFlow = catchAsync(async (req: any, res:any, next:any) => {
    const {eventName, eventDescription, contract, flowName, chain, flowDescription} = req.body;
    let httpCode = 400;
    const response = {
        status: 'failed',
        message: 'Flow creation failed'
    }
    const contractRecord = await getContract({ where: { 
        contract_address: contract,
        chainId: chain
    }});
    if(!contractRecord){
        return next(new AppError('Contract not found', 404, 'error')); 
    }

    const {id:contractId, abi} = contractRecord;
    const eventPayload = abi.find( (a: any) => a.name === eventName && a.type === 'event' );
    if(!eventPayload){
        return next(new AppError('Invalid event', 400, 'error')); 
    }
    
    const flowData = {
        flow_name: flowName,
        flow_description: flowDescription || null
    }
    const eventData = {
        event_name: eventName,
        event_description: eventDescription || null,
        event_payload: eventPayload,
        contractId: contractId,
        is_active: false
    }
    const flowEventCreation = await createNewEventFlow(flowData, eventData)
    if(flowEventCreation){
        response.status = 'success';
        response.message = 'Flow created successfully'
    }

    res.status(httpCode).json(response)
});