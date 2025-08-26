import ConfirmModal from '@/app/components/modal/ConfirmModal';
import React from 'react';

type props = {
  open: boolean;
  onClose: () => void;
  onDeleteProduct: () => void;
  loading: boolean;
};

const DeleteProductModal: React.FC<props> = ({ open, onClose, onDeleteProduct, loading }) => {
  return (
    <ConfirmModal
      open={open}
      onCancel={onClose}
      onOk={onDeleteProduct}
      cancelText="Cancel"
      okText="Delete"
      okButtonLoading={loading}
      width={400}
    >
      <div className="flex items-center gap-2 mb-4">
        <span>Are you sure you want to delete this product?</span>
      </div>
    </ConfirmModal>
  );
};

export default DeleteProductModal;
