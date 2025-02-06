import { useState } from "react";
import { auth } from "~/firebase/firebase.client";
import { Form, redirect } from "react-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import type { Route } from "./+types/signup";
import { FirebaseError } from "firebase/app";
import MdLikeHeading from "~/components/mdLikeHeading";

export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  const data = await request.formData();
  const email = data.get("email");
  const password = data.get("password");
  console.log(data);
  if (email === null || password === null) {
    return null;
  }
  try {
    await createUserWithEmailAndPassword(auth, String(email), String(password));
    return redirect("/settings");
  } catch (error) {
    if (error instanceof FirebaseError) return { error: error.message };
  }
};

export default function Signup({ actionData }: Route.ComponentProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="container mx-auto p-4 flex flex-col justify-center prose dark:prose-invert">
      <Form method="post" className="flex flex-col space-y-1">
        <MdLikeHeading title="Sign up" variant="h1" />
        <label htmlFor="email">
          Email: <br />
          <input
            className="border rounded-lg"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label htmlFor="password">
          Password: <br />
          <input
            className="border rounded-lg"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="border rounded-lg px-2 w-fit" type="submit">
          Sign Up
        </button>
        {actionData?.error && (
          <p className="text-red-500">{actionData.error}</p>
        )}
      </Form>
    </div>
  );
}
