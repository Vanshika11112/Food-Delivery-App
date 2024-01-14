import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import Menu from "../pages/shop/Menu";
import SignUp from "../components/SignUp";
import PrivateRouter from "../privateRouter/PrivateRouter";
import UpdateProfile from "../pages/dashboard/UpdateProfile";
import CartPage from "../pages/shop/CartPage";
import Dashboard from "../layout/Dashboard";
import DashboardAdmin from "../pages/dashboard/admin/DashboardAdmin";
import Users from "../pages/dashboard/admin/Users";
import Login from "../components/Login";
import AddMenu from "../pages/dashboard/admin/AddMenu";
import ManageItems from "../pages/dashboard/admin/ManageItems";
import UpdateMenu from "../pages/dashboard/admin/UpdateMenu";
import Payment from "../pages/menuPage/Payment";
import Order from "../pages/dashboard/Order";
import ManageBookings from "../pages/dashboard/admin/ManageBookings";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
      },
      {
        path: "/order",
        element: (
          <PrivateRouter>
            <Order />
          </PrivateRouter>
        ),
      },
      {
        path: "/cart-item",
        element: <CartPage />,
      },

      {
        path: "/update-profile",
        element: <UpdateProfile />,
      },
      {
        path: "/process-checkout",
        element: <Payment />,
      },
    ],
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "",
        element: <DashboardAdmin />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "add-menu",
        element: <AddMenu />,
      },
      {
        path: "manage-items",
        element: <ManageItems />,
      },
      {
        path: "update-menu/:id",
        element: <UpdateMenu />,
        loader: ({ params }) =>
          fetch(`http://localhost:6001/menu/${params.id}`),
      },
      {
        path: "manage-bookings",
        element: <ManageBookings />,
      },
    ],
  },
]);

export default Router;
