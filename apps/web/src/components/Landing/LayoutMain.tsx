import React from 'react'
import ZapHeader from '@/components/Landing/ZapHeader'

const LayoutMain = ({children}:{children:React.ReactNode}) => {
  return (
    <>
        <ZapHeader/>
        {children}
    </>
  )
}

export default LayoutMain