import ConfirmModal from '@/app/components/modal/ConfirmModal';
import React from 'react';

type props = {
  open: boolean;
  onClose: () => void;
  onGoToCreateShop: () => void;
};

const CreateShopModal: React.FC<props> = ({ open, onClose, onGoToCreateShop }) => {
  return (
    <ConfirmModal
      open={open}
      onCancel={onClose}
      onOk={onGoToCreateShop}
      cancelText="Cancel"
      okText="Create Shop"
      width={450}
    >
      <div className="flex flex-col items-start gap-2 mb-4">
        <span className="text-lg font-semibold text-green-600">
          🎉 Your shop has been created successfully!
        </span>
        <span className="text-gray-600">You can now proceed to set up your shop details.</span>
      </div>
    </ConfirmModal>
  );
};

export default CreateShopModal;
