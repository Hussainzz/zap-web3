import AppError from "@zap/core/src/utils/appError";
import catchAsync from "@zap/core/src/utils/catchAsync";
//RabbitMQ Producer
import Producer from "../producer";
import HashID from '../../utils/HashID';
import {getEventFlowRecord } from "@zap/core/src/repositories/event.repo";

const eventMQ = new Producer();

/**
 * Pings Zap Service To Register/Start Listening to the event
 * @name registerEvent
 * @return {json}
 */
export const registerEvent = catchAsync(async (req: any, res: any, next: any) => {
    const {eventId} = req.body;
    if(!eventId) {
        return next(new AppError('Bad Request', 400, 'error'));
    }

    let decodedEventId = HashID.decodeNumber(eventId);
    //fix any
    const eventInfo:any = await getEventFlowRecord({
        id: decodedEventId
    });

    if(!eventInfo) {
        return next(new AppError('Event info not found / Flow not configured', 400, 'error'));
    }
    
    const {event_name, event_payload, contractId, 
        Contract:{
            chainId, contract_address, abi, is_active
        },
        Flow:{
            flowId
        }
    } = eventInfo;
    if(is_active) {
        return next(new AppError('Event Listener Already Active', 400, 'error'));
    }

    const msgPayload = {
        eventId: eventId,
        flowId: flowId,
        eventPayload: event_payload,
        eventName: event_name,
        chain: chainId,
        contractAddress: contract_address,
        abi: abi,
        contractId: contractId
    }
    // routingKey -> eventRegister  ---  PUBLISH MSG 💌
    await eventMQ.publishMessage('eventRegister', msgPayload);

    res.status(200).json({
        created: true
    })
});