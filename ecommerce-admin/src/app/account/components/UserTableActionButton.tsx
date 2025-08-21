'use client';

import React from 'react';
import { Button, ButtonProps, ConfigProvider } from 'antd';
import PencilIcon from '/public/pencil-icon.svg';

type props = ButtonProps & {
  icon?: React.ReactNode;
};

const UserTableActionButton: React.FC<props> = ({ children, icon = <PencilIcon />, ...props }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            fontWeight: 450,
            paddingContentHorizontal: 0,
          },
        },
      }}
    >
      <Button
        style={{ width: 138, justifyContent: 'flex-start' }}
        type="text"
        icon={icon}
        {...props}
      >
        {children}
      </Button>
    </ConfigProvider>
  );
};

export default UserTableActionButton;
