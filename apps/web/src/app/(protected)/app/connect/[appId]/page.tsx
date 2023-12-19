import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ConnectApp from "@/components/Apps/ConnectApp";
import { decryptString } from "@/lib/encrypt";
import axios from "axios";
import { User } from "next-auth";

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import React from "react";

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ZapWeb3 | Connect App',
  description: 'Empower Your Ethereum Events, Define Your Actions with ZapWeb3.',
}

const HandleAppConnect = async ({
  params,
  searchParams
}: {
  params: { appId: string },
  searchParams?: { [key: string]: string | string[] | undefined }
}) => {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return redirect("/login");
  }
  const user = session.user as User

  try {
    const AUTH_CALLBACK = `${process.env.ZAP_API_URL}/api/auth/callback`
    const accessToken = decryptString(user?.apiAccessToken ?? '');
    const code = searchParams?.code;
    if(code) {
      const result = await axios.get(`${AUTH_CALLBACK}/${params?.appId}`,{
        headers:{
          Authorization: `Bearer ${accessToken}`
        },
        params:{
          code
        }
      });
      const appInstalled = result?.data?.appInstalled ?? false;
      console.log('appInstalled: ', appInstalled)
    }
  } catch (error: any) {
    console.log(error?.message)
  }
  
  return (
    <div>
      <h1 className="text-3xl md:text-5xl mb-4 font-extrabold" id="home">
        Apps
      </h1>
      <ConnectApp/>
    </div>
  );
};

export default HandleAppConnect;
