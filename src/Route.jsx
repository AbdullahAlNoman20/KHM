

import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import ScrollToTop from "./ScrollToTop";

import Home from "./Pages/Home/Home";
import Stock from "./Pages/Stock/Stock";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Customer from "./Pages/Customer/Customer";
import Accounts from "./Pages/Accounts/Accounts";
import Invoice from "./Pages/Invoice/Invoice";
import ProductLayout from "./Pages/Products/ProductLayout";
import AllProducts from "./Pages/Products/AllProducts/AllProducts";
import AddProduct from "./Pages/Products/AddProduct";
import ProductDetails from "./Pages/Products/AllProducts/ProductDetails";

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

      { path: "/products", element: <ProductLayout></ProductLayout>,
        children: [
      { path: "all", element: <AllProducts></AllProducts> },
      { path: "add", element: <AddProduct></AddProduct> },
      
    ],
       },
       { path: "products/:id", element: <ProductDetails></ProductDetails> },

    ],
  },
]);

export default Route;