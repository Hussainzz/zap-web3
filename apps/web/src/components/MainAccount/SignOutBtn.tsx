"use client";
import { signOut } from 'next-auth/react';
import React from 'react'

const SignOutBtn = () => {
  return (
    <button type='button' onClick={() => signOut()}>SignOut</button>
  )
}

export default SignOutBtn