import { useLocation, Navigate } from 'react-router-dom';

import IUser from '../../types/IUser';

type Props = {
  user: IUser | undefined;
  children: JSX.Element;
};

const NonUserRoute = (props: Props) => {
  let location = useLocation();
  if (props.user !== undefined) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return props.children;
};

export default NonUserRoute;
