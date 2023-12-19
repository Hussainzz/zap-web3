import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EventsMain from "@/components/Events/EventsMain";

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import React from "react";

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ZapWeb3 | Events',
  description: 'Empower Your Ethereum Events, Define Your Actions with ZapWeb3.',
}

const EventsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  return (
    <div>
      <h1 className="text-3xl md:text-5xl mb-3 font-extrabold" id="eventsPage">
        Events
      </h1>
      <EventsMain />
    </div>
  );
};

export default EventsPage;
