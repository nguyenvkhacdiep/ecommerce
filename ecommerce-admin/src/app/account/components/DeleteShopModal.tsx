import ConfirmModal from '@/app/components/modal/ConfirmModal';
import React from 'react';

type props = {
  open: boolean;
  onClose: () => void;
  onDeleteShop: () => void;
  loading: boolean;
};

const DeleteShopModal: React.FC<props> = ({ open, onClose, onDeleteShop, loading }) => {
  return (
    <ConfirmModal
      open={open}
      onCancel={onClose}
      onOk={onDeleteShop}
      cancelText="Cancel"
      okText="Delete"
      okButtonLoading={loading}
      width={400}
    >
      <div className="flex items-center gap-2 mb-4">
        <span>Are you sure you want to delete this shop?</span>
      </div>
    </ConfirmModal>
  );
};

export default DeleteShopModal;
