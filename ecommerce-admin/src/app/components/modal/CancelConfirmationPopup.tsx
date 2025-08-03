import React from 'react';
import ConfirmModal, { Props } from './ConfirmModal';
import { NOT_SAVE_WARNING_MSG } from '@/common/constant';

export type CancelConfirmationPopupProp = {
  isOpen: boolean;
  children?: React.ReactNode;
  message?: string;
  overrideMessageClassName?: string;
} & Props;

export const CancelConfirmationPopup = ({
  isOpen,
  width = 400,
  onCancel,
  children,
  message = NOT_SAVE_WARNING_MSG,
  overrideMessageClassName = 'flex items-center gap-2 mb-6 text-base',
  zIndex = 100000,
  cancelButtonProps = { style: { width: 100 } },
  okButtonProps = { style: { width: 100 } },
  cancelText = 'No',
  okText = 'Yes',
  maskClosable = false,
  ...props
}: CancelConfirmationPopupProp) => {
  return (
    <>
      {children}
      <ConfirmModal
        open={isOpen}
        cancelText={cancelText}
        okText={okText}
        onCancel={onCancel}
        cancelButtonProps={cancelButtonProps}
        okButtonProps={okButtonProps}
        width={width}
        zIndex={zIndex}
        maskClosable={maskClosable}
        {...props}
      >
        <div className={overrideMessageClassName}>
          <span>{message}</span>
        </div>
      </ConfirmModal>
    </>
  );
};
