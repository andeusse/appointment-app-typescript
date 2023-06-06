import { atom } from 'recoil';
import IUser from '../types/IUser';

const userState = atom<IUser | undefined>({
  key: 'userState',
  default: undefined,
});

export default userState;
