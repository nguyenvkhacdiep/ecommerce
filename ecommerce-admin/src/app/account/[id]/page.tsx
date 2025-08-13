'use client';

import { useEditUser } from '@/hooks/reactQuery/user/useEditUser';
import { useGetUser } from '@/hooks/reactQuery/user/useGetUser';
import { Form } from 'antd';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import Title from './components/Title';
import AddUserForm from '../add-user/components/AddUserForm';
import { useGetAllRoles } from '@/hooks/reactQuery/auth/useGetAllRoles';
import { useTransformOptions } from '@/utils/common';
import { IAddUserPayload } from '@/services/user';
import { showErrorMessage, showSuccessMessage } from '@/utils/alert';

const Page = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const { id } = useParams();
  const isEdit = searchParams.get('isEdit');

  const { data, refetch } = useGetUser(id as string);
  const { data: allRoles } = useGetAllRoles();

  const { mutateAsync, isPending } = useEditUser();

  const [error, setError] = useState<Error | null>(null);

  const roles = useTransformOptions(allRoles, 'id', 'name');

  const handleBack = () => {
    router.push('/account');
  };

  const handleUpdateUser = async (payload: IAddUserPayload) => {
    try {
      const result = await mutateAsync({ userId: id as string, payload });

      showSuccessMessage('Update User', result.message);
      refetch();
      router.push(`/account/${id}`);
    } catch (error: any) {
      if (!(error as any).data.errors) {
        showErrorMessage('Update User', (error as any).data.message);
      } else {
        setError(error);
      }
    }
  };

  return (
    <div>
      <Title handleBack={handleBack} isEdit={!!isEdit} />
      <div className="flex ml-8 mt-12 bg-white p-8 rounded-2xl w-fit">
        <AddUserForm
          form={form}
          error={error}
          loading={isPending}
          onSubmit={handleUpdateUser}
          roles={roles}
          onlyView={!isEdit}
          user={data}
        />
      </div>
    </div>
  );
};

export default Page;
