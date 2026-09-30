import type { Metadata } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/cn'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'NEO-TERRA — Simulación Estratégica Global & Gobernanza Consciente 2045',
  description: 'Plataforma interactiva de toma de decisiones corporativas, trazabilidad sistémica e impacto geopolítico y ecológico hacia el horizonte 2045.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className={cn(
        'font-sans bg-paper text-ink antialiased min-h-screen selection:bg-moss-soft selection:text-moss-dark'
      )}>
        {children}
      </body>
    </html>
  )
}
