'use client';

import { useUserDetailValueClient } from '@/recoil/atoms/userDetailAtom';
import React, { useEffect } from 'react';
import CreateShopModal from './components/CreateShopModal';
import useModalHandler from '@/hooks/useModalHandler';
import { useRouter } from 'next/navigation';

const Page = () => {
  const userDetail = useUserDetailValueClient();
  const router = useRouter();

  const { open, toggleModal } = useModalHandler();

  const handleGoToCreateShop = () => {
    router.push(`/shop/add-shop?userId=${userDetail?.id}`);
  };

  useEffect(() => {
    if (userDetail && userDetail.role.name === 'Shop' && !userDetail.shop) {
      toggleModal();
    }
  }, [userDetail]);

  return (
    <div>
      {open && (
        <CreateShopModal
          open={open}
          onClose={toggleModal}
          onGoToCreateShop={handleGoToCreateShop}
        />
      )}
    </div>
  );
};

export default Page;
