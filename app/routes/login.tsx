import { useState } from "react";
import { auth } from "~/firebase/firebase.client";
import { Form, Link, Navigate } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import MdLikeHeadding from "~/components/mdLikeHeadding";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col justify-center prose dark:prose-invert">
      <Form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <MdLikeHeadding title="Login" variant="h1" />
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
          className="border rounded-lg px-2 w-fit mt-2"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </Form>
      <Link to={"/forgot-password"} className="text-sm py-12">
        Forgot Password?
      </Link>
    </div>
  );
}
