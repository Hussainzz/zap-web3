
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import UserAvatar from '@/components/Common/Avatar/UserAvatar'
import SignOutBtn from '@/components/MainAccount/SignOutBtn'

const MainAccountNavbar = async () => {
  const session = await getServerSession(authOptions)
  return (
    <div className='flex h-16 items-center px-4 mx-auto'>
      {/* <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'> */}
        {/* logo */}
        <Link href='/' className='flex gap-2 items-center'>
         <h1 className="font-bold text-xl">⚡️ ZapWeb3</h1>
        </Link>


        {/* actions */}
        <div className="ml-auto flex items-center space-x-4">

        {session?.user && (
            <UserAvatar imageURI='/' fallbackName='HS' />
        )}
        {session?.user && (
            <SignOutBtn/>
        )}
        </div>
      {/* </div> */}
    </div>
  )
}

export default MainAccountNavbar