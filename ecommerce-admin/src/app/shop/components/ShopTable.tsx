'use client';

import React, { useMemo, useState } from 'react';
import { TableProps } from 'antd';
import CommonTable from '@/app/components/table/CommonTable';
import { PagingRequest } from '@/common/type';
import { ActionItem } from './ActionItem';
import TableAction from '@/app/components/table/TableAction';
import ShopTableHeader from './ShopTableHeader';
import Link from 'next/link';
import ShopTag from './ShopTag';
import { IShopResponse } from '@/services/shop';
import useModalHandler from '@/hooks/useModalHandler';
import DeleteShopModal from '@/app/account/components/DeleteShopModal';

const COLUMNS: TableProps['columns'] = [
  {
    title: 'No.',
    dataIndex: 'order',
    key: 'order',
    width: 40,
  },
  {
    title: 'Shop ID',
    dataIndex: 'id',
    key: 'id',
    width: '20%',
    render: (value) => <Link href={`/shop/list-shop/${value}`}>{value}</Link>,
  },
  {
    title: 'Shop',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
  },
  {
    title: 'Phone Number',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    sorter: true,
  },
  {
    title: 'Follows',
    dataIndex: 'followerCount',
    key: 'followerCount',
    sorter: true,
  },
  {
    title: 'Rating',
    dataIndex: 'rating',
    key: 'rating',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    sorter: true,
    render: (value) => <ShopTag type={value} />,
  },
];

type Props = {
  list: IShopResponse[];
  total: number;
  params: PagingRequest;
  loading?: boolean;
  deletingShop?: boolean;
  setParams: (v: PagingRequest) => void;
  onDeleteShop: (shopId: string) => Promise<void>;
} & TableProps;

const ShopTable: React.FC<Props> = ({
  list,
  total,
  params,
  setParams,
  loading,
  deletingShop = false,
  onDeleteShop,
  ...props
}) => {
  const { open, toggleModal } = useModalHandler();
  const [selectedRow, setSelectedRow] = useState<IShopResponse>();

  const onDeleteShopTable = (record: IShopResponse) => {
    toggleModal();
    setSelectedRow(record);
  };

  const handleDeleteShop = async () => {
    if (selectedRow) {
      await onDeleteShop(selectedRow.id);
      toggleModal();
    }
  };

  const actionColumn = useMemo(() => {
    return {
      title: '',
      key: 'action',
      render: (_: any, record: any) => {
        return (
          <TableAction
            content={<ActionItem record={record} onDeleteShop={onDeleteShopTable} />}
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
        loading={loading}
        columns={columns}
        dataSource={convertList}
        total={total}
        params={params}
        setParams={setParams}
        scroll={{
          y: 'calc(100vh - 390px)',
        }}
        title={() => <ShopTableHeader params={params} setParams={setParams} />}
        {...props}
      />
      {open && (
        <DeleteShopModal
          open={open}
          onClose={toggleModal}
          onDeleteShop={handleDeleteShop}
          loading={deletingShop}
        />
      )}
    </>
  );
};

export default ShopTable;
