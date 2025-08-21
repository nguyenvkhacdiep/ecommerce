'use client';

import React, { useState } from 'react';
import Title from './components/Title';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Form } from 'antd';
import { useGetShop } from '@/hooks/reactQuery/shop/useGetShop';
import { useUpdateShop } from '@/hooks/reactQuery/shop/useUpdateShop';
import AddShopForm from '../add-shop/components/AddShopForm';
import { showErrorMessage, showSuccessMessage } from '@/utils/alert';
import { IShopEditPayload } from '@/services/shop';

const Page = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const { id } = useParams();
  const isEdit = searchParams.get('isEdit');
  const [error, setError] = useState<Error | null>(null);

  const { data, refetch } = useGetShop(id as string);
  const { mutateAsync, isPending } = useUpdateShop();

  const handleBack = () => {
    router.push('/shop');
  };

  const handleUpdateShop = async (payload: IShopEditPayload) => {
    try {
      const result = await mutateAsync({ shopId: id as string, payload });

      showSuccessMessage('Update Shop', result.message);
      refetch();
      router.push(`/shop/${id}`);
    } catch (error: any) {
      if (!(error as any).data.errors) {
        showErrorMessage('Update Shop', (error as any).data.message);
      } else {
        setError(error);
      }
    }
  };

  return (
    <div>
      <Title handleBack={handleBack} isEdit={!!isEdit} />
      <div className="flex ml-8 mt-12 bg-white p-8 rounded-2xl w-fit">
        <AddShopForm
          form={form}
          error={error}
          loading={isPending}
          onSubmit={handleUpdateShop}
          onlyView={!isEdit}
          shop={data}
        />
      </div>
    </div>
  );
};

export default Page;
