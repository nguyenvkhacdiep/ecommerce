'use client';

import { Form } from 'antd';
import React from 'react';
import LoginForm from './components/LoginForm';
import LoginTitle from './components/LoginTitle';
import { useLogin } from '@/hooks/reactQuery/user';
import { ILoginPayload } from '@/services/user/user';
import { useSetRecoilState } from 'recoil';
import { selectedUserDetailAtom } from '@/recoil/atoms/userDetailAtom';
import useTokenCookies from '@/hooks/useTokenCookies';
import { useCallbackUrl } from '@/hooks/reactQuery/useCallbackUrl';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const { mutateAsync } = useLogin();
  const setUserDetail = useSetRecoilState(selectedUserDetailAtom);
  const { setAuthToken } = useTokenCookies();
  const { redirectToCallback } = useCallbackUrl();

  const handleLogin = async (data: ILoginPayload) => {
    const res = await mutateAsync(data);
    if (res) {
      setUserDetail(res.user);
      setAuthToken({ token: res.token, expiresIn: res.tokenExpiresIn });
      redirectToCallback();
    }
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
