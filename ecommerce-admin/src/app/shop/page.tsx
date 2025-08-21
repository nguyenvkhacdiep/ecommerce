'use client';

import { PagingRequest } from '@/common/type';
import { useGetAllShops } from '@/hooks/reactQuery/shop/useGetAllShops';
import { useRefetchTableData } from '@/hooks/useFetchingDataHandler';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import ShopTable from './components/ShopTable';
import { useDeleteShop } from '@/hooks/reactQuery/shop/useDeleteShop';
import { showErrorMessage, showSuccessMessage } from '@/utils/alert';

const Page = () => {
  const searchParams = useSearchParams();
  const [params, setParams] = useState<PagingRequest>({
    pageSize: Number(searchParams.get('pageSize') ?? 10),
    pageIndex: Number(searchParams.get('pageIndex') ?? 1),
    orderBy: searchParams.get('orderBy') ?? undefined,
    searchKey: searchParams.get('searchKey') ?? undefined,
  });

  const { data, isFetching, refetch } = useGetAllShops(params);
  const { mutateAsync: deleteShopMutate, isPending: isDeletingShop } = useDeleteShop();

  useRefetchTableData<PagingRequest>({
    params,
    setParams,
    refetch,
  });

  const handleDeleteShop = async (shopId: string) => {
    try {
      const result = await deleteShopMutate(shopId);
      showSuccessMessage('Delete Shop', result.message);
      refetch();
    } catch (error: any) {
      if (!(error as any).data.errors) {
        showErrorMessage('Delete Shop', (error as any).data.message);
      }
    }
  };

  return (
    <div>
      <ShopTable
        list={data?.data ?? []}
        total={data?.totalItems ?? 0}
        params={params}
        setParams={setParams}
        loading={isFetching}
        deletingShop={isDeletingShop}
        onDeleteShop={handleDeleteShop}
      />
    </div>
  );
};

export default Page;
