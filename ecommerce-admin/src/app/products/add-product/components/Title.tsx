import { LeftOutlined } from '@ant-design/icons';
import React from 'react';

const Title: React.FC = () => {
  return (
    <div>
      <span>
        <LeftOutlined className="font-semibold text-xl " />
      </span>
      <span className="font-bold text-2xl leading-0">Create Product</span>
    </div>
  );
};

export default Title;
