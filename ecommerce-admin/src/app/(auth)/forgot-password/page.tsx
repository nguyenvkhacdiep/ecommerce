'use client';

import { Form } from 'antd';
import React, { useState } from 'react';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import { IForgotPasswordPayload } from '@/services/auth';
import { useForgotPassword } from '@/hooks/reactQuery/auth/useForgotPassword';
import { showErrorMessage, showSuccessMessage } from '@/utils/alert';

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const { mutateAsync, isPending } = useForgotPassword();
  const [error, setError] = useState<Error | null>(null);

  const handleForgotPassword = async (payload: IForgotPasswordPayload) => {
    try {
      const res = await mutateAsync(payload);
      showSuccessMessage('Forgot password', res.message);
    } catch (error: any) {
      if (!(error as any).data.errors) {
        showErrorMessage('Forgot Password', (error as any).data.message);
      } else {
        setError(error);
      }
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[url(/background-login.jfif)] bg-no-repeat bg-cover">
      <div className="bg-white h-fit w-3/12 rounded-2xl flex flex-col items-center py-12">
        <div className="font-bold text-2xl">Forgot Password?</div>
        <div className="mt-8 w-full flex justify-center">
          <ForgotPasswordForm
            form={form}
            error={error}
            loading={isPending}
            onSubmit={handleForgotPassword}
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
