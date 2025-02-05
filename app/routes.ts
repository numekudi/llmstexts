import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("test.md", "routes/test.tsx"),
  route("/login", "routes/login.tsx"),
  route("/signup", "routes/signup.tsx"),
  route("/forgot-password", "routes/forgotPassword.tsx"),
] satisfies RouteConfig;
