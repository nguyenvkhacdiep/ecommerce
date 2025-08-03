import { useUserDetailValueClient } from '@/recoil/atoms/userDetailAtom';
import { isSellerAdmin, isSuperAdmin } from '@/utils/authorization';
import { useMemo } from 'react';

export const useIsSuperAdmin = () => {
  const userDetail = useUserDetailValueClient();

  return useMemo(() => isSuperAdmin(userDetail?.roleCode as string), [userDetail]);
};

export const useIsSellerAdmin = () => {
  const userDetail = useUserDetailValueClient();

  return useMemo(() => isSellerAdmin(userDetail?.roleCode as string), [userDetail]);
};
