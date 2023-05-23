import { useLocation, Navigate } from 'react-router-dom';

import IUser from '../types/IUser';

type Props = {
  user: IUser | undefined;
  children: JSX.Element;
};

const RequireAuth = (props: Props) => {
  let location = useLocation();
  if (!props.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return props.children;
};

export default RequireAuth;
