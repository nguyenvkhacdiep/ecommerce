'use client';

import React, { useState } from 'react';
import Title from './components/Title';
import AddCategoryForm from '../../add-category/components/AddCategoryForm';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Form } from 'antd';
import { useGetCategory } from '@/hooks/reactQuery/category/useGetCategory';
import { useEditCategory } from '@/hooks/reactQuery/category/useEditCategory';
import { IEditCategoryPayload } from '@/services/category';
import { showErrorMessage, showSuccessMessage } from '@/utils/alert';

const Page = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const { id } = useParams();
  const isEdit = searchParams.get('isEdit');
  const [error, setError] = useState<Error | null>(null);

  const { data, refetch } = useGetCategory(id as string);
  const { mutateAsync, isPending } = useEditCategory();

  const handleBack = () => {
    if (isEdit) {
      router.push(`/products/list-category/${id}`);
      return;
    }

    router.push('/products/list-category');
  };

  const handleUpdateCategory = async (payload: IEditCategoryPayload) => {
    try {
      const result = await mutateAsync({ categoryId: id as string, payload });

      showSuccessMessage('Update Category', result.message);
      refetch();
      router.push(`/products/list-category/${id}`);
    } catch (error: any) {
      if (!(error as any).data.errors) {
        showErrorMessage('Update Category', (error as any).data.message);
      } else {
        setError(error);
      }
    }
  };

  return (
    <div>
      <Title handleBack={handleBack} isEdit={!!isEdit} />
      <div className="flex ml-8 mt-12 bg-white p-8 rounded-2xl w-fit">
        <AddCategoryForm
          form={form}
          error={error}
          loading={isPending}
          onSubmit={handleUpdateCategory}
          onlyView={!isEdit}
          category={data}
        />
      </div>
    </div>
  );
};

export default Page;
