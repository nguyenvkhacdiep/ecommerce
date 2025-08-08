'use client';

import { Form } from 'antd';
import React, { useEffect } from 'react';
import ResetPasswordForm from './components/ResetPasswordForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCheckResetPasswordToken } from '@/hooks/reactQuery/auth/useCheckResetPasswordToken';
import { useResetPassword } from '@/hooks/reactQuery/auth/useResetPassword';
import { showErrorMessage, showSuccessMessage } from '@/utils/alert';

export interface IResetPasswordDataForm {
  password: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const { data: isTokenValid, isError } = useCheckResetPasswordToken(token as string);
  const { mutateAsync, isPending } = useResetPassword();

  console.log((isTokenValid && !isTokenValid) || isError);

  useEffect(() => {
    if ((isTokenValid && !isTokenValid) || isError) {
      router.push(`/token-expired?email=${email}`);
    }
  }, [isTokenValid, isError]);

  const handleResetPassword = async (data: IResetPasswordDataForm) => {
    try {
      const payload = {
        email: email as string,
        token: token as string,
        ...data,
      };
      const res = await mutateAsync(payload);
      showSuccessMessage('Reset Password', res.message);
      router.push('/login');
    } catch (error: any) {
      if (!(error as any).data.errors) {
        showErrorMessage('Reset Password', (error as any).data.message);
      }
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[url(/background-login.jfif)] bg-no-repeat bg-cover">
      <div className="bg-white h-fit w-3/12 rounded-2xl flex flex-col items-center py-12">
        <div className="font-bold text-2xl">Reset Password?</div>
        <div className="mt-8">
          <ResetPasswordForm form={form} loading={isPending} onSubmit={handleResetPassword} />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
