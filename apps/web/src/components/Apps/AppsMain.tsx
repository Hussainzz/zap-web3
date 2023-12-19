"use client";
import React from "react";
import ZapAppsList from "@/components/Apps/ZapAppsList";
import LoaderBox from "@/components/Common/LoaderBox";
const AppsMain = () => {
  return (
    <div className="container mx-auto w-full items-center justify-center">
      <React.Suspense fallback={<LoaderBox />}>
        <ZapAppsList />
      </React.Suspense>
    </div>
  );
};

export default AppsMain;
