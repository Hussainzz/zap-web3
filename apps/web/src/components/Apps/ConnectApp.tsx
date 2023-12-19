"use client"
import { redirect } from 'next/navigation'
import React, { useEffect } from 'react'

const ConnectApp = () => {

  useEffect(() => {
    redirect('/apps')
  },[])

  return (
    <div>
        please wait connecting...
    </div>
  )
}

export default ConnectApp