'use client';

import React from 'react';
import { Button, ButtonProps, ConfigProvider } from 'antd';
import { AppColor } from '@/styles/color';

const LinkButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorLink: AppColor.Gray800,
            colorLinkHover: AppColor.Gray500,
            paddingContentHorizontal: 0,
            fontWeight: 400,
          },
        },
      }}
    >
      <Button type="link" {...props}>
        {children}
      </Button>
    </ConfigProvider>
  );
};

export default LinkButton;
