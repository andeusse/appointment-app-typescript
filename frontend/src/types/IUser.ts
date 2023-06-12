import { UserType } from './usertype';

export default interface User {
  email: string | undefined;
  name: string | undefined;
  userType: UserType | undefined;
  password?: string | undefined;
  confirmPassword?: string | undefined;
  token?: string;
}
