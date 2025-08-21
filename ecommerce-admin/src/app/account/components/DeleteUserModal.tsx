import ConfirmModal from '@/app/components/modal/ConfirmModal';
import React from 'react';

type props = {
  open: boolean;
  onClose: () => void;
  onDeleteUser: () => void;
  loading: boolean;
};

const DeleteUserModal: React.FC<props> = ({ open, onClose, onDeleteUser, loading }) => {
  return (
    <ConfirmModal
      open={open}
      onCancel={onClose}
      onOk={onDeleteUser}
      cancelText="Cancel"
      okText="Delete"
      okButtonLoading={loading}
      width={400}
    >
      <div className="flex items-center gap-2 mb-4">
        <span>Are you sure you want to delete this user?</span>
      </div>
    </ConfirmModal>
  );
};

export default DeleteUserModal;
