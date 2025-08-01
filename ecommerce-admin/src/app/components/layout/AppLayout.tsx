'use client';

import { usePathname } from 'next/navigation';
import { Layout } from 'antd';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import Navbar from './Navbar';

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

  if (pathName === '/login' || pathName === '/reset-password')
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
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <AppLayoutComponent>{children}</AppLayoutComponent>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default AppLayout;
