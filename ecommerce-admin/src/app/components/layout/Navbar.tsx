import { AppColor } from '@/styles/color';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import NavLinks from './NavLinks';
import Header from './Header';
import Image from 'next/image';

const NO_GUTTERS_PAGES: string[] = [];

const Navbar = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { Sider } = Layout;
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const pathName = usePathname();
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="h-screen">
      <Sider
        breakpoint="lg"
        width={240}
        style={{ backgroundColor: AppColor.White }}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="flex flex-col justify-between h-screen pb-11">
          <div>
            <div className={`${!collapsed ? 'ml-6 w-[160px]' : 'mx-2'}  mt-8 mb-8 h-[50px]`}>
              <Image
                src={'/navbar-logo.jpg'}
                width={!collapsed ? 160 : 71}
                height={50}
                alt="The magic memory logo"
                style={{
                  objectFit: 'contain',
                  height: 'inherit',
                  objectPosition: collapsed ? 'center' : 'left',
                }}
              />
            </div>
            <NavLinks />
            <Button
              onClick={toggleCollapsed}
              style={{
                backgroundColor: AppColor.White,
                position: 'absolute',
                bottom: '40px',
                border: 'none',
                color: 'white',
              }}
            >
              {collapsed ? (
                <MenuUnfoldOutlined className="text-2xl" />
              ) : (
                <MenuFoldOutlined className="text-2xl" />
              )}
            </Button>
          </div>
        </div>
      </Sider>
      <Suspense>
        <Layout>
          <Header />
          <div
            className={`h-full relative overflow-y-auto ${clsx({
              'p-6': !NO_GUTTERS_PAGES.includes(pathName),
            })}`}
          >
            {children}
          </div>
        </Layout>
      </Suspense>
    </Layout>
  );
};

export default Navbar;
