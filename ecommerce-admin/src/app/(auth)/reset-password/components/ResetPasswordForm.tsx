import CustomForm from '@/app/components/form/Form';
import FormItem from '@/app/components/form/FormItem';
import { FormInstance, Input } from 'antd';
import React from 'react';
import PrimaryButton from '@/app/components/button/PrimaryButton';
import { IResetPasswordPayload } from '@/services/auth/auth';

interface IResetPasswordForm {
  form: FormInstance<any>;
  onSubmit: (data: any) => void;
  loading: boolean;
}

const ResetPasswordForm: React.FC<IResetPasswordForm> = ({ form, loading, onSubmit }) => {
  const validateConfirmPassword = ({
    getFieldValue,
  }: {
    getFieldValue: FormInstance<IResetPasswordPayload>['getFieldValue'];
  }) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Passwords do not match. Please try again.'));
    },
  });

  return (
    <CustomForm
      layout="vertical"
      form={form}
      onFinish={onSubmit}
      style={{ width: 400 }}
      isHideButton
    >
      <FormItem
        hasFeedback
        name="password"
        label="Password"
        validateTrigger={['onChange', 'onBlur']}
        normalize={(value) => value.trim()}
        rules={[
          { required: true, message: '${label} is required' },
          {
            min: 8,
            message: 'Password must be at least 8 characters long.',
          },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message:
              'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character!',
          },
        ]}
      >
        <Input.Password maxLength={200} placeholder="Password" />
      </FormItem>

      <FormItem
        hasFeedback
        name="confirmPassword"
        label="Confirm Password"
        validateTrigger={['onChange', 'onBlur']}
        normalize={(value) => value.trim()}
        dependencies={['password']}
        rules={[{ required: true, message: '${label} is required' }, validateConfirmPassword]}
      >
        <Input.Password maxLength={200} placeholder="Confirm Password" />
      </FormItem>

      <PrimaryButton className="w-full mt-4" htmlType="submit" loading={loading}>
        Reset Password
      </PrimaryButton>
    </CustomForm>
  );
};

export default ResetPasswordForm;
