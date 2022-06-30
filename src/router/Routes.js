import Dashboard from "../components/dashboard/dashboard.jsx";
import Home from "../pages/home/Home.jsx";
import Category from "../pages/category/category.jsx";
import Banner from "../pages/home_banner/Home_banner.jsx";

export default [
  {
    routes: [
      {
        component: Dashboard,
        path: "/admin/",
        exact: true,
      },
      {
        component: Home,
        path: "/admin/home",
        exact: true,
      },
      {
        component: Category,
        path: "/admin/category",
        exact: true,
      },
      {
        component: Banner,
        path: "/admin/banner",
        exact: true,
      },
    ],
  },
];
