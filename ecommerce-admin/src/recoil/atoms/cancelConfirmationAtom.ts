import { atom, useRecoilState } from 'recoil';

const isFormChanged = false;

export const formChangedAtom = atom({
  key: 'formChangedState',
  default: isFormChanged,
});

export const useSetIsFormChanged = () => {
  return useRecoilState(formChangedAtom);
};
