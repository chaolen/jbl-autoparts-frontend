import { Route, Routes } from "react-router";
import LoginPage from "../pages/un-authorized/login-page";
import Dashboard from "../pages/authorized/dashboard";
import Inventory from "../pages/authorized/inventory";
import AuthorizedLayout from "../pages/authorized/shared/authorized-layout";
import AddProduct from "../pages/authorized/add-product";
import SKUs from "../pages/authorized/skus";
import LoadingRedirectPage from "app/pages/shared/loading-screen";
import EditProduct from "app/pages/authorized/edit-product";
import SearchProducts from "app/pages/authorized/search-products";
import ViewProduct from "app/pages/authorized/view-product";
import UsersPage from "app/pages/authorized/users";
import AccountPage from "app/pages/authorized/account";
import POSPage from "app/pages/authorized/pos";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/loading" element={<LoadingRedirectPage />} />

      <Route path="/admin" element={<AuthorizedLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="edit-product" element={<EditProduct />} />
        <Route path="skus" element={<SKUs />} />
        <Route path="search" element={<SearchProducts />} />
        <Route path="view-product" element={<ViewProduct />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="pos" element={<POSPage />} />
      </Route>

      <Route path="/cashier" element={<AuthorizedLayout />}>
        <Route index element={<SearchProducts />} />
        <Route path="search" element={<SearchProducts />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="view-product" element={<ViewProduct />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="pos" element={<POSPage />} />
      </Route>

      <Route path="/partsman" element={<AuthorizedLayout />}>
        <Route index element={<SearchProducts />} />
        <Route path="search" element={<SearchProducts />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="view-product" element={<ViewProduct />} />
        <Route path="account" element={<AccountPage />} />
      </Route>

      <Route path="/custom" element={<AuthorizedLayout />}>
        <Route index element={<SearchProducts />} />
        <Route path="search" element={<SearchProducts />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="view-product" element={<ViewProduct />} />
        <Route path="account" element={<AccountPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
