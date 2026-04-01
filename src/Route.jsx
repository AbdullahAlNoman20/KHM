

import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import ScrollToTop from "./ScrollToTop";

import Home from "./Pages/Home/Home";
import Stock from "./Pages/Stock/Stock";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Customer from "./Pages/Customer/Customer";
import Accounts from "./Pages/Accounts/Accounts";
import Invoice from "./Pages/Invoice/Invoice";
import Products from "./Pages/Products/Product";

const Route = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <Root />
      </>
    ),
    children: [
      { path: "/", element: <Home></Home> },
      { path: "/stock-warning", element: <Stock></Stock> },
      { path: "/dashboard", element: <Dashboard></Dashboard> },
      { path: "/customer", element: <Customer></Customer> },
      { path: "/accounts", element: <Accounts></Accounts> },
      { path: "/invoice", element: <Invoice></Invoice> },
      { path: "/products", element: <Products></Products> },
    ],
  },
]);

export default Route;