import { useEffect } from "react";
import useWindowSize from "./hooks/useDimensions";
import Routes from "./routes";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setIsMobile, setIsThresholdResponsive } from "store/slices/appSlice";
import { RootState } from "store/store";
import AppLoading from "./pages/shared/app-loading";
import useOnlineStatus from "helpers/onlineStatus.hook";

const App = () => {
  const dimensions = useWindowSize();
  const app = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  const isAppLoading = app.isAppLoading;
  const isOnline = useOnlineStatus();

  useEffect(() => {
    const { width } = dimensions;
    let isMobile;
    let isThresholdResponsive;
    if (width < 1020) {
      isMobile = true;
    } else {
      isMobile = false;
    }

    if (isMobile !== app.isMobile) {
      dispatch(setIsMobile(isMobile));
    }

    if (width < 630) {
      isThresholdResponsive = true;
    } else {
      isThresholdResponsive = false;
    }

    if (isThresholdResponsive !== app.isThresholdResponsive) {
      dispatch(setIsThresholdResponsive(isThresholdResponsive));
    }

  }, [dimensions]);

  useEffect(() => {
    if (!isOnline) {
      toast.error('No Internet Connection', {
        position: 'top-center',
        duration: 10000
      })
    }
  }, [isOnline]);

  return (
    <div className="w-screen h-screen flex overflow-hidden">
      <Routes />
      <Toaster position="top-right" />
      <AppLoading loading={isAppLoading} />

    </div>
  );
};

export default App;
