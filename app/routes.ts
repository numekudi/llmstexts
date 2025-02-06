import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/signin", "routes/signin.tsx"),
  route("/signup", "routes/signup.tsx"),
  route("/forgot-password", "routes/forgotPassword.tsx"),
  route("/", "routes/layout.tsx", [
    index("routes/home.tsx"),
    route("test.md", "routes/test.tsx"),
    route("/settings", "routes/settings.tsx"),
    route("/create", "routes/create.tsx"),
    route("/users/:userId", "routes/users.$userId.tsx"),
  ]),
] satisfies RouteConfig;
