'use client';

import React, { useState } from 'react';
import Title from './components/Title';
import AddCategoryForm from './components/AddCategoryForm';
import { useRouter } from 'next/navigation';
import { Form } from 'antd';
import { useUserDetailValueClient } from '@/recoil/atoms/userDetailAtom';
import { useCreateCategory } from '@/hooks/reactQuery/category/useCreateCategory';
import { ICreateCategoryPayload } from '@/services/category';
import { showErrorMessage, showSuccessMessage } from '@/utils/alert';

const Page = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const userDetail = useUserDetailValueClient();
  const [error, setError] = useState<Error | null>(null);

  const { mutateAsync, isPending } = useCreateCategory();

  const handleBack = () => {
    router.push('/products/list-category');
  };

  const handleCreateCategory = async (payload: ICreateCategoryPayload) => {
    try {
      const data = {
        ...payload,
        shopId: userDetail?.shop?.id as string,
      };
      await mutateAsync(data);
      showSuccessMessage('Add Category', 'Category added successfully.');
      handleBack();
    } catch (error: any) {
      if (!(error as any).data.errors) {
        showErrorMessage('Add Category', (error as any).data.message);
      } else {
        setError(error);
      }
    }
  };

  return (
    <div className="w-full h-screen">
      <Title handleBack={handleBack} />
      <div className="flex ml-8 mt-12 bg-white p-8 rounded-2xl w-fit">
        <AddCategoryForm
          form={form}
          error={error}
          loading={isPending}
          onSubmit={handleCreateCategory}
        />
      </div>
    </div>
  );
};

export default Page;
