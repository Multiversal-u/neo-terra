import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/cn'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' })

export const metadata: Metadata = {
  title: 'NEO-TERRA',
  description: 'Global Simulator 2045 — Multiplayer Strategic Simulation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(
        inter.variable,
        orbitron.variable,
        'font-inter bg-neoterra-dark text-white antialiased min-h-screen'
      )}>
        {children}
      </body>
    </html>
  )
}
