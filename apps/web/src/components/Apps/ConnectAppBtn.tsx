"use client";
import { ZapApp } from "@zap/recoil";
import Link from "next/link";
import React from "react";

const ConnectAppBtn = ({ appInfo }: { appInfo: ZapApp }) => {
  return (
    <Link
      href={`${appInfo?.app_auth_url ? appInfo?.app_auth_url : "#"}`}
      className="bg-gold text-d_gray hover:bg-gold_1 rounded-md py-3 px-8 text-center font-semibold text-black transition-all w-full"
      target="_blank"
    >
      CONNECT
    </Link>
  );
};

export default ConnectAppBtn;
