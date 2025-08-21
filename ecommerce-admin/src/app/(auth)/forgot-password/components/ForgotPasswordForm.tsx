import CustomForm from '@/app/components/form/Form';
import FormItem from '@/app/components/form/FormItem';
import { FormInstance, Input } from 'antd';
import React, { useEffect } from 'react';
import PrimaryButton from '@/app/components/button/PrimaryButton';
import { useRouter } from 'next/navigation';
import LinkButton from '@/app/components/button/LinkButton';
import { IForgotPasswordPayload } from '@/services/auth';

interface IForgotPasswordForm {
  form: FormInstance<IForgotPasswordPayload>;
  onSubmit: (data: IForgotPasswordPayload) => void;
  error: Error | null;
  loading: boolean;
}

const ForgotPasswordForm: React.FC<IForgotPasswordForm> = ({ form, error, loading, onSubmit }) => {
  const router = useRouter();

  const handleBackLogin = () => {
    router.push('/login');
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
      style={{ width: '90%' }}
      isHideButton
    >
      <FormItem
        name="email"
        label="Email Address"
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

      <PrimaryButton className="w-full mt-4" htmlType="submit" loading={loading}>
        Send Email
      </PrimaryButton>

      <div className="flex justify-center mt-2">
        <LinkButton onClick={handleBackLogin}>Back to login</LinkButton>
      </div>
    </CustomForm>
  );
};

export default ForgotPasswordForm;
