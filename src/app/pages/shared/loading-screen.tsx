import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "./loading.component";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

const LoadingRedirectPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate(`/${user.role}`);
    }, 1000); // 1 second

    return () => clearTimeout(timeout);
  }, [navigate, user]);

  return <LoadingComponent />;
};

export default LoadingRedirectPage;
