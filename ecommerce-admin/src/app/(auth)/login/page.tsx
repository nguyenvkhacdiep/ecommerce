'use client';

import { Form } from 'antd';
import React from 'react';
import LoginForm from './components/LoginForm';
import LoginTitle from './components/LoginTitle';

export interface ILogin {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [form] = Form.useForm();

  const handleLogin = (data: ILogin) => {
    console.log(data);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[url(/background-login.jfif)] bg-no-repeat bg-cover">
      <div className="bg-white h-fit w-3/12 rounded-2xl flex flex-col items-center py-12">
        <LoginTitle />
        <LoginForm form={form} onSubmit={handleLogin} />
      </div>
    </div>
  );
};

export default Login;
