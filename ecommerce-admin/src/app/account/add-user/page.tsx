'use client';

import { useAddUser } from '@/hooks/reactQuery/user/useAddUser';
import React, { useState } from 'react';
import AddUserForm from './components/AddUserForm';
import { Form } from 'antd';
import { IAddUserPayload } from '@/services/user';
import Title from './components/Title';
import { useGetAllRoles } from '@/hooks/reactQuery/auth/useGetAllRoles';
import { useTransformOptions } from '@/utils/common';
import { showErrorMessage, showSuccessMessage } from '@/utils/alert';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const { mutateAsync, isPending } = useAddUser();
  const { data: allRoles } = useGetAllRoles();
  const [error, setError] = useState<Error | null>(null);

  const handleBack = () => {
    router.push('/account');
  };

  const handleCreateUser = async (payload: IAddUserPayload) => {
    try {
      await mutateAsync(payload);
      showSuccessMessage('Add User', 'User added successfully.');
      handleBack();
    } catch (error: any) {
      if (!(error as any).data.errors) {
        showErrorMessage('Add User', (error as any).data.message);
      } else {
        setError(error);
      }
    }
  };

  const roles = useTransformOptions(allRoles, 'id', 'name');

  return (
    <div className="w-full h-screen">
      <Title handleBack={handleBack} />
      <div className="h-full flex justify-center items-center">
        <AddUserForm
          form={form}
          error={error}
          loading={isPending}
          onSubmit={handleCreateUser}
          roles={roles}
        />
      </div>
    </div>
  );
};

export default Page;
