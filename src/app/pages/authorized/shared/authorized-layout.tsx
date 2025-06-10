import { Outlet } from "react-router";
import Sidebar from "./sidebar";
import { useEffect, useState } from "react";
import { useLazyAdminCheckQuery } from "store/apis/adminApi";
import LoadingComponent from "app/pages/shared/loading.component";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import MobileHeader from "./mobile-header";
import DrawerMenu from "./drawer-menu";
import { Session } from "store/slices/userSlice";

const AuthorizedLayout = () => {
  const [trigger, { isLoading }] = useLazyAdminCheckQuery();
  const state = useSelector((state: RootState) => state);
  const user = state.user;
  const isMobile = state.app.isMobile;
  const [showDrawer, setShowDrawer] = useState(false);

  const checkAdmin = async () => {
    await trigger();
  };

  const toggleDrawer = () => setShowDrawer((val) => !val);

  const evaluateUser = (user: any) => {
    switch (user.role) {
      case 'admin':
        checkAdmin();
        return;
      case 'partsman':
        return;
      case 'cashier':
        return;
      case 'custom':
        return;
      default:
        return
    }
  }

  useEffect(() => {
    evaluateUser(user);
  }, [user]);

  if (isLoading) return <LoadingComponent />;
  if (!user.id) return null;

  return (
    <div
      className="flex w-full h-screen"
      style={{
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {isMobile ? <MobileHeader toggleDrawer={toggleDrawer} /> : <Sidebar />}

      <div
        className="overflow-y-auto"
        style={{
          height: "100vh",
          width: isMobile ? "100%" : "83.3333%",
        }}
      >
        <Outlet />
      </div>

      {showDrawer && isMobile && (
        <>
          <div className="fixed h-screen w-screen z-50 bg-primary opacity-95" />
          <DrawerMenu isOpen={showDrawer} toggleDrawer={toggleDrawer} />
        </>
      )}
    </div>
  );
};

export default AuthorizedLayout;
