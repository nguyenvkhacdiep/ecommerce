'use client';

import React from 'react';
import { Button, ButtonProps, ConfigProvider } from 'antd';
import { AppColor } from '@/styles/color';

const DangerActionButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultColor: AppColor.Red600,
            defaultHoverColor: AppColor.Red600,
            defaultBg: AppColor.Red200,
            defaultHoverBg: AppColor.Red200,
            defaultBorderColor: 'transparent',
            defaultHoverBorderColor: 'transparent',
            defaultActiveBorderColor: 'transparent',
            fontWeight: 450,
          },
        },
      }}
    >
      <Button style={{ width: 138 }} {...props}>
        {children}
      </Button>
    </ConfigProvider>
  );
};

export default DangerActionButton;
