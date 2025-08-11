'use client';

import React, { useMemo, useState } from 'react';
import { TableProps } from 'antd';
import CommonTable from '@/app/components/table/CommonTable';
import useModalHandler from '@/hooks/useModalHandler';
import { IUserResponse } from '@/services/auth';
import { PagingRequest } from '@/common/type';
import { ActionItem } from './ActionItem';
import CommonTag from '@/app/components/tag/CommonTag';
import TableAction from '@/app/components/table/TableAction';

const COLUMNS: TableProps['columns'] = [
  {
    title: 'No.',
    dataIndex: 'order',
    key: 'order',
    width: 40,
  },
  {
    title: 'Account ID',
    dataIndex: 'id',
    key: 'id',
    width: '20%',
    sorter: true,
  },
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
    sorter: true,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Status',
    dataIndex: 'isActive',
    key: 'isActive',
    sorter: true,
    render: (value) => (
      <CommonTag color={value ? 'success' : 'error'}>{value ? 'Active' : 'Inactive'}</CommonTag>
    ),
  },
  {
    title: 'Role',
    dataIndex: ['role', 'name'],
    key: 'role',
    sorter: true,
  },
  {
    title: 'CreatedAt',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: true,
  },
];

type Props = {
  list: IUserResponse[];
  total: number;
  params: PagingRequest;
  setParams: (v: PagingRequest) => void;
} & TableProps;

const AccountTable: React.FC<Props> = ({ list, total, params, setParams, ...props }) => {
  const { open, toggleModal } = useModalHandler();
  const [selectedRow, setSelectedRow] = useState<IUserResponse>();

  const onDeleteAccount = (record: IUserResponse) => () => {};

  const handleConfirmDeleteAccount = () => {};

  const actionColumn = useMemo(() => {
    return {
      title: '',
      key: 'action',
      render: (_: any, record: any) => {
        return (
          <TableAction
            content={<ActionItem record={record} onDeleteAccount={onDeleteAccount} />}
            trigger="click"
          />
        );
      },
      width: '4%',
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = useMemo(() => {
    return [...COLUMNS, actionColumn];
  }, [actionColumn]);

  const convertList = list.map((item, index) => ({
    key: index,
    order: index + 1,
    ...item,
  }));

  return (
    <>
      <CommonTable
        columns={columns}
        dataSource={convertList}
        total={total}
        params={params}
        setParams={setParams}
        scroll={{
          y: 'calc(100vh - 390px)',
        }}
        {...props}
      />
      {/* {!!selectedRow && (
        <DeleteAccountModal
          open={open}
          data={selectedAccountDetail}
          onCancel={toggleModal}
          onOk={handleConfirmDeleteAccount}
        />
      )} */}
    </>
  );
};

export default AccountTable;
