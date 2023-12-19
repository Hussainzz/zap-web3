import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FlowsMain from "@/components/Flows/FlowsMain";

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import React from "react";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ZapWeb3 | Flows',
  description: 'Empower Your Ethereum Events, Define Your Actions with ZapWeb3.',
}

const FlowsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-3xl md:text-5xl mb-3 font-extrabold" id="flowsPage">
        Flows
      </h1>
      <FlowsMain/>
    </div>
  );
};

export default FlowsPage;
