'use client';

import { useEffect, useState } from 'react';
import { Menu, MenuProps } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AppstoreOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { useIsSellerAdmin, useIsSuperAdmin } from '@/hooks/useAuthorization';
import { AppColor } from '@/styles/color';

const SUPER_ADMIN_BLOCKED_MODULE = [''];

const ADMIN_BLOCKED_MODULE = [''];

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
    key: 'e-commerce',
    label: 'E-Commerce',
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
        key: 'products',
        label: 'Products',
        href: '/e-commerce/products',
      },
      {
        key: 'add-product',
        label: 'Add Product',
        href: '/e-commerce/add-product',
      },
      {
        key: 'coupons',
        label: 'Coupons',
        href: '/e-commerce/coupons',
      },
      {
        key: 'add-coupon',
        label: 'Add Coupon',
        href: '/e-commerce/add-coupon',
      },
      {
        key: 'billing',
        label: 'Billing',
        href: '/e-commerce/billing',
      },
      {
        key: 'invoices',
        label: 'Invoices',
        href: '/e-commerce/invoices',
      },
      {
        key: 'single-invoice',
        label: 'Single Invoice',
        href: '/e-commerce/single-invoice',
      },
      {
        key: 'create-invoice',
        label: 'Create Invoice',
        href: '/e-commerce/create-invoice',
      },
      {
        key: 'transactions',
        label: 'Transactions',
        href: '/e-commerce/transactions',
      },
      {
        key: 'single-transaction',
        label: 'Single Transaction',
        href: '/e-commerce/single-transaction',
      },
    ],
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [current, setCurrent] = useState<string[]>([]);
  const [openKey, setOpenKey] = useState<string[]>([]);

  const isSuperAdmin = useIsSuperAdmin();
  const isSellerAdmin = useIsSellerAdmin();

  const [filterLinks, setFilterLinks] = useState(links ?? ([] as any));

  useEffect(() => {
    if (isSuperAdmin) {
      const filters = links.filter((item) => !SUPER_ADMIN_BLOCKED_MODULE.includes(item.label));
      setFilterLinks(filters ?? []);
    }
    if (isSellerAdmin) {
      const filters = links.filter((item) => !ADMIN_BLOCKED_MODULE.includes(item.label));
      setFilterLinks(filters ?? []);
    }

    const segments = pathname.split('/').slice(1);

    setCurrent(segments);
    setOpenKey(segments.length === 1 ? [] : segments.slice(0, -1));
  }, [pathname, isSuperAdmin, isSellerAdmin]);

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
