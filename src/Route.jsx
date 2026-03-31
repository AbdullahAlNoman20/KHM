import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import ScrollToTop from "./ScrollToTop";
import Home from "./Pages/Home/Home";

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
    ],
  },
]);

export default Route;