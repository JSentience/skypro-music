import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserratSans = Montserrat({
  variable: '--font-geist-sans',
});

export const metadata: Metadata = {
  title: 'Skypro Music',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserratSans.variable} font-sans`}>{children}</body>
    </html>
  );
}
