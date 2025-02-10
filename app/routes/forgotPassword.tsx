import { auth } from "~/firebase/firebase.client";
import { Form, redirect } from "react-router";
import { sendPasswordResetEmail } from "firebase/auth";
import MdLikeHeading from "~/components/mdLikeHeading";
import type { Route } from "./+types/forgotPassword";

export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  const data = await request.formData();
  const email = String(data.get("email"));

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return { message: "Password reset email sent. Check your inbox." };
  } catch (error: any) {
    return { error: error.message };
  }
};

export default function ForgotPassword({ actionData }: Route.ComponentProps) {
  return (
    <div className="container mx-auto p-4 flex flex-col justify-center prose dark:prose-invert">
      <Form method="post" className="flex flex-col space-y-1">
        <MdLikeHeading title="Forgot Password" variant="h1" />
        <label htmlFor="email">
          Email: <br />
          <input
            className="border rounded-lg"
            type="email"
            name="email"
            required
          />
        </label>
        <button className="border rounded-lg px-2 w-fit" type="submit">
          Send Reset Email
        </button>
        {actionData?.error && (
          <p className="text-red-500">{actionData.error}</p>
        )}
        {actionData?.message && (
          <p className="text-green-500">{actionData.message}</p>
        )}
      </Form>
    </div>
  );
}
