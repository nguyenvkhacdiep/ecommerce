import DangerActionButton from '@/app/components/button/DangerActionButton';
import UpdateActionButton from '@/app/components/button/UpdateActionButton';
import { IShopResponse } from '@/services/shop';
import { FC } from 'react';

type ActionItemProp = {
  record: IShopResponse;
  onDeleteShop: (shop: IShopResponse) => void;
};

export const ActionItem: FC<ActionItemProp> = ({ record, onDeleteShop }) => {
  return !!record ? (
    <div className="gap-3 flex flex-col">
      <UpdateActionButton href={`/shop/${record?.id}?isEdit=true`}>Update</UpdateActionButton>
      <DangerActionButton onClick={() => onDeleteShop(record)}>Delete</DangerActionButton>
    </div>
  ) : null;
};
