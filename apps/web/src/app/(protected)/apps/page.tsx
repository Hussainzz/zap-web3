import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AppsMain from "@/components/Apps/AppsMain";

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import React from "react";

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ZapWeb3 | Apps',
  description: 'Empower Your Ethereum Events, Define Your Actions with ZapWeb3.',
}

const AppsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login");
  }

  return (
    <div>
      <h1 className="text-3xl md:text-5xl mb-4 font-extrabold" id="home">
        Apps
      </h1>
      <AppsMain/>
    </div>
  );
};

export default AppsPage;
