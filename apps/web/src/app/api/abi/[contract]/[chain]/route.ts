import { authOptions } from 'auth'
import { decryptString } from '@/lib/encrypt'
import axios from 'axios'
import { User, getServerSession } from 'next-auth'
import { NextResponse, type NextRequest } from 'next/server'
 
const ABI_API = `${process.env.ZAP_API_URL}/api/abi/events`

interface ContractChainParams{
  contract: string,
  chain: string
}

type ContractEvent = {
  name: string;
  type: 'event';
  inputs: any[];
  anonymous: boolean
}

interface ContractEventsResponse {
  events : ContractEvent[] | [],
  contractId: number | null,
  message: string
}

export async function GET(request: NextRequest, {params}:{params: ContractChainParams}) {
  const session = await getServerSession(authOptions);
  const user: User | undefined = session?.user;

  if (!session || !user || !user?.id) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const accessToken = decryptString(user?.apiAccessToken ?? '');
  
  const {contract, chain} = params;
  let eventResult:ContractEventsResponse = {
    events: [],
    contractId: null,
    message: 'Something went wrong'
  }
  let httpStatusCode = 500;
  try {
    const result = await axios.get(`${ABI_API}/${contract?.toLowerCase()}/${chain?.toLowerCase()}`,{
      headers:{
        Authorization: 'Bearer ' + accessToken
      }
    })
    eventResult.events = result?.data?.events ?? [];
    eventResult.contractId = result?.data?.contractId ?? null;
    eventResult.message = 'success';
    httpStatusCode = 200;
  } catch (error: any) {
    const errMessage = error?.response?.data?.message ?? null;
    if(errMessage){
      eventResult.message = errMessage;
    }
  }

  return Response.json(eventResult, {
    status:httpStatusCode
  });
}