import DangerActionButton from '@/app/components/button/DangerActionButton';
import UpdateActionButton from '@/app/components/button/UpdateActionButton';
import { FC } from 'react';
import InactiveUserButton from './InactiveUserButton';
import { IUserResponse } from '@/services/auth';

type ActionItemProp = {
  record: IUserResponse;
  onDeleteAccount: (user: IUserResponse) => void;
  onInactiveUser: (userId: string) => void;
};

export const ActionItem: FC<ActionItemProp> = ({ record, onDeleteAccount, onInactiveUser }) => {
  return !!record ? (
    <div className="gap-3 flex flex-col">
      <UpdateActionButton href={`/account/${record?.id}?isEdit=true`}>Update</UpdateActionButton>
      {record.isActive && (
        <InactiveUserButton onClick={() => onInactiveUser(record.id)}>Inactive</InactiveUserButton>
      )}
      <DangerActionButton onClick={() => onDeleteAccount(record)}>Delete</DangerActionButton>
    </div>
  ) : null;
};
