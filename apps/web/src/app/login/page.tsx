import Login from "@/components/Auth/Login"
import type { Metadata } from 'next'
import { getServerSession } from "next-auth";
import { authOptions } from "auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'ZapWeb3 | Login',
  description: 'Empower Your Ethereum Events, Define Your Actions with ZapWeb3.',
}

const LoginPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect("/dashboard");
  }

  return (
    <Login/>
  )
}

export default LoginPage