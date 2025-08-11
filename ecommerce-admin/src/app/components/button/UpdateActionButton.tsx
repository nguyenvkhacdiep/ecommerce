'use client';

import React from 'react';
import { Button, ButtonProps, ConfigProvider } from 'antd';
import PencilIcon from '/public/pencil-icon.svg';
import { withLink } from './withLink';

const UpdateActionButton: React.FC<ButtonProps> = ({ children, ...props }) => {
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
        icon={<PencilIcon />}
        {...props}
      >
        {children}
      </Button>
    </ConfigProvider>
  );
};

export default withLink<ButtonProps>(UpdateActionButton);
