"use client"
import React from 'react'
import { GridLoader } from 'react-spinners'

const LoaderBox = () => {
  return (
        <div className='h-screen flex items-center flex-col justify-center'>
            <GridLoader  className='text-zinc' loading={true}/>
            <span className="font-bold">Please Wait...</span>
        </div>

  )
}

export default LoaderBox