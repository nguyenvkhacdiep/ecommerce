'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PagingRequest } from '@/common/type';
import { useGetAllUsers } from '@/hooks/reactQuery/user/useGetAllUsers';
import { useRefetchTableData } from '@/hooks/useFetchingDataHandler';
import AccountTable from './components/AccountTable';

const Page = () => {
  const searchParams = useSearchParams();
  const [params, setParams] = useState<PagingRequest>({
    pageSize: Number(searchParams.get('pageSize') ?? 10),
    pageIndex: Number(searchParams.get('pageIndex') ?? 1),
    orderBy: searchParams.get('orderBy') ?? undefined,
    searchKey: searchParams.get('searchKey') ?? undefined,
  });

  const { data, isFetching, refetch } = useGetAllUsers(params);

  useRefetchTableData<PagingRequest>({
    params,
    setParams,
    refetch,
  });

  return (
    <div>
      <div>
        <AccountTable
          list={data?.data ?? []}
          total={data?.totalItems ?? 0}
          params={params}
          setParams={setParams}
          loading={isFetching}
        />
      </div>
    </div>
  );
};

export default Page;
