import CommonTag from '@/app/components/tag/CommonTag';
import React from 'react';

type props = {
  type: 0 | 1 | 2;
};

const ShopTag: React.FC<props> = ({ type }) => {
  let color = 'magenta';
  let text = 'Unknown';

  switch (type) {
    case 0:
      color = 'green';
      text = 'Normal';
      break;
    case 1:
      color = 'blue';
      text = 'Favorite';
      break;
    case 2:
      color = 'red';
      text = 'Mall';
      break;
  }

  return <CommonTag color={color}>{text}</CommonTag>;
};

export default ShopTag;
