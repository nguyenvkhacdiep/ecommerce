import CustomForm from '@/app/components/form/Form';
import FormItem from '@/app/components/form/FormItem';
import { FormInstance, Input } from 'antd';
import React, { useEffect } from 'react';
import PrimaryButton from '@/app/components/button/PrimaryButton';
import LinkButton from '@/app/components/button/LinkButton';
import { useRouter } from 'next/navigation';
import { ILoginPayload } from '@/services/auth';

type LoginFormProps = {
  form: FormInstance<ILoginPayload>;
  onSubmit: (data: ILoginPayload) => void;
  error: Error | null;
  loading: boolean;
};

const LoginForm: React.FC<LoginFormProps> = ({ form, error, loading, onSubmit }) => {
  const router = useRouter();

  const handleNavigateForgotPassword = () => {
    router.push('/forgot-password');
  };

  useEffect(() => {
    if (error && form) {
      if (error instanceof Error && (error as any).data.message === 'INVALID_FIELD') {
        const errors = (error as any)?.data?.errors?.map((error: any) => ({
          name: error.field,
          errors: [error.issue],
        }));

        form.setFields([...errors]);
      }
    }
  }, [error]);

  return (
    <CustomForm
      layout="vertical"
      form={form}
      onFinish={onSubmit}
      style={{ width: 400 }}
      isHideButton
    >
      <FormItem
        name="email"
        label="Email"
        validateTrigger={['onChange', 'onBlur']}
        normalize={(value) => value.trim()}
        rules={[
          { required: true, message: '${label} is required' },
          {
            type: 'email',
            message: 'Invalid email format. Please enter a valid email (e.g., user@domain.com).',
          },
        ]}
      >
        <Input maxLength={200} placeholder="Email" />
      </FormItem>

      <FormItem
        name="password"
        label="Password"
        validateTrigger={['onChange', 'onBlur']}
        normalize={(value) => value.trim()}
        rules={[{ required: true, message: '${label} is required' }]}
      >
        <Input maxLength={200} placeholder="Password" />
      </FormItem>
      <div className="w-full flex justify-end">
        <LinkButton onClick={handleNavigateForgotPassword}>Forgot password?</LinkButton>
      </div>

      <PrimaryButton className="w-full mt-4" htmlType="submit" loading={loading}>
        Login
      </PrimaryButton>
    </CustomForm>
  );
};

export default LoginForm;
