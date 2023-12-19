import './globals.css'
import type { Metadata } from 'next'
import { Saira  } from 'next/font/google'
import { Providers } from './providers'

const saira = Saira({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ZapWeb3 | Home',
  description: 'Empower Your Ethereum Events, Define Your Actions with ZapWeb3.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={saira.className} suppressHydrationWarning={true}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
