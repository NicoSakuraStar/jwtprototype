import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// Configure the Inter font (standard Google Font)
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JWT Auth Prototype',
  description: 'Next.js 14 JWT and MongoDB Authentication System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the Inter font to the body */}
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}