import ToastProvider from '@/components/ToastProvider/ToastProvider';
import ReduxProvider from '@/store/ReduxProvider';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

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
        <body className={montserrat.className}>
          {children}
          <ToastProvider />
        </body>
      </html>
    </ReduxProvider>
  );
}
