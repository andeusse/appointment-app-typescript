import { useLocation, Navigate } from 'react-router-dom';

import IUser from '../../types/IUser';

type Props = {
  user: IUser | undefined;
  children: JSX.Element;
};

const UserRoute = (props: Props) => {
  let location = useLocation();
  if (props.user === undefined) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  return props.children;
};

export default UserRoute;
