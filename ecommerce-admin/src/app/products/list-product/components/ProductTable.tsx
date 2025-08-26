'use client';

import React, { useMemo, useState } from 'react';
import { TableProps } from 'antd';
import CommonTable from '@/app/components/table/CommonTable';
import useModalHandler from '@/hooks/useModalHandler';
import { PagingRequest } from '@/common/type';
import { ActionItem } from './ActionItem';
import TableAction from '@/app/components/table/TableAction';
import ProductTableHeader from './ProductTableHeader';
import Link from 'next/link';
import { IProductResponse } from '@/services/product';
import DeleteProductModal from './DeleteProductModal';

const COLUMNS: TableProps['columns'] = [
  {
    title: 'No.',
    dataIndex: 'order',
    key: 'order',
    width: 40,
  },
  {
    title: 'Product ID',
    dataIndex: 'id',
    key: 'id',
    width: '25%',
    render: (value) => <Link href={`/product/${value}`}>{value}</Link>,
  },
  {
    title: 'Product Name',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
  },
  {
    title: 'Price',
    dataIndex: 'formatPrice',
    key: 'price',
  },
  {
    title: 'Stock',
    dataIndex: 'stockQuantity',
    key: 'stockQuantity',
  },
  {
    title: 'Rating',
    dataIndex: 'rating',
    key: 'rating',
    sorter: true,
  },
  {
    title: 'Sold',
    dataIndex: 'soldCount',
    key: 'soldCount',
    sorter: true,
  },
];

type Props = {
  list: IProductResponse[];
  total: number;
  params: PagingRequest;
  loading: boolean;
  deletingProduct: boolean;
  setParams: (v: PagingRequest) => void;
  onDeleteProduct: (productId: string) => Promise<void>;
} & TableProps;

const ProductTable: React.FC<Props> = ({
  list,
  total,
  params,
  setParams,
  loading,
  deletingProduct,
  onDeleteProduct,
  ...props
}) => {
  const { open, toggleModal } = useModalHandler();
  const [selectedRow, setSelectedRow] = useState<IProductResponse>();

  const handleDeleteProduct = (record: IProductResponse) => () => {
    setSelectedRow(record);
    toggleModal();
  };

  const handleConfirmDeleteProduct = () => {
    if (selectedRow) {
      onDeleteProduct(selectedRow.id);
    }
  };

  const actionColumn = useMemo(() => {
    return {
      title: '',
      key: 'action',
      render: (_: any, record: any) => {
        return (
          <TableAction
            content={<ActionItem record={record} onDeleteProduct={handleDeleteProduct} />}
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
        loading={loading}
        scroll={{
          y: 'calc(100vh - 390px)',
        }}
        title={() => <ProductTableHeader params={params} setParams={setParams} />}
        {...props}
      />
      {open && (
        <DeleteProductModal
          open={open}
          onClose={toggleModal}
          onDeleteProduct={handleConfirmDeleteProduct}
          loading={deletingProduct}
        />
      )}
    </>
  );
};

export default ProductTable;
