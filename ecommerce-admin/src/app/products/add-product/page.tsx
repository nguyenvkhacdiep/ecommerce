'use client';

import { useGetAllCategoriesOfShop } from '@/hooks/reactQuery/category/useGetCategoryOfShop';
import { useUserDetailValueClient } from '@/recoil/atoms/userDetailAtom';
import { useTransformOptions } from '@/utils/common';
import { Form } from 'antd';
import React, { useState } from 'react';
import AddProductForm from './components/AddProductForm';
import { useCreateProduct } from '@/hooks/reactQuery/product/useCreateProduct';
import Title from './components/Title';
import { showErrorMessage, showSuccessMessage } from '@/utils/alert';
import { useRouter } from 'next/navigation';
import { ICreateProductPayload } from '@/services/product';

const Page = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const userDetail = useUserDetailValueClient();

  const [error, setError] = useState<Error | null>(null);

  const { mutateAsync, isPending, isSuccess } = useCreateProduct();
  const { data: allCategories } = useGetAllCategoriesOfShop(userDetail?.shop.id as string);

  const categories = useTransformOptions(allCategories?.data, 'id', 'name');

  const handleCreateProduct = async (payload: ICreateProductPayload) => {
    try {
      await mutateAsync({ ...payload, shopId: userDetail?.shop.id as string });
      showSuccessMessage('Add Product', 'Product added successfully.');
      router.push('/products/list-product');
    } catch (error: any) {
      if (!(error as any).data.errors) {
        showErrorMessage('Add Product', (error as any).data.message);
      } else {
        setError(error);
      }
    }
  };

  return (
    <div className="w-full h-screen">
      <Title />
      <div className="flex ml-8 mt-12 bg-white p-8 rounded-2xl w-fit">
        <AddProductForm
          form={form}
          onSuccess={isSuccess}
          error={error}
          loading={isPending}
          onSubmit={handleCreateProduct}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default Page;
