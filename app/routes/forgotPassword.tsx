import { useState } from "react";
import { auth } from "~/firebase/firebase.client";
import { Form } from "react-router";
import { sendPasswordResetEmail } from "firebase/auth";
import MdLikeHeading from "~/components/mdLikeHeading";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div>
        <p>Password reset email sent. Check your inbox.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex flex-col justify-center prose dark:prose-invert">
      <Form onSubmit={handleSubmit} className="flex flex-col space-y-1">
        <MdLikeHeading title="Forgot Password" variant="h1" />
        <label htmlFor="email">
          Email: <br />
          <input
            className="border rounded-lg"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button
          className="border rounded-lg px-2 w-fit"
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Email"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </Form>
    </div>
  );
}
