/* eslint-disable react/no-unescaped-entities */
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchEventStats } from "@/common-api";
import { getServerSession } from "next-auth/next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ZapWeb3 | Dashboard',
  description: 'Empower Your Ethereum Events, Define Your Actions with ZapWeb3.',
}

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login");
  }
  const eventStats = await fetchEventStats(headers);

  return (
    <div>
      <h1 className="text-3xl md:text-5xl mb-4 font-extrabold" id="home">
        Welcome to ZapWeb3 ⚡️
      </h1>
      <div className="grid grid-cols-2 grid-rows-1 gap-4">
        <div className="col-span-1">
          <div className="rounded-lg p-8 bg-zinc flex justify-evenly">
            <div>
              <h5 className="text-white text-2xl font-bold leading-none">
                Total Events
              </h5>
            </div>
            <div className="">
              <div className="text-2xl font-extrabold text-white text-center">
                {eventStats?.count ?? 0}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div className="rounded-lg p-8 bg-zinc flex flex-col">
            <Link href={"/events"}>
              <h5 className="text-gold_1 text-2xl font-bold leading-none">
                Create New Event
              </h5>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
