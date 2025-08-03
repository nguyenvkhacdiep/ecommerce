import { useCallback, useState } from 'react';

const useModalHandler = () => {
  const [open, setOpen] = useState(false);

  const toggleModal = () => {
    setOpen((current) => !current);
  };

  const showModal = useCallback(() => {
    setOpen(true);
  }, []);

  const hideModal = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    open,
    toggleModal,
    showModal,
    hideModal,
  };
};

export default useModalHandler;
