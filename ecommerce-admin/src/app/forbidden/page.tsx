'use client';

import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { FrownOutlined } from '@ant-design/icons';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Icon */}
      <div className="bg-red-100 text-red-600 p-6 rounded-full shadow-md mb-6">
        <FrownOutlined className="text-5xl" />
      </div>

      {/* Title */}
      <h1 className="text-7xl font-bold text-gray-800 mb-2">403</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Access Denied</h2>

      {/* Subtitle */}
      <p className="text-gray-500 text-center max-w-md mb-8">
        Sorry, you are not authorized to access this page. Please check your account permissions or
        contact support if you believe this is a mistake.
      </p>

      {/* Button */}
      <Button
        type="primary"
        size="large"
        className="rounded-xl shadow-lg hover:scale-105 transition-transform"
        onClick={() => router.push('/')}
      >
        Back to Home
      </Button>
    </div>
  );
}
