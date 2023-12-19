export interface ContractEventInput {
  name: string;
  type: string;
  indexed: boolean;
  internalType: string;
}

export interface ContractEvent {
  name: string;
  type: "event";
  inputs: ContractEventInput[];
}

export interface ContractEventInfo {
  events: ContractEvent[];
  contractId: number | null;
}

export interface SelectedContractEvent {
  event: ContractEvent;
  contractId: number | null;
}

export type ZapApp = {
  id: number;
  app_name: string | null;
  app_key: string | null;
  app_auth_url: string | null;
  UserApp: {
    userId: number;
  }[];
};

export interface ZapAppsResponse {
  apps: ZapApp[] | [];
}

export type AppEndpoint = {
  id?: number;
  endpoint_name?: string | null;
  endpoint_key?: string | null;
  endpoint_description?: string | null;
  endpoint_type?: string | null;
  appId?: number | null;
  App?:{
      app_name: string | null;
      app_key: string | null;
  };
}

export type UserZapApp = {
  id: number;
  app_name: string | null;
  app_key: string | null;
  AppEndpoint: AppEndpoint[] | [],
  UserApp: {
    userId: number;
  }[];
};

export interface UserZapAppsResponse {
  apps: UserZapApp[] | [];
}

export interface FlowAction{
  id?: number;
  flowId?: number | null;
  appEndpointId?: number | null;
  actionPayload?: any;
  AppEndpoint?:AppEndpoint
  // appName?: string | null;
  // appKey?: string | null;
  // appEndpointName?: string | null;
  // appEndpointDescription?: string | null;

}

export type UserZapFlowEvent = {
  id: number;
  flow_name: string | null;
  FlowAction: FlowAction[];
  eventId: number | null;
  Event: {
    event_name: string | null;
    event_description: string | null;
    event_payload: any | ContractEvent;
    is_active: number;
    userId: number;
    contractId?: number;
    Contract?: {
      contract_address: string | null;
    };
  };
};

export interface UserZapEventFlowResponse {
  userEventFlows: UserZapFlowEvent[] | [];
}

export type AppZap = {
  id?: number;
  app_name?: string | null;
  app_key?: string | null;
  app_auth_url?: string | null;
  app_description?: string | null;
  app_auth_payload?: string | null;
};

export type AppZapEndpoint = {
  id?:number;
  appId?: number;
  endpoint_key?: string | null;
  endpoint_name?: string | null;
  endpoint_description?: string | null;
  endpoint_type?: string | null;
  endpoint_url?: string | null;
  endpoint_payload?: any;
};


export interface EventFlowActionEventsInterface {
  [key: string]: {
    key: string;
    started: boolean;
    error: boolean;
    completed: boolean;
  };
}

export type ZapFlowStat = 'none' | 'started' | 'completed' | 'error';

export interface ZapDashboardEvents {
  eventFlowStatus: ZapFlowStat;
  eventFlowStarted: boolean;
  eventFlowActionEvents: EventFlowActionEventsInterface;
  eventFlowCompleted: boolean;
};

export interface UserEventFlowReloader {
  reload: number;
  reloadNow?: boolean;
  flowData: UserZapFlowEvent[] | [];
}

export interface UserZapAppEndpoint {
  app_name: string | null;
  app_key: string | null;
  endpointId: string | null;
  endpointKey: string | null;
  endpointName?: string | null;
  endpointDescription?: string | null;
  endpointAppInfo?: any | null;
};

export interface FlowActionPayload {
  actionPayload: any;
  appEndpoint: UserZapAppEndpoint;
}

export interface WebhookParamsInterface {
  key: any;
  val: any;
}

export interface ActionEndpointPayload{
  endpointKey: string
  endpointId: string;
  payload: any;
}


export type FlowActionLog = {
  id: number;
  flowId: number | null;
  flowActionId: number | null;
  FlowAction: FlowAction;
  status: string | null;
  resultPayload: any;
  createdAt: string;
};

export interface FlowActionLogsResponse {
  logs: FlowActionLog[] | [];
  cursor: number | null;
}

export interface AllZapAppsReloader {
  reload: number;
  apps:ZapApp[] | [];
}