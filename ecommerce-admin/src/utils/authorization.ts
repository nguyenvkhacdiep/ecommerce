import { RoleCode } from '@/common/constant';

export const isSuperAdmin = (userRole: string) => {
  return userRole === RoleCode.SuperAdmin;
};

export const isSellerAdmin = (userRole: string) => {
  return userRole === RoleCode.SellerAdmin;
};
