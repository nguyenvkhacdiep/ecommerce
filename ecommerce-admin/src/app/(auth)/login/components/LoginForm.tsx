import CustomForm from '@/app/components/form/Form';
import FormItem from '@/app/components/form/FormItem';
import { FormInstance, Input } from 'antd';
import React from 'react';
import PrimaryButton from '@/app/components/button/PrimaryButton';
import LinkButton from '@/app/components/button/LinkButton';
import { useRouter } from 'next/navigation';
import { ILoginPayload } from '@/services/user/user';

interface ILoginForm {
  form: FormInstance<ILoginPayload>;
  onSubmit: (data: ILoginPayload) => void;
}

const LoginForm: React.FC<ILoginForm> = ({ form, onSubmit }) => {
  const router = useRouter();

  const handleNavigateForgotPassword = () => {
    router.push('/forgot-password');
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
        label="Email"
        validateTrigger={['onChange', 'onBlur']}
        normalize={(value) => value.trim()}
        rules={[{ required: true, message: '${label} is required' }]}
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

      <PrimaryButton className="w-full mt-4" htmlType="submit">
        Login
      </PrimaryButton>
    </CustomForm>
  );
};

export default LoginForm;
