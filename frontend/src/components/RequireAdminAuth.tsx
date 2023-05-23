import { useLocation, Navigate } from 'react-router-dom';

import IUser from '../types/IUser';
import { UserType } from '../types/usertype';

type Props = {
  user: IUser | undefined;
  children: JSX.Element;
};

const RequireAdminAuth = (props: Props) => {
  let location = useLocation();
  if (props.user === undefined) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (props.user.userType !== UserType.Admin) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }
  return props.children;
};

export default RequireAdminAuth;
