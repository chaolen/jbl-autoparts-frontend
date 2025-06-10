import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setIsAppLoading } from "store/slices/appSlice";

type AppLoadingProps = {
  loading?: boolean;
}

const AppLoading = ({ loading }: AppLoadingProps) => {
  const [showRefresh, setShowRefresh] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (loading) {
      timer = setTimeout(() => {
        setShowRefresh(true);
      }, 20000); // 20 seconds
    } else {
      setShowRefresh(false);
      //@ts-ignore
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [loading]);

  const handleRefresh = () => {
    dispatch(setIsAppLoading(false));
    window.location.reload();
  }

  return loading ? (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center flex-col">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid" />
      {showRefresh && (
        <div className="flex flex-col bg-white rounded-xl p-4 mt-5">
          This is taking a while
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-primary text-white hover:text-primary font-semibold rounded hover:bg-gray-200"
          >
            Refresh Page?
          </button>
        </div>
      )}
    </div>
  ) : null;
};

export default AppLoading;
