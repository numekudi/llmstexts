import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/layout.tsx", [
    route("/signin", "routes/signin.tsx"),
    route("/signup", "routes/signup.tsx"),
    route("/forgot-password", "routes/forgotPassword.tsx"),
    index("routes/home.tsx"),
    route("test.md", "routes/test.tsx"),
    route("/settings", "routes/settings.tsx"),
    route("/create", "routes/create.tsx"),
    route("/users/:userId", "routes/users.tsx"),
    route("/users/:userId/texts/:textId", "routes/texts.tsx"),
    route("/u/:userId/t/:textId", "routes/textsByUid.tsx"),
    route("/search", "routes/search.tsx"),
  ]),
] satisfies RouteConfig;
