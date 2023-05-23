import { atom } from 'recoil';
import { themeType } from '../types/themeType';

const themeState = atom({
  key: 'themeState',
  default: themeType.Light,
});

export default themeState;
