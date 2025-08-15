'use client';

import { Dropdown, DropDownProps, MenuProps } from 'antd';
import React from 'react';

type CommonDropdownProps = DropDownProps & {
  items: MenuProps['items'];
};

const CommonDropdown: React.FC<CommonDropdownProps> = ({ children, items, ...props }) => {
  return (
    <Dropdown arrow={true} menu={{ items }} {...props}>
      {children}
    </Dropdown>
  );
};

export default CommonDropdown;
