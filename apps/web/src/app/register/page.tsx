import Register from '@/components/Auth/Register'
import React from 'react'
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ZapWeb3 | Register',
  description: 'Empower Your Ethereum Events, Define Your Actions with ZapWeb3.',
}

const RegisterPage = async() => {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect("/dashboard");
  }
  return (
    <Register/>
  )
}

export default RegisterPage