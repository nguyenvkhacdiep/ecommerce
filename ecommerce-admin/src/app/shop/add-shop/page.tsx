'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Title from './components/Title';
import { Form } from 'antd';
import { useAddShop } from '@/hooks/reactQuery/shop/useAddShop';
import { IShopCreatePayload } from '@/services/shop';
import { showErrorMessage, showSuccessMessage } from '@/utils/alert';
import AddShopForm from './components/AddShopForm';
import { selectedUserDetailAtom } from '@/recoil/atoms/userDetailAtom';
import { useGetUser } from '@/hooks/reactQuery/user/useGetUser';
import { useSetRecoilState } from 'recoil';

const Page = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const setUserDetail = useSetRecoilState(selectedUserDetailAtom);

  const userId = searchParams.get('userId');

  const { refetch } = useGetUser(userId as string, false);
  const { mutateAsync, isPending } = useAddShop();

  const [error, setError] = useState<Error | null>(null);

  const handleBack = () => {
    router.push('/shop');
  };

  const handleCreateShop = async (payload: IShopCreatePayload) => {
    try {
      const data = {
        ...payload,
        userId: userId as string,
      };
      await mutateAsync(data);
      const result = await refetch();

      setUserDetail(result.data as any);
      showSuccessMessage('Add Shop', 'Shop added successfully.');
      if (result.data?.role?.name === 'Shop') {
        router.push('/dashboard');
      } else {
        handleBack();
      }
    } catch (error: any) {
      if (!(error as any).data.errors) {
        showErrorMessage('Add Shop', (error as any).data.message);
      } else {
        setError(error);
      }
    }
  };

  return (
    <div className="w-full h-screen">
      <Title handleBack={handleBack} />
      <div className="flex ml-8 mt-12 bg-white p-8 rounded-2xl w-fit">
        <AddShopForm form={form} error={error} loading={isPending} onSubmit={handleCreateShop} />
      </div>
    </div>
  );
};

export default Page;
