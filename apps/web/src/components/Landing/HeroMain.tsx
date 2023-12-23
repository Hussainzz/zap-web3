import { authOptions } from "auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
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
    <section className="relative py-20">
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
              className="relative rounded px-8 py-2.5 overflow-hidden group bg-gold hover:bg-gradient-to-r hover:from-gold hover:to-green-400 text-zinc hover:ring-2 hover:ring-offset-2 hover:ring-zinc transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-zinc opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative font-semibold">{heroContent.btnText}</span>
            </Link>
          </div>
          {/* End flex-col */}

          {/* <!-- Hero image --> */}
          <div className="col-span-7">
            <div className="relative text-center">
              <Image src="/hero_n.svg" alt="hero" width={598} height={535} className="inline-block" />
              <div
                className="absolute -top-20 -z-10"
                style={{
                  top: "-95px !important",
                }}
              >
                <Image src="/3d_elements_crypto_app.png" alt="" width={672} height={606} priority={true}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroMain;
