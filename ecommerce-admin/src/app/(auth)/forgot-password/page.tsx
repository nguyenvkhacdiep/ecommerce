'use client';

import { Form } from 'antd';
import React from 'react';
import ForgotPasswordForm from './components/ForgotPasswordForm';

export interface IForgotPassword {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();

  const handleForgotPassword = (data: IForgotPassword) => {
    console.log(data);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[url(/background-login.jfif)] bg-no-repeat bg-cover">
      <div className="bg-white h-fit w-3/12 rounded-2xl flex flex-col items-center py-12">
        <div className="font-bold text-2xl">Forgot Password?</div>
        <div className="mt-8">
          <ForgotPasswordForm form={form} onSubmit={handleForgotPassword} />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
