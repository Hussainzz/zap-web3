"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const ZapHeader = () => {
  const { data: session } = useSession();

  return (
    <header className="js-page-header fixed top-0 z-20 w-full backdrop-blur transition-colors">
      <div className="flex items-center px-6 py-6 xl:px-24 ">
        <Link className="shrink-0" href="/">
          <h1 className="font-bold text-xl">⚡️ ZapWeb3</h1>
        </Link>
        <div className="ml-auto flex">
          {session?.user ? (
            <Link
              href="/dashboard"
              className="rounded-md bg-gold py-3 px-8 text-center font-semibold text-black transition-all hover:bg-gold_1 float-right"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-gold py-3 px-8 text-center font-semibold text-black transition-all hover:bg-gold_1 float-right"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default ZapHeader;
