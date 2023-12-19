import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

async function HeroMain() {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect("/dashboard");
  }

  const heroContent = {
    title: "Empower Your Ethereum Events, Define Your Actions with ZapWeb3.",
    descriptions: `Zapier for Web3`,
    btnText: `Try It Now`,
  };

  return (
    <section className="relative py-20 lg:pt-40">
      <div className="container">
        <div className="h-full items-center gap-4 lg:grid lg:grid-cols-12">
          <div className="flex h-full flex-col items-center justify-center py-10 lg:col-span-5 lg:items-start lg:py-20">
            <h1 className="mb-6 text-center font-display text-5xl text-jacarta-700  lg:text-left lg:text-6xl">
              {heroContent.title}
            </h1>
            <p className="mb-8 max-w-md text-center text-lg  lg:text-left">
              {heroContent.descriptions}
            </p>
            <Link
              href="/register"
              className="rounded-md bg-gold py-3 px-8 text-center font-semibold text-black transition-all hover:bg-gold_1"
            >
              {heroContent.btnText}
            </Link>
          </div>
          {/* End flex-col */}

          {/* <!-- Hero image --> */}
          <div className="col-span-7">
            <div className="relative text-center">
              <img src="/hero_n.svg" alt="hero" className="inline-block" />
              <div className="absolute -top-20 -z-10" style={{
                top: "-95px !important"
              }}>
                <img
                  src="/3d_elements_crypto_app.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroMain;
