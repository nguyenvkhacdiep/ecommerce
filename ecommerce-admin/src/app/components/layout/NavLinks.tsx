'use client';

import { useEffect, useState } from 'react';
import { Menu } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppstoreOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { useIsAdmin, useIsSeller, useIsSuperAdmin } from '@/hooks/useAuthorization';
import { AppColor } from '@/styles/color';

const SUPER_ADMIN_BLOCKED_MODULE = [''];

const ADMIN_BLOCKED_MODULE = ['Account'];
const SHOP_BLOCKED_MODULE = ['Account', 'Shop'];

const links = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: <AppstoreOutlined />,
    activeIcon: (
      <AppstoreOutlined
        style={{
          color: AppColor.Purple500,
        }}
      />
    ),
  },
  {
    key: 'account',
    label: 'Account',
    href: '/account',
    icon: <UserOutlined />,
    activeIcon: (
      <UserOutlined
        style={{
          color: AppColor.Purple500,
        }}
      />
    ),
  },
  {
    key: 'shop',
    label: 'Shop',
    icon: <ShoppingCartOutlined />,
    href: '/shop',
    activeIcon: (
      <ShoppingCartOutlined
        style={{
          color: AppColor.Purple500,
        }}
      />
    ),
  },
  {
    key: 'products',
    label: 'Products',
    icon: <ShoppingCartOutlined />,
    activeIcon: (
      <ShoppingCartOutlined
        style={{
          color: AppColor.Purple500,
        }}
      />
    ),
    children: [
      {
        key: 'add-product',
        label: 'Add Product',
        href: '/products/add-product',
      },
      {
        key: 'list-product',
        label: 'List Product',
        href: '/products/list-product',
      },
      {
        key: 'add-category',
        label: 'Add Category',
        href: '/products/add-category',
      },
      {
        key: 'list-category',
        label: 'List Category',
        href: '/products/list-category',
      },
    ],
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [current, setCurrent] = useState<string[]>([]);
  const [openKey, setOpenKey] = useState<string[]>([]);

  const isSuperAdmin = useIsSuperAdmin();
  const isSeller = useIsSeller();
  const isAdmin = useIsAdmin();

  const [filterLinks, setFilterLinks] = useState(links ?? ([] as any));

  useEffect(() => {
    if (isSuperAdmin) {
      const filters = links.filter((item) => !SUPER_ADMIN_BLOCKED_MODULE.includes(item.label));
      setFilterLinks(filters ?? []);
    }
    if (isAdmin) {
      const filters = links.filter((item) => !ADMIN_BLOCKED_MODULE.includes(item.label));
      setFilterLinks(filters ?? []);
    }
    if (isSeller) {
      const filters = links.filter((item) => !SHOP_BLOCKED_MODULE.includes(item.label));
      setFilterLinks(filters ?? []);
    }

    const segments = pathname.split('/').slice(1);

    setCurrent(segments);
    setOpenKey(segments.length === 1 ? [] : segments.slice(0, -1));
  }, [pathname, isSuperAdmin, isSeller, isAdmin]);

  return (
    <Menu
      mode="inline"
      style={{ backgroundColor: AppColor.White }}
      selectedKeys={current}
      defaultOpenKeys={openKey}
      items={filterLinks.map((item) => {
        return {
          ...item,
          label: item.href ? (
            <Link
              href={item.href}
              style={{
                color: current.includes(item.key) ? AppColor.Purple500 : AppColor.Gray700,
                fontWeight: 500,
                borderRadius: 0,
                margin: 0,
                width: '100%',
              }}
            >
              {item.label}
            </Link>
          ) : (
            <div
              style={{
                color: current.includes(item.key) ? AppColor.Purple500 : AppColor.Gray700,
                fontWeight: 500,
                borderRadius: 0,
                margin: 0,
                width: '100%',
              }}
            >
              {item.label}
            </div>
          ),
          icon: current.includes(item.key) ? item.activeIcon : item.icon,
          children:
            item.children &&
            item.children.map((child) => ({
              ...child,
              label: child.href ? (
                <Link
                  href={child.href}
                  style={{
                    color: current.includes(child.key) ? AppColor.Purple500 : AppColor.Gray700,
                    fontWeight: 500,
                    borderRadius: 0,
                    margin: 0,
                    width: '100%',
                  }}
                >
                  {child.label}
                </Link>
              ) : (
                <>{child.label}</>
              ),
            })),
        };
      })}
    >
      {/* {(filterLinks ?? []).map((item: any) => {
        const isActive = current.includes(item.href);
        return (
          <Item
            key={item.href}
            icon={isActive ? item.activeIcon : item.icon}
            style={{
              color: isActive ? AppColor.Purple500 : AppColor.Gray700,
              fontWeight: 500,
              borderRadius: 0,
              margin: 0,
              width: '100%',
            }}
          >
            <Link href={item.href}>{item.name}</Link>
          </Item>
        );
      })} */}
    </Menu>
  );
}
