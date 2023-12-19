"use client";
import { actionEndpointPayloadState, newFlowActionAppEndpointState } from "@zap/recoil";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

const PostMessageToChannel = () => {
  const [msg, setMsg] = useState('');
  const newFlowActionAppEndpoint = useRecoilValue(
    newFlowActionAppEndpointState
  );
  const setActionEndpointPayload = useSetRecoilState(
    actionEndpointPayloadState
  );

  useEffect(() => {
    if(msg.length && newFlowActionAppEndpoint?.endpointId  && newFlowActionAppEndpoint?.endpointKey){
        const appEndInfo = newFlowActionAppEndpoint?.endpointAppInfo ?? null;
        if(appEndInfo){
            setActionEndpointPayload({
                endpointKey: newFlowActionAppEndpoint?.endpointKey,
                endpointId: newFlowActionAppEndpoint?.endpointId,
                payload: {
                    channel: appEndInfo?.id ?? '',
                    text: msg
                }
            });
        }
    }
  },[msg])

  return (
    <div>
      <div className="flex flex-col mt-2">
        <span className="font-bold italic">NOTE:</span>
        <span className="italic">Use double curly braces {"{{yourArgument}}"} to include dynamic argument values emitted by your events in slack message</span>
        <span className="font-bold italic">event YourEvent(string someTxt)</span>
        <span className="italic">Hello, {"{{someTxt}}"}</span>
      </div>
      <textarea
        id="channelMsg"
        rows={4}
        className="border border-zinc block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg mt-3 mb-3"
        placeholder="Msg to post here..."
        value={msg}
        onChange={(e) => {
          setMsg(e.target.value);
        }}
      ></textarea>
    </div>
  );
};

export default PostMessageToChannel;
