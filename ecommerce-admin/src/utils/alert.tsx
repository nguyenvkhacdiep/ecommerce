import { notification, NotificationArgsProps } from 'antd';

export const showSuccessMessage = (
  message: string,
  description: string,
  options?: NotificationArgsProps,
) => {
  notification.success({
    message,
    description,
    showProgress: true,
    ...options,
  });
};

export const showErrorMessage = (
  message: string,
  description: string,
  options?: NotificationArgsProps,
) => {
  notification.error({
    message,
    description,
    showProgress: true,
    ...options,
  });
};
