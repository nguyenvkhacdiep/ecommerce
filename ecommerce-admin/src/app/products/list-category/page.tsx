'use client';

import React, { useState } from 'react';
import CategoryTable from './components/CategoryTable';
import { useUserDetailValueClient } from '@/recoil/atoms/userDetailAtom';
import { useGetAllCategoriesOfShop } from '@/hooks/reactQuery/category/useGetCategoryOfShop';
import { useDeleteCategory } from '@/hooks/reactQuery/category/useDeleteCategory';
import { showErrorMessage, showSuccessMessage } from '@/utils/alert';
import { useSearchParams } from 'next/navigation';
import { PagingRequest } from '@/common/type';

const Page = () => {
  const userDetail = useUserDetailValueClient();

  const searchParams = useSearchParams();
  const [params, setParams] = useState<PagingRequest>({
    pageSize: 1000,
    pageIndex: 1,
    orderBy: searchParams.get('orderBy') ?? undefined,
    searchKey: searchParams.get('searchKey') ?? undefined,
  });

  const { data, isFetching, refetch } = useGetAllCategoriesOfShop(
    userDetail?.shop.id as string,
    params,
  );
  const { mutateAsync: deleteCategoryMutate, isPending: isDeletingCategory } = useDeleteCategory();

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const result = await deleteCategoryMutate(categoryId);
      showSuccessMessage('Delete Category', result.message);
      refetch();
    } catch (error: any) {
      if (!(error as any).data.errors) {
        showErrorMessage('Delete Category', (error as any).data.message);
      }
    }
  };

  return (
    <div>
      <CategoryTable
        list={data?.data ?? []}
        total={data?.totalItems ?? 0}
        params={params}
        setParams={setParams}
        loading={isFetching}
        deletingCategory={isDeletingCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
};

export default Page;
