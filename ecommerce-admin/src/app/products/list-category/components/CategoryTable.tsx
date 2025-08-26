'use client';

import React, { useMemo, useState } from 'react';
import { TableProps } from 'antd';
import CommonTable from '@/app/components/table/CommonTable';
import useModalHandler from '@/hooks/useModalHandler';
import { PagingRequest } from '@/common/type';
import { ActionItem } from './ActionItem';
import TableAction from '@/app/components/table/TableAction';
import Link from 'next/link';
import DeleteCategoryModal from './DeleteCategoryModal';
import { ICategoryResponse } from '@/services/category';
import CategoryTableHeader from './CategoryTableHeader';

const COLUMNS: TableProps['columns'] = [
  {
    title: 'No.',
    dataIndex: 'order',
    key: 'order',
    width: 40,
  },
  {
    title: 'Category ID',
    dataIndex: 'id',
    key: 'id',
    width: '25%',
    render: (value) => <Link href={`/products/list-category/${value}`}>{value}</Link>,
  },
  {
    title: 'Category Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Products',
    key: 'products',
    render: (_, record) => (
      <Link href={`/products/list-product?categoryId=${record.id}`}>View Products</Link>
    ),
  },
];

type Props = {
  list: ICategoryResponse[];
  total: number;
  loading: boolean;
  deletingCategory: boolean;
  params: PagingRequest;
  setParams: (v: PagingRequest) => void;
  onDeleteCategory: (CategoryId: string) => Promise<void>;
} & TableProps;

const CategoryTable: React.FC<Props> = ({
  list,
  total,
  loading,
  params,
  setParams,
  deletingCategory,
  onDeleteCategory,
  ...props
}) => {
  const { open, toggleModal } = useModalHandler();
  const [selectedRow, setSelectedRow] = useState<ICategoryResponse>();

  const handleDeleteCategory = (record: ICategoryResponse) => {
    setSelectedRow(record);
    toggleModal();
  };

  const handleConfirmDeleteCategory = () => {
    if (selectedRow) {
      onDeleteCategory(selectedRow.id);
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
            content={<ActionItem record={record} onDeleteCategory={handleDeleteCategory} />}
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
        loading={loading}
        params={params}
        setParams={setParams}
        title={() => <CategoryTableHeader params={params} setParams={setParams} />}
        scroll={{
          y: 'calc(100vh - 390px)',
        }}
        pagination={false}
        {...props}
      />
      {open && (
        <DeleteCategoryModal
          open={open}
          onClose={toggleModal}
          onDeleteCategory={handleConfirmDeleteCategory}
          loading={deletingCategory}
        />
      )}
    </>
  );
};

export default CategoryTable;
