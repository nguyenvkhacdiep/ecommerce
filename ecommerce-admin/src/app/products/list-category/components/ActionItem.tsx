import DangerActionButton from '@/app/components/button/DangerActionButton';
import UpdateActionButton from '@/app/components/button/UpdateActionButton';
import { ICategoryResponse } from '@/services/category';
import { FC } from 'react';

type ActionItemProp = {
  record: ICategoryResponse;
  onDeleteCategory: (Category: ICategoryResponse) => void;
};

export const ActionItem: FC<ActionItemProp> = ({ record, onDeleteCategory }) => {
  return !!record ? (
    <div className="gap-3 flex flex-col">
      <UpdateActionButton href={`/products/list-category/${record?.id}?isEdit=true`}>
        Update
      </UpdateActionButton>
      <DangerActionButton onClick={() => onDeleteCategory(record)}>Delete</DangerActionButton>
    </div>
  ) : null;
};
