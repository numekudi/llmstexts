import { useState } from "react";
import { auth } from "~/firebase/firebase.client";
import { Form, Navigate } from "react-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import MdLikeHeadding from "~/components/mdLikeHeadding";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const ret = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(ret.user);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col justify-center prose dark:prose-invert">
      <Form onSubmit={handleSubmit} className="flex flex-col space-y-1">
        <MdLikeHeadding title="Sign up" variant="h1" />
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
        <label htmlFor="password">
          Password: <br />
          <input
            className="border rounded-lg"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button
          className="border rounded-lg px-2 w-fit"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </Form>
    </div>
  );
}
