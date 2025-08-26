'use client';

import { useGetProduct } from '@/hooks/reactQuery/product/useGetProduct';
import { useUpdateProduct } from '@/hooks/reactQuery/product/useUpdateProduct';
import { IEditProductPayload } from '@/services/product';
import { showErrorMessage, showSuccessMessage } from '@/utils/alert';
import { Form } from 'antd';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import Title from './components/Title';
import AddProductForm from '../../add-product/components/AddProductForm';
import { useGetAllCategoriesOfShop } from '@/hooks/reactQuery/category/useGetCategoryOfShop';
import { useUserDetailValueClient } from '@/recoil/atoms/userDetailAtom';
import { useTransformOptions } from '@/utils/common';

const Page = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const { id } = useParams();
  const isEdit = searchParams.get('isEdit');
  const [error, setError] = useState<Error | null>(null);
  const userDetail = useUserDetailValueClient();

  const { data, refetch } = useGetProduct(id as string);
  const { mutateAsync, isPending, isSuccess } = useUpdateProduct();
  const { data: allCategories } = useGetAllCategoriesOfShop(userDetail?.shop.id as string);

  const categories = useTransformOptions(allCategories?.data, 'id', 'name');

  const handleBack = () => {
    if (isEdit) {
      router.push(`/products/list-product/${id}`);
      return;
    }
    router.push('/products/list-product');
  };

  const handleUpdateProduct = async (payload: IEditProductPayload) => {
    try {
      const result = await mutateAsync({ productId: id as string, payload });

      showSuccessMessage('Update Product', result.message);
      refetch();
      router.push(`/products/list-product/${id}`);
    } catch (error: any) {
      if (!(error as any).data.errors) {
        showErrorMessage('Update Product', (error as any).data.message);
      } else {
        setError(error);
      }
    }
  };

  return (
    <div>
      <Title handleBack={handleBack} isEdit={!!isEdit} />
      <div className="flex ml-8 mt-12 bg-white p-8 rounded-2xl w-fit">
        <AddProductForm
          form={form}
          error={error}
          loading={isPending}
          onSubmit={handleUpdateProduct}
          onlyView={!isEdit}
          product={data}
          categories={categories}
          onSuccess={isSuccess}
        />
      </div>
    </div>
  );
};

export default Page;
