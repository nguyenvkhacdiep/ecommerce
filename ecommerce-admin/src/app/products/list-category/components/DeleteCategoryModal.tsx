import ConfirmModal from '@/app/components/modal/ConfirmModal';
import React from 'react';

type props = {
  open: boolean;
  onClose: () => void;
  onDeleteCategory: () => void;
  loading: boolean;
};

const DeleteCategoryModal: React.FC<props> = ({ open, onClose, onDeleteCategory, loading }) => {
  return (
    <ConfirmModal
      open={open}
      onCancel={onClose}
      onOk={onDeleteCategory}
      cancelText="Cancel"
      okText="Delete"
      okButtonLoading={loading}
      width={400}
    >
      <div className="flex items-center gap-2 mb-4">
        <span>Are you sure you want to delete this Category?</span>
      </div>
    </ConfirmModal>
  );
};

export default DeleteCategoryModal;
