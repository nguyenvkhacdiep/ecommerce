import { RoleCode } from '@/common/constant';

export const isSuperAdmin = (userRole: string) => {
  return userRole === RoleCode.SuperAdmin;
};

export const isAdmin = (userRole: string) => {
  return userRole === RoleCode.Admin;
};

export const isSeller = (userRole: string) => {
  return userRole === RoleCode.Seller;
};
