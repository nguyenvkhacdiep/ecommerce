'use client';

import { Form } from 'antd';
import React from 'react';
import ResetPasswordForm from './components/ResetPasswordForm';

export interface IResetPassword {
  password: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const [form] = Form.useForm();

  const handleResetPassword = (data: IResetPassword) => {
    console.log(data);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[url(/background-login.jfif)] bg-no-repeat bg-cover">
      <div className="bg-white h-fit w-3/12 rounded-2xl flex flex-col items-center py-12">
        <div className="font-bold text-2xl">Reset Password?</div>
        <div className="mt-8">
          <ResetPasswordForm form={form} onSubmit={handleResetPassword} />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
