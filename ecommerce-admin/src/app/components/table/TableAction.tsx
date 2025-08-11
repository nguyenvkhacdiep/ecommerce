'use client';

import React, { ReactNode, useState } from 'react';
import { Button, Popover, PopoverProps } from 'antd';
import MenuIcon from '/public/menu-icon.svg';

const TableAction: React.FC<PopoverProps & { icon?: ReactNode; onClick?: () => void }> = ({
  content,
  icon = <MenuIcon />,
  onClick,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };

  const node = typeof content === 'function' ? content() : content;

  return (
    <Popover
      open={open}
      content={<div onClick={hide}>{node}</div>}
      title={null}
      arrow={false}
      placement="bottomRight"
      trigger="click"
      onOpenChange={setOpen}
      {...props}
    >
      <Button icon={icon} type="text" onClick={onClick}></Button>
    </Popover>
  );
};

export default TableAction;
