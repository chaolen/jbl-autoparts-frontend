import React from "react";
import MobileNavLink from "./mobile-navlink";
import { useDispatch, useSelector } from "react-redux";
import { clearSession } from "store/slices/userSlice";
import toast from "react-hot-toast";
import { persistor, RootState } from "store/store";

type DrawerMenuProps = {
  toggleDrawer: () => void;
  isOpen: boolean;
};

const DrawerMenu = ({ toggleDrawer, isOpen }: DrawerMenuProps) => {
  const user = useSelector((state: RootState) => state.user);
  const role = user.role;
  const dispatch = useDispatch();
  const signOut = async () => {
    dispatch(clearSession());
    toggleDrawer();
    toast.success("Signed out");
    persistor.purge();
  };

  return (
    <div
      id="drawer-menu"
      className={`fixed top-0 right-0 z-50 h-screen p-4 pt-6 pr-5 w-80 overflow-y-auto transition-transform bg-gray-800 rounded-xl shadow-xl`}
      aria-labelledby="drawer-navigation-label"
    >
      <div className="flex flex-col">
        <div className="flex flex-row-reverse">
          <button
            onClick={toggleDrawer}
            className="text-white-600 hover:text-white-900"
          >
            <p className="text-white text-3xl font-black">✕</p>
          </button>
        </div>
        <MobileNavLink
          icon="/images/dashboard.svg"
          label="Dashboard"
          path={`/${role}/dashboard`}
          onClick={toggleDrawer}
        />
        <MobileNavLink
          icon="/images/search.svg"
          label="Search"
          path={`/${role}/search`}
          onClick={toggleDrawer}
        />
        <MobileNavLink
          icon="/images/shopping-cart.svg"
          label="POS"
          path={`/${role}/pos`}
          onClick={toggleDrawer}
        />
        <MobileNavLink
          icon="/images/stock.svg"
          label="Inventory"
          path={`/${role}/inventory`}
          onClick={toggleDrawer}
        />
        <MobileNavLink
          icon="/images/users.svg"
          label="Users"
          path={`/${role}/users`}
          onClick={toggleDrawer}
        />
        <MobileNavLink
          icon="/images/categories.svg"
          label="SKUs"
          path={`/${role}/skus`}
          onClick={toggleDrawer}
        />
        <MobileNavLink
          icon="/images/settings.svg"
          label="Account"
          path={`/${role}/account`}
          onClick={toggleDrawer}
        />
        <div className="absolute bottom-10">
          <MobileNavLink
            icon="/images/log-out.svg"
            label="Sign Out"
            path="/"
            disableActive
            onClick={signOut}
          />
        </div>
      </div>
    </div>
  );
};

export default DrawerMenu;
