import MainAccountNavbar from "@/components/MainAccount/MainAccountNavbar";
import MainAccountLayout from "@/components/MainAccount/MainAccountLayout";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <MainAccountNavbar />
      <div className="">
        <MainAccountLayout>{children}</MainAccountLayout>
      </div>
    </>
  );
}
