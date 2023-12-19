/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import { HiMenuAlt3, HiSpeakerphone } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { PiFlowArrowFill } from "react-icons/pi";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  name: string;
  link: string;
  icon: string;
  margin?: string;
}

const MainAccountLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const menus: MenuItem[] = [
    { name: "Dashboard", link: "/dashboard", icon: MdOutlineDashboard },
    { name: "Events", link: "/events", icon: HiSpeakerphone },
    { name: "Flows", link: "/flows", icon: PiFlowArrowFill },
    { name: "Apps", link: "/apps", icon: AiOutlineAppstoreAdd },
    // { name: "Setting", link: "/", icon: RiSettings4Line },
  ];
  const [open, setOpen] = useState(false);

  return (
    <section className="flex gap-6">
      {/* <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10">
        <img src="/gradient.jpg" alt="gradient" />
      </picture> */}
      <div
        className={`min-h-screen ${
          open ? "w-72" : "w-16"
        } duration-500 text-gray-100 px-4`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-4 relative">
          {menus?.map((menu, i) => (
            <Link
              href={menu?.link}
              key={i}
              className={` ${
                menu?.margin && "mt-5"
              } group flex items-center text-sm  gap-3.5 font-medium p-2 ${
                menu?.link === pathname ? "bg-gold" : "hover:bg-gold"
              } rounded-md`}
            >
              <div>{React.createElement(menu?.icon, { size: "20" })}</div>
              <h2
                style={{
                  transitionDelay: `0ms`,
                }}
                className={`whitespace-pre duration-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {menu?.name}
              </h2>
              <h2
                className={`${
                  open && "hidden"
                } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
              >
                {menu?.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
      <main role="main" className="w-full flex-grow pt-1 px-3">
        {children}
      </main>
    </section>
  );
};

export default MainAccountLayout;
