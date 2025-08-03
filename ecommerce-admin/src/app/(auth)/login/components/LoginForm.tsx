import CustomForm from '@/app/components/form/Form';
import FormItem from '@/app/components/form/FormItem';
import { FormInstance, Input } from 'antd';
import React from 'react';
import { ILogin } from '../page';
import PrimaryButton from '@/app/components/button/PrimaryButton';
import LinkButton from '@/app/components/button/LinkButton';
import { useRouter } from 'next/navigation';

interface ILoginForm {
  form: FormInstance<ILogin>;
  onSubmit: (data: ILogin) => void;
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
        name="username"
        label="Username"
        validateTrigger={['onChange', 'onBlur']}
        normalize={(value) => value.trim()}
        rules={[{ required: true, message: '${label} is required' }]}
      >
        <Input maxLength={200} placeholder="Username" />
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
