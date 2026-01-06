import ReduxProvider from '@/store/ReduxProvider';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Skypro Music',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ReduxProvider>
      <html lang="en">
        <body className={montserrat.className}>{children}</body>
      </html>
    </ReduxProvider>
  );
}
