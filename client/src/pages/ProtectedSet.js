import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import { Loading } from '../components'
import { useEffect } from 'react';


const ProtectedSet = ({ children }) => {
  const { user, userLoading, isLoading, setLoading, setFound, set, isSetLoading } = useAppContext();
  // useEffect(() => {
  //   isSetLoading()
  // }, [])

  // if (setLoading || (!setFound && setLoading)) {
  //   return
  // }

  // if (setLoading) {
  //   return (
  //     <div className="loading-container">
  //       <Loading center />
  //     </div>
  //   )
  // }
  // if (userLoading) return;

  if (!user) {
    return <Navigate to='/landing' />;
  }

  if (!setFound || (set && set.createdBy !== user._id)) {
    return <Navigate to='/404' />
  }
  return children;
};

export default ProtectedSet