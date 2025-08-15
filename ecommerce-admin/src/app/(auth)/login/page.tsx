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
import useModalHandler from '@/hooks/useModalHandler';
import ConfirmModal from '@/app/components/modal/ConfirmModal';
import { useResendEmailActiveUser } from '@/hooks/reactQuery/auth/useResendEmailActiveUser';
import { showErrorMessage, showSuccessMessage } from '@/utils/alert';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const { mutateAsync, isPending } = useLogin();
  const { mutateAsync: resendEmailActiveUserMutate, isPending: resendEmailActiveUserPending } =
    useResendEmailActiveUser();
  const setUserDetail = useSetRecoilState(selectedUserDetailAtom);
  const { setAuthToken } = useTokenCookies();
  const { redirectToCallback } = useCallbackUrl();
  const { open, toggleModal } = useModalHandler();
  const [error, setError] = useState<Error | null>(null);
  const [messageError, setMessageError] = useState<string>('');

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
        setMessageError((error as any).data.message);
        toggleModal();
      } else {
        setError(error);
      }
    }
  };

  const handleSendEmailActiveUser = async () => {
    try {
      const result = await resendEmailActiveUserMutate(form.getFieldValue('email'));
      showSuccessMessage('Account', result.message);
      toggleModal();
    } catch (error) {
      showErrorMessage('Account', (error as any).data.message);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[url(/background-login.jfif)] bg-no-repeat bg-cover">
      <div className="bg-white h-fit w-3/12 rounded-2xl flex flex-col items-center py-12">
        <LoginTitle />
        <LoginForm form={form} error={error} loading={isPending} onSubmit={handleLogin} />
      </div>

      {open && (
        <ConfirmModal
          open={open}
          onCancel={toggleModal}
          onOk={handleSendEmailActiveUser}
          cancelText="Cancel"
          okText="Resend"
          okButtonLoading={resendEmailActiveUserPending}
          width={400}
        >
          <div className="flex items-center gap-2 mb-4">
            <span>{messageError}</span>
          </div>
        </ConfirmModal>
      )}
    </div>
  );
};

export default Login;
