import { UserType } from './usertype';

export default interface User {
  email: string | undefined;
  password: string | undefined;
  name: string | undefined;
  userType: UserType | undefined;
}
