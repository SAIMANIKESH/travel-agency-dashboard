import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route(path:'dashboard', file: 'routes/admin/Dashboard.tsx'),
] satisfies RouteConfig;