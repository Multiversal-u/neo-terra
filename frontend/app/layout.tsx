import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' })

export const metadata: Metadata = {
  title: 'NEO-TERRA',
  description: 'Dark futuristic world simulation dashboard',
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
        "font-inter bg-neoterra-dark text-white antialiased min-h-screen"
      )}>
        {children}
      </body>
    </html>
  )
}
