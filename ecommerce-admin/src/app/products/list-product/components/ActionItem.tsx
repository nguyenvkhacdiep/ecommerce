import DangerActionButton from '@/app/components/button/DangerActionButton';
import UpdateActionButton from '@/app/components/button/UpdateActionButton';
import TableActionButton from '@/app/components/table/TableActionButton';
import { IProductResponse } from '@/services/product';
import { FC } from 'react';

type ActionItemProp = {
  record: IProductResponse;
  onDeleteProduct: (product: IProductResponse) => void;
};

export const ActionItem: FC<ActionItemProp> = ({ record, onDeleteProduct }) => {
  return !!record ? (
    <div className="gap-3 flex flex-col">
      <UpdateActionButton href={`/products/list-product/${record?.id}?isEdit=true`}>
        Update
      </UpdateActionButton>
      <TableActionButton>Out of stock</TableActionButton>
      <DangerActionButton onClick={() => onDeleteProduct(record)}>Delete</DangerActionButton>
    </div>
  ) : null;
};
