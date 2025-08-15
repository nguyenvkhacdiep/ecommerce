import React from 'react';
import { Button, ConfigProvider, Modal, ModalProps } from 'antd';
import GrayButton from '../button/GrayButton';
import { AppColor } from '@/styles/color';

export type Props = ModalProps & {
  danger?: boolean;
  cancelWidth?: number;
  okWidth?: number;
  okButtonLoading?: boolean;
};

const ConfirmModal: React.FC<Props> = ({
  onCancel,
  onOk,
  okText,
  okButtonProps,
  cancelButtonProps,
  cancelText,
  danger = false,
  children,
  cancelWidth,
  okWidth,
  okButtonLoading,
  ...props
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorError: AppColor.Red500,
        },
        components: {
          Button: {
            colorBgContainerDisabled: AppColor.Primary,
            colorTextDisabled: `${AppColor.White}99`,
            ...(danger
              ? { colorBgContainerDisabled: AppColor.Red500, colorTextDisabled: AppColor.SeaPink }
              : {}),
          },
        },
      }}
    >
      <Modal
        closable={false}
        centered
        onCancel={onCancel}
        onOk={onOk}
        {...props}
        footer={
          <>
            {cancelText ? (
              <GrayButton
                size="large"
                className={cancelWidth ? `w-[${cancelWidth}px]` : ''}
                onClick={onCancel}
                {...cancelButtonProps}
              >
                {cancelText}
              </GrayButton>
            ) : (
              <></>
            )}

            {okText ? (
              <Button
                type="primary"
                size="large"
                danger={danger}
                className={okWidth ? `w-[${okWidth}px]` : ''}
                onClick={onOk}
                style={{ width: okWidth }}
                loading={okButtonLoading}
                {...okButtonProps}
              >
                {okText}
              </Button>
            ) : (
              <></>
            )}
          </>
        }
      >
        {children}
      </Modal>
    </ConfigProvider>
  );
};

export default ConfirmModal;
