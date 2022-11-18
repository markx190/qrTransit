const routes = [
  {
    path: "/",
    component: () => import("layouts/LoginLayout.vue"),
    children: [{ path: "", component: () => import("pages/LoginPage.vue") }],
  },
  {
    path: "/coastguard_login",
    component: () => import("layouts/CoastGuardLoginLayout.vue"),
    children: [
      { path: "", component: () => import("pages/CoastGuardLoginPage.vue") },
    ],
  },
  {
    path: "/users",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/UsersPage.vue") },
      { path: "/routes", component: () => import("pages/RoutesPage.vue") },
      { path: "/devices", component: () => import("pages/DevicesPage.vue") },
      { path: "/stations", component: () => import("pages/StationsPage.vue") },
      { path: "/sales", component: () => import("pages/SalesPage.vue") },
      { path: "/manifest", component: () => import("pages/ManifestPage.vue") },
      { path: "/vehicles", component: () => import("pages/VehiclesPage.vue") },
    ],
  },
  {
    path: "/dashboard",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
