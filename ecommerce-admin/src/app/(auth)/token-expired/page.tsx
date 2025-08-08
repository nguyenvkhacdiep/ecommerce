'use client';

import React from 'react';
import Link from 'next/link';
import PrimaryButton from '@/app/components/button/PrimaryButton';
import { useSearchParams } from 'next/navigation';
import { useForgotPassword } from '@/hooks/reactQuery/auth/useForgotPassword';
import { showSuccessMessage } from '@/utils/alert';

const TokenExpired: React.FC = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const { mutateAsync, isPending } = useForgotPassword();

  const handleForgotPassword = async () => {
    try {
      const payload = {
        email: email as string,
      };
      const res = await mutateAsync(payload);
      showSuccessMessage('Forgot password', res.message);
    } catch (error: any) {}
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-16 w-16 text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 4v1m0 14v1m-7-7h1m14 0h1"
          />
        </svg>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Token Expired</h1>
        <p className="text-gray-600 mb-6">
          Your reset password link has expired or is invalid. Please request a new one.
        </p>

        <PrimaryButton onClick={handleForgotPassword} loading={isPending}>
          Request new email
        </PrimaryButton>

        <div className="mt-4">
          <Link href="/login" className="text-blue-500 hover:underline text-sm">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TokenExpired;
