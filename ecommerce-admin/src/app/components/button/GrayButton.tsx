'use client';

import React from 'react';
import { Button, ButtonProps, ConfigProvider } from 'antd';
import { AppColor } from '@/styles/color';

const GrayButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultColor: AppColor.Gray900,
            defaultHoverColor: AppColor.Gray800,
            defaultBg: AppColor.Gray200,
            defaultHoverBg: AppColor.Gray200,
            defaultBorderColor: 'transparent',
            defaultHoverBorderColor: 'transparent',
            defaultActiveBorderColor: 'transparent',
            fontWeight: 450,
          },
        },
      }}
    >
      <Button {...props}>{children}</Button>
    </ConfigProvider>
  );
};

export default GrayButton;
