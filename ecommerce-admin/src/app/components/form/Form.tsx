import useModalHandler from '@/hooks/useModalHandler';
import { useSetIsFormChanged } from '@/recoil/atoms/cancelConfirmationAtom';
import { isChanged } from '@/utils/common';
import { Button, ButtonProps, Form, FormProps as FormAntdProps } from 'antd';
import React, { ReactNode, useCallback } from 'react';
import FormItem from './FormItem';
import GrayButton from '../button/GrayButton';
import { CancelConfirmationPopup } from '../modal/CancelConfirmationPopup';

type FormProps = FormAntdProps & {
  onCancel?: () => void;
  isLoading?: boolean;
  isHideButton?: boolean;
  submitButtonContent?: string;
  buttonGroupClassName?: string;
  okButtonProps?: ButtonProps;
};

const CustomForm: React.FC<FormProps> = ({
  onFinish,
  validateMessages,
  validateTrigger = 'onBlur',
  children,
  onValuesChange,
  onCancel,
  isLoading = false,
  isHideButton = false,
  submitButtonContent = 'Save',
  buttonGroupClassName,
  okButtonProps,
  ...props
}) => {
  const [isFormChanged, setIsFormChanged] = useSetIsFormChanged();
  const { open: leaveConfirmModal, toggleModal: toggleLeaveConfirmModal } = useModalHandler();

  const onValuesChangeCallback = useCallback(
    (changedValues: any, values: any) => {
      if (isChanged(changedValues, values)) {
        setIsFormChanged(true);
      }
      if (onValuesChange) {
        onValuesChange(changedValues, values);
      }
    },
    [onValuesChange, setIsFormChanged],
  );

  const onFormCancel = useCallback(() => {
    if (isFormChanged) {
      toggleLeaveConfirmModal();
    } else {
      setIsFormChanged(false);
      if (onCancel) {
        onCancel();
      }
    }
  }, [isFormChanged, onCancel, setIsFormChanged, toggleLeaveConfirmModal]);

  return (
    <>
      <Form
        onValuesChange={onValuesChangeCallback}
        name="nest-messages"
        colon={false}
        size="large"
        requiredMark={false}
        onFinish={onFinish}
        validateTrigger={validateTrigger}
        validateMessages={validateMessages}
        className="common-form"
        {...props}
      >
        {children as unknown as ReactNode}

        {isHideButton ? (
          <></>
        ) : (
          <FormItem>
            <div className={buttonGroupClassName}>
              <GrayButton className="mr-3 w-[100px]" onClick={onFormCancel} disabled={isLoading}>
                Cancel
              </GrayButton>
              <Button
                disabled={isLoading}
                className="w-[100px]"
                type="primary"
                htmlType="submit"
                {...okButtonProps}
              >
                {submitButtonContent}
              </Button>
            </div>
          </FormItem>
        )}
      </Form>

      <CancelConfirmationPopup
        isOpen={leaveConfirmModal}
        onCancel={toggleLeaveConfirmModal}
        onOk={() => {
          toggleLeaveConfirmModal();
          onCancel?.();
        }}
        overrideMessageClassName="flex items-center gap-2 mb-4"
      />
    </>
  );
};

export default CustomForm;
