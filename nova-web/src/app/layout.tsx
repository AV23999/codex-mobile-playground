import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { LayoutShell } from '@/components/layout-shell';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'N.O.V.A',
  description: 'Neural Operative Virtual Assistant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
