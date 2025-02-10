import { useState } from "react";
import { auth } from "~/firebase/firebase.client";
import { Form, Link, Navigate, redirect } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { Route } from "./+types/signin";
import { FirebaseError } from "firebase/app";
import MdLikeHeading from "~/components/mdLikeHeading";

export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  const data = await request.formData();
  const email = data.get("email");
  const password = data.get("password");
  if (email === null || password === null) {
    return null;
  }
  try {
    await signInWithEmailAndPassword(auth, String(email), String(password));
    return redirect("/");
  } catch (error) {
    console.error(error);
    if (error instanceof FirebaseError) {
      return { error: error.message };
    }
  }
  return null;
};

export default function Login({ actionData }: Route.ComponentProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="container mx-auto p-4 flex flex-col justify-center prose dark:prose-invert">
      <Form method="post" className="flex flex-col space-y-2">
        <MdLikeHeading title="Sign In" variant="h1" />
        <label htmlFor="email">
          Email <br />
          <input
            className="border rounded-lg"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label htmlFor="password">
          Password <br />
          <input
            className="border rounded-lg"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        <button className="border rounded-lg px-2 w-fit mt-2" type="submit">
          {"Sign In"}
        </button>
      </Form>
      {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
      <div className="py-4 flex flex-col">
        <Link to={"/forgot-password"} className="text-sm py-2">
          Forgot Password?
        </Link>
        <Link to={"/signup"} className="text-sm py-2">
          Sign up
        </Link>
      </div>
    </div>
  );
}
