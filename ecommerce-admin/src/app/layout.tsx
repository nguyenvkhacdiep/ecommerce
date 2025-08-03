'use client';

import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import AppLayout from './components/layout/AppLayout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <AntdRegistry>
          <AppLayout>{children}</AppLayout>
        </AntdRegistry>
      </body>
    </html>
  );
}
