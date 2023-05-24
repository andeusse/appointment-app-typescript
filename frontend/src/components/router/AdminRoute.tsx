import { useLocation, Navigate } from 'react-router-dom';

import IUser from '../../types/IUser';
import { UserType } from '../../types/usertype';

type Props = {
  user: IUser | undefined;
  children: JSX.Element;
};

const AdminRoute = (props: Props) => {
  let location = useLocation();
  if (props.user === undefined) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  if (props.user.userType !== UserType.Admin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return props.children;
};

export default AdminRoute;
