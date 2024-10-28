import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Products from "../views/Products.vue";
import Billing from "../views/Billing.vue";
import Signup from "../views/Signup.vue";
import Profile from "../views/Profile.vue";
import Order from "../views/Order.vue";
import Performance from "../views/Performance.vue";
import IconFont from "../views/test/IconFont.vue";
import ListDropboxFile from "../views/test/ListDropboxFiles.vue";
const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard-default",
  },
  {
    path: "/dashboard-default",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/products",
    name: "Products",
    component: Products,
  },
  {
    path: "/billing",
    name: "Billing",
    component: Billing,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/order",
    name: "Order",
    component: Order,
  },
  {
    path: "/performance",
    name: "Performance",
    component: Performance,
  },
];
// 只在開發環境中添加 /test 路由
if (process.env.NODE_ENV === 'development') {
  routes.push({
      path: '/showIconFont',
      name: 'IconFont',
      component: IconFont,
    },
    {
      path: '/listFiles',
      name: 'ListDropboxFiles',
      component: ListDropboxFile,
    },
  );
}
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
