"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { RecoilRoot } from "recoil";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Props = {
  children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  const [mounted, setMounted] = React.useState(false);
  const queryClient = new QueryClient();
  React.useEffect(() => setMounted(true), []);
  return (
    <RecoilRoot>
      <SessionProvider>
        <Toaster />
        <ProgressBar
          height="5px"
          color="#030712"
          options={{ showSpinner: false }}
          shallowRouting
        />
        <QueryClientProvider client={queryClient}>
          {mounted && children}
        </QueryClientProvider>
      </SessionProvider>
    </RecoilRoot>
  );
};
