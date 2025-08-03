'use client';

import React from 'react';
import { Button, ButtonProps, ConfigProvider } from 'antd';
import { AppColor } from '@/styles/color';

const PrimaryButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultColor: AppColor.White,
            defaultHoverColor: AppColor.White,
            defaultBg: AppColor.Purple500,
            defaultHoverBg: AppColor.Purple500,
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

export default PrimaryButton;
