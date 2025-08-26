import DangerActionButton from '@/app/components/button/DangerActionButton';
import UpdateActionButton from '@/app/components/button/UpdateActionButton';
import { FC } from 'react';
import { IUserResponse } from '@/services/auth';
import UserTableActionButton from '../../components/table/TableActionButton';
import { ShoppingCartOutlined } from '@ant-design/icons';

type ActionItemProp = {
  record: IUserResponse;
  onDeleteAccount: (user: IUserResponse) => void;
  onInactiveUser: (userId: string) => void;
  onCreateShop: (userId: string) => void;
};

export const ActionItem: FC<ActionItemProp> = ({
  record,
  onDeleteAccount,
  onInactiveUser,
  onCreateShop,
}) => {
  return !!record ? (
    <div className="gap-3 flex flex-col">
      <UpdateActionButton href={`/account/${record?.id}?isEdit=true`}>Update</UpdateActionButton>
      {record.isActive && (
        <UserTableActionButton onClick={() => onInactiveUser(record.id)}>
          Inactive
        </UserTableActionButton>
      )}
      {record.role.name === 'Shop' && !record.shop && (
        <UserTableActionButton
          icon={<ShoppingCartOutlined className="text-xl" />}
          onClick={() => onCreateShop(record.id)}
        >
          Create Shop
        </UserTableActionButton>
      )}
      <DangerActionButton onClick={() => onDeleteAccount(record)}>Delete</DangerActionButton>
    </div>
  ) : null;
};
