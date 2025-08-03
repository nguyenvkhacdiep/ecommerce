import CustomForm from '@/app/components/form/Form';
import FormItem from '@/app/components/form/FormItem';
import { FormInstance, Input } from 'antd';
import React from 'react';
import { IForgotPassword } from '../page';
import PrimaryButton from '@/app/components/button/PrimaryButton';
import { useRouter } from 'next/navigation';
import LinkButton from '@/app/components/button/LinkButton';

interface IForgotPasswordForm {
  form: FormInstance<IForgotPassword>;
  onSubmit: (data: IForgotPassword) => void;
}

const ForgotPasswordForm: React.FC<IForgotPasswordForm> = ({ form, onSubmit }) => {
  const router = useRouter();
  const handleBackLogin = () => {
    router.push('/login');
  };

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

      <PrimaryButton className="w-full mt-4" htmlType="submit">
        Send Email
      </PrimaryButton>

      <div className="flex justify-center mt-2">
        <LinkButton onClick={handleBackLogin}>Back to login</LinkButton>
      </div>
    </CustomForm>
  );
};

export default ForgotPasswordForm;
