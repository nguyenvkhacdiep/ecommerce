import DangerActionButton from '@/app/components/button/DangerActionButton';
import UpdateActionButton from '@/app/components/button/UpdateActionButton';
import { FC } from 'react';

type ActionItemProp = {
  record: any;
  onDeleteAccount: any;
};

export const ActionItem: FC<ActionItemProp> = ({ record, onDeleteAccount }) => {
  return !!record ? (
    <div className="gap-3 flex flex-col">
      <UpdateActionButton href={`/account-management/update/${record?.accountId}`}>
        Update
      </UpdateActionButton>
      <DangerActionButton onClick={onDeleteAccount(record)}>Delete</DangerActionButton>
    </div>
  ) : null;
};
