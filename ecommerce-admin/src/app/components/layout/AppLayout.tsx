'use client';

import { usePathname } from 'next/navigation';
import { Layout, App as AntApp } from 'antd';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import Navbar from './Navbar';
import { CookiesProvider } from 'react-cookie';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const AppLayoutComponent = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathName = usePathname();

  if (
    pathName === '/login' ||
    pathName === '/reset-password' ||
    pathName === '/forgot-password' ||
    pathName === '/token-expired'
  )
    return (
      <Suspense>
        <Layout className="h-screen">{children}</Layout>
      </Suspense>
    );

  return <Navbar>{children}</Navbar>;
};

const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <AntApp>
            <AppLayoutComponent>{children}</AppLayoutComponent>
          </AntApp>
        </RecoilRoot>
      </QueryClientProvider>
    </CookiesProvider>
  );
};

export default AppLayout;
