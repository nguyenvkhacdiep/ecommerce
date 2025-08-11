'use client';

import { Form } from 'antd';
import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import LoginTitle from './components/LoginTitle';
import { useLogin } from '@/hooks/reactQuery/auth/useLogin';
import { ILoginPayload } from '@/services/auth';
import { useSetRecoilState } from 'recoil';
import { selectedUserDetailAtom } from '@/recoil/atoms/userDetailAtom';
import useTokenCookies from '@/hooks/useTokenCookies';
import { useCallbackUrl } from '@/hooks/reactQuery/useCallbackUrl';
import { showErrorMessage } from '@/utils/alert';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const { mutateAsync, isPending } = useLogin();
  const setUserDetail = useSetRecoilState(selectedUserDetailAtom);
  const { setAuthToken } = useTokenCookies();
  const { redirectToCallback } = useCallbackUrl();
  const [error, setError] = useState<Error | null>(null);

  const handleLogin = async (data: ILoginPayload) => {
    try {
      const res = await mutateAsync(data);
      if (res) {
        setUserDetail(res.user);
        setAuthToken({ token: res.token, expiresIn: res.tokenExpiresIn });
        redirectToCallback();
      }
    } catch (error: any) {
      if (!(error as any).data.errors) {
        showErrorMessage('Account', (error as any).data.message);
      } else {
        setError(error);
      }
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[url(/background-login.jfif)] bg-no-repeat bg-cover">
      <div className="bg-white h-fit w-3/12 rounded-2xl flex flex-col items-center py-12">
        <LoginTitle />
        <LoginForm form={form} error={error} loading={isPending} onSubmit={handleLogin} />
      </div>
    </div>
  );
};

export default Login;
