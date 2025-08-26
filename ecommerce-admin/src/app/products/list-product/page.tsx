'use client';

import { PagingRequest } from '@/common/type';
import { useDeleteProduct } from '@/hooks/reactQuery/product/useDeleteProduct';
import { useGetAllProductsOfShop } from '@/hooks/reactQuery/product/useGetAllProducts';
import { useRefetchTableData } from '@/hooks/useFetchingDataHandler';
import { useUserDetailValueClient } from '@/recoil/atoms/userDetailAtom';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import ProductTable from './components/ProductTable';
import { showErrorMessage, showSuccessMessage } from '@/utils/alert';

const Page = () => {
  const searchParams = useSearchParams();
  const [params, setParams] = useState<PagingRequest>({
    pageSize: Number(searchParams.get('pageSize') ?? 10),
    pageIndex: Number(searchParams.get('pageIndex') ?? 1),
    orderBy: searchParams.get('orderBy') ?? undefined,
    searchKey: searchParams.get('searchKey') ?? undefined,
  });

  const userDetail = useUserDetailValueClient();

  const { data, isFetching, refetch } = useGetAllProductsOfShop(
    userDetail?.shop.id as string,
    params,
  );
  const { mutateAsync: deleteProductMutate, isPending: isDeletingProduct } = useDeleteProduct();

  useRefetchTableData<PagingRequest>({
    params,
    setParams,
    refetch,
  });

  const handleDeleteProduct = async (productId: string) => {
    try {
      const result = await deleteProductMutate(productId);
      showSuccessMessage('Delete Product', result.message);
      refetch();
    } catch (error: any) {
      if (!(error as any).data.errors) {
        showErrorMessage('Delete Product', (error as any).data.message);
      }
    }
  };

  return (
    <div>
      <ProductTable
        list={data?.data ?? []}
        total={data?.totalItems ?? 0}
        params={params}
        setParams={setParams}
        loading={isFetching}
        deletingProduct={isDeletingProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
};

export default Page;
