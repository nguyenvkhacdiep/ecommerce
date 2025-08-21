import { useUserDetailValueClient } from '@/recoil/atoms/userDetailAtom';
import { isAdmin, isSeller, isSuperAdmin } from '@/utils/authorization';
import { useMemo } from 'react';

export const useIsSuperAdmin = () => {
  const userDetail = useUserDetailValueClient();

  return useMemo(() => isSuperAdmin(userDetail?.role.name as string), [userDetail]);
};

export const useIsAdmin = () => {
  const userDetail = useUserDetailValueClient();

  return useMemo(() => isAdmin(userDetail?.role.name as string), [userDetail]);
};

export const useIsSeller = () => {
  const userDetail = useUserDetailValueClient();

  return useMemo(() => isSeller(userDetail?.role.name as string), [userDetail]);
};
