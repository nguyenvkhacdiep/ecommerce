import { message } from 'antd';
import SuccessIcon from '/public/success-icon.svg';
import ErrorIcon from '/public/info-red-icon.svg';
import { ArgsProps } from 'antd/es/message';

export const showSuccessAlert = (content: React.ReactNode, options?: ArgsProps) => {
  message.open({
    icon: <SuccessIcon />,
    type: 'success',
    ...options,
    content,
  });
};

export const showErrorAlert = (content: React.ReactNode, options?: ArgsProps) => {
  message.open({
    icon: <ErrorIcon />,
    type: 'error',
    ...options,
    content,
  });
};
