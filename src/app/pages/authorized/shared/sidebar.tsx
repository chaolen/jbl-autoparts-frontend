import SidebarNavLink from "./sidebar-navlink";
import { useDispatch, useSelector } from "react-redux";
import { clearSession } from "store/slices/userSlice";
import toast from "react-hot-toast";
import { persistor, RootState } from "store/store";
import { setIsAddSKUsModalVisible } from "store/slices/appSlice";
import { useSignOutMutation } from "store/apis/userApi";

const Sidebar = () => {
  const user = useSelector((state: RootState) => state.user);
  const role = user.role;
  const isAdmin = role === 'admin';
  const isCashier = role === 'cashier';
  const [logout] = useSignOutMutation();
  const dispatch = useDispatch();

  const signOut = async () => {
    await logout();
    toast.success("Signed out");
    dispatch(clearSession());
    persistor.purge();
  };

  const openAddSkuModal = () => {
    dispatch(setIsAddSKUsModalVisible(true));
  };
  return (
    <div className="w-1/6 h-screen overflow-scroll bg-secondary-medium text-primary p-4">
      <div>
        <img
          src="/images/jbl-logo.svg"
          alt="hero-logo"
          className="mb-6 rounded-lg w-[190px] h-[86px]"
        />
      </div>
      <nav className="flex flex-col">
        {isAdmin && (
          <>
            <div className="flex flex-col space-y-2">
              <p className="text-primary-silver font-semibold text-sm">
                QUICK ACTIONS
              </p>
              <SidebarNavLink
                icon="/images/file-plus.svg"
                label="Add Product"
                path={`/${role}/add-product`}
                disableActive
              />
              <SidebarNavLink
                icon="/images/add-category.svg"
                label="Add SKU"
                path={`/${role}/skus`}
                disableActive
                onClick={openAddSkuModal}
              />
            </div>
            <div className="h-[1px] bg-primary-silver my-5" />
          </>
        )
        }
        <div className="flex flex-col space-y-2 mt-1">
          <p className="text-primary-silver font-semibold text-sm">GENERAL</p>
          {isAdmin && (
            <SidebarNavLink
              icon="/images/dashboard.svg"
              label="Dashboard"
              path={`/${role}/dashboard`}
            />
          )}
          <SidebarNavLink
            icon="/images/search.svg"
            label="Search"
            path={`/${role}/search`}
          />
          {(isAdmin || isCashier) && (
            <SidebarNavLink
              icon="/images/shopping-cart.svg"
              label="POS"
              path={`/${role}/pos`}
            />
          )}
          <SidebarNavLink
            icon="/images/stock.svg"
            label="Inventory"
            path={`/${role}/inventory`}
          />
          {isAdmin && (
            <SidebarNavLink
              icon="/images/users.svg"
              label="Users"
              path={`/${role}/users`}
            />
          )}
          {
            isAdmin && (
              <SidebarNavLink
                icon="/images/categories.svg"
                label="SKUs"
                path={`/${role}/skus`}
              />
            )
          }
        </div>
        <div className="h-[1px] bg-primary-silver my-5" />
        <div className="flex flex-col space-y-2 mt-1">
          <p className="text-primary-silver font-semibold text-sm">SETTINGS</p>
          <SidebarNavLink
            icon="/images/settings.svg"
            label="Account"
            path={`/${role}/account`}
          />
          <SidebarNavLink
            icon="/images/log-out.svg"
            label="Sign Out"
            path="/"
            disableActive
            onClick={signOut}
          />
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
