import { IUserResponse } from '@/services/user/user';
import { useEffect, useState } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const selectedUserDetailAtom = atom<IUserResponse | null>({
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

export const useUserDetailValueClient = (): IUserResponse | null => {
  const [userDetail, setUserDetail] = useState<IUserResponse | null>(null);
  const userDetailRecoilValue = useRecoilValue(selectedUserDetailAtom);

  useEffect(() => {
    setUserDetail(userDetailRecoilValue);
  }, [userDetailRecoilValue]);

  return userDetail;
};
