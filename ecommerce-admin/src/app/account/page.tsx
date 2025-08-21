'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PagingRequest } from '@/common/type';
import { useGetAllUsers } from '@/hooks/reactQuery/user/useGetAllUsers';
import { useRefetchTableData } from '@/hooks/useFetchingDataHandler';
import AccountTable from './components/AccountTable';
import { useInactiveUser } from '@/hooks/reactQuery/user/useInactiveUser';
import { showErrorMessage, showSuccessMessage } from '@/utils/alert';
import { useDeleteUser } from '@/hooks/reactQuery/user/useDeleteUser';

const Page = () => {
  const searchParams = useSearchParams();
  const [params, setParams] = useState<PagingRequest>({
    pageSize: Number(searchParams.get('pageSize') ?? 10),
    pageIndex: Number(searchParams.get('pageIndex') ?? 1),
    orderBy: searchParams.get('orderBy') ?? undefined,
    searchKey: searchParams.get('searchKey') ?? undefined,
  });

  const { data, isFetching, refetch } = useGetAllUsers(params);
  const { mutateAsync: inactiveUserMutate } = useInactiveUser();
  const { mutateAsync: deleteUserMutate, isPending: isDeleting } = useDeleteUser();

  useRefetchTableData<PagingRequest>({
    params,
    setParams,
    refetch,
  });

  const handleInactiveUser = async (userId: string) => {
    try {
      const result = await inactiveUserMutate(userId);
      showSuccessMessage('Inactive User', result.message);
      refetch();
    } catch (error: any) {
      if (!(error as any).data.errors) {
        showErrorMessage('Inactive User', (error as any).data.message);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const result = await deleteUserMutate(userId);
      showSuccessMessage('Delete User', result.message);
      refetch();
    } catch (error: any) {
      if (!(error as any).data.errors) {
        showErrorMessage('Delete User', (error as any).data.message);
      }
    }
  };

  return (
    <div>
      <AccountTable
        list={data?.data ?? []}
        total={data?.totalItems ?? 0}
        params={params}
        setParams={setParams}
        loading={isFetching}
        deleting={isDeleting}
        onInactiveUser={handleInactiveUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default Page;
