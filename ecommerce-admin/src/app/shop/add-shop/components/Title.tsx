import { LeftOutlined } from '@ant-design/icons';
import React from 'react';

type Props = {
  handleBack: () => void;
};

const Title: React.FC<Props> = ({ handleBack }) => {
  return (
    <div>
      <span>
        <LeftOutlined className="font-semibold text-xl cursor-pointer" onClick={handleBack} />
      </span>
      <span className="font-bold text-2xl leading-0">Create Shop</span>
    </div>
  );
};

export default Title;
