import { Tag, TagProps } from 'antd';
import React from 'react';

type ICommonTagProps = TagProps;

const CommonTag: React.FC<ICommonTagProps> = ({ children, ...props }) => {
  return <Tag {...props}> {children}</Tag>;
};

export default CommonTag;
