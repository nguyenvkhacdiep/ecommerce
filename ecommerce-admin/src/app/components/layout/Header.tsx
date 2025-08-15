import { useUserDetailValueClient } from '@/recoil/atoms/userDetailAtom';
import { BellOutlined } from '@ant-design/icons';
import Image from 'next/image';
import React, { useMemo } from 'react';
import CommonDropdown from '../dropdown/CommonDropdown';
import { Badge, Divider, MenuProps, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const Header = () => {
  const userDetail = useUserDetailValueClient();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    cookies.remove('authToken');
    router.push('/login');
  };

  const handleEditUserClick = () => {
    router.push(`/account/${userDetail?.id}?isEdit=true`);
  };

  const items: MenuProps['items'] = useMemo(
    () => [
      {
        label: <span className="font-semibold">Edit profile</span>,
        key: '1',
        onClick: handleEditUserClick,
        disabled: userDetail?.role.name === 'Super Admin',
      },
      {
        label: <span className="font-semibold">Support</span>,
        key: '2',
      },
      {
        type: 'divider',
      },
      {
        label: <span className="font-semibold">Log out</span>,
        key: '3',
        onClick: handleLogout,
      },
    ],
    [],
  );

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
  };

  return (
    <div className="flex justify-end items-center gap-3 px-8 py-2 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <Badge count={5} className="cursor-pointer">
        <span>
          <BellOutlined className="text-2xl" />
        </span>
      </Badge>

      <span></span>

      <CommonDropdown
        items={items}
        trigger={['click']}
        popupRender={(menu) => (
          <div className="bg-white rounded-lg shadow-xl px-2">
            <Space style={{ padding: 8 }}>
              <div className="flex flex-col">
                <span className="font-medium text-lg">{userDetail?.username}</span>
                <span>{userDetail?.email}</span>
              </div>
            </Space>
            <Divider style={{ margin: 0 }} />
            {React.cloneElement(
              menu as React.ReactElement<{
                style: React.CSSProperties;
              }>,
              { style: menuStyle },
            )}
          </div>
        )}
      >
        <span className="flex items-center gap-2 cursor-pointer">
          <span className="relative w-[45px] h-[45px] overflow-hidden rounded-full">
            {userDetail?.urlAvatar ? (
              <Image
                src={userDetail.urlAvatar}
                alt={userDetail.username}
                fill
                className="object-cover"
              />
            ) : (
              <span
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #111 0%, #222 40%, #0ea5e9 110%)',
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                {userDetail?.username?.slice(0, 1).toUpperCase()}
              </span>
            )}
          </span>
          <span className="font-semibold text-base">{userDetail?.username}</span>
        </span>
      </CommonDropdown>
    </div>
  );
};

export default Header;
