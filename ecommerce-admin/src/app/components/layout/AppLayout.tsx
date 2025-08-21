'use client';

import { usePathname } from 'next/navigation';
import { Layout, App as AntApp, ConfigProvider } from 'antd';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import Navbar from './Navbar';
import { CookiesProvider } from 'react-cookie';
import { AppColor } from '@/styles/color';

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
    pathName === '/set-password' ||
    pathName === '/forgot-password' ||
    pathName === '/token-expired' ||
    pathName === '/activate' ||
    pathName === '/forbidden'
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
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: AppColor.Purple500,
                },
              }}
            >
              <AppLayoutComponent>{children}</AppLayoutComponent>
            </ConfigProvider>
          </AntApp>
        </RecoilRoot>
      </QueryClientProvider>
    </CookiesProvider>
  );
};

export default AppLayout;
