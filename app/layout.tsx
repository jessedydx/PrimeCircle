import { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import { FarcasterSDKInit } from '@/components/FarcasterSDKInit'
import './globals.css'

export const metadata: Metadata = {
    title: 'PrimeCircle - Farcaster Follow Quality Analytics',
    description: 'Analyze the quality of creators you follow using Neynar scores. Get insights into your network with tier based classification and quality scoring.',
    metadataBase: new URL('https://prime-circle.vercel.app'),
    openGraph: {
        title: 'PrimeCircle Analytics',
        description: 'Analyze the quality of your Farcaster follow network with Neynar scores.',
        url: 'https://prime-circle.vercel.app',
        siteName: 'PrimeCircle',
        images: [
            {
                url: '/og-image-v3.png',
                width: 1200,
                height: 630,
                alt: 'PrimeCircle - Follow Quality Analytics',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'PrimeCircle Analytics',
        description: 'Analyze the quality of your Farcaster follow network with Neynar scores.',
        images: ['/og-image-v3.png'],
    },
    icons: {
        icon: '/icon-v3.png',
        apple: '/icon-v3.png',
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-slate-900 text-white antialiased">
                <FarcasterSDKInit />
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
