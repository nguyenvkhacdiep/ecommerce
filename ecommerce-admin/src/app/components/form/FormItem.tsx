import React from 'react';
import { Form, FormItemProps } from 'antd';

type Props = FormItemProps;

const FormItem: React.FC<Props> = ({
  messageVariables,
  label,
  required,
  rules,
  children,
  ...props
}) => {
  const customLabel = (
    <label className="mr-2.5">
      {label}
      {required && <span className="text-red-500 pl-1">*</span>}
    </label>
  );

  const hasCustomRequiredRule =
    rules && rules.some((rule) => Object?.keys(rule).includes('required'));

  const withRequiredRules =
    hasCustomRequiredRule || !required ? rules : [{ required: true }, ...(rules || [])];

  return (
    <Form.Item
      style={{ marginBottom: '28px' }}
      {...props}
      messageVariables={{ label: label as string, ...messageVariables }}
      rules={withRequiredRules}
      label={label && customLabel}
    >
      {children}
    </Form.Item>
  );
};

export default FormItem;
