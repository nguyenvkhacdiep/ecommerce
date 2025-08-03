import { IUserDetail } from '@/types/auth';
import { useEffect, useState } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const selectedUserDetailAtom = atom<IUserDetail | null>({
  key: 'selectedUserDetailAtom',
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const useSetUserDetail = () => {
  return useRecoilState(selectedUserDetailAtom);
};

export const useUserDetailValue = () => {
  return useRecoilValue(selectedUserDetailAtom);
};

export const useUserDetailValueClient = (): IUserDetail | null => {
  const [userDetail, setUserDetail] = useState<IUserDetail | null>(null);
  const userDetailRecoilValue = useRecoilValue(selectedUserDetailAtom);

  useEffect(() => {
    setUserDetail(userDetailRecoilValue);
  }, [userDetailRecoilValue]);

  return userDetail;
};
