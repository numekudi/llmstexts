import { Link } from "react-router";
import MdLikeHeadding from "~/components/mdLikeHeadding";

export function Welcome() {
  return (
    <div className="container mx-auto p-4 flex flex-col justify-center prose dark:prose-invert">
      <MdLikeHeadding title="llmstexts" variant="h1" />
      <p>
        A hub of Markdown, built for LLMs that browse the web for information.
      </p>
      <p>Do you want to publish Markdown for LLMs?</p>
      <div className="space-x-4">
        <Link
          className="underline text-blue-600 hover:text-blue-800"
          to={"/signup"}
        >
          Sign Up
        </Link>
        <span>or</span>
        <Link
          className="underline text-blue-600 hover:text-blue-800"
          to={"/login"}
        >
          Login
        </Link>
      </div>
      <MdLikeHeadding title="Why llmstexts?" variant="h2" />
      <ol className="list-decimal list-inside space-y-2">
        <li>
          <strong>Optimized for LLMs</strong>
          <p>
            Most web content includes styles, images, and videos that make it
            difficult for language models to extract accurate information.{" "}
            <br />
            llmstexts serves as a hub that provides structured, text-based data
            in Markdown format, helping LLMs receive clean and easily
            interpretable content.
          </p>
        </li>
        <li>
          <strong>Environmentally Conscious</strong>
          <p>
            Both LLM inference and web browsing require significant
            computational resources. By focusing on lightweight, text-based
            formats, llmstexts reduces unnecessary computation, making
            information retrieval more efficient and eco-friendly.
          </p>
        </li>
      </ol>
      <MdLikeHeadding title="How It Works" variant="h2" />
      <ol className="list-decimal list-inside space-y-2">
        <li>Sign up for an account.</li>
        <li>Upload a Markdown file or register a link to an llms.txt file.</li>
      </ol>
      <p className="mt-4">Join us in making the web more readable for LLMs!</p>
      <div className="space-x-4">
        <Link
          className="underline text-blue-600 hover:text-blue-800"
          to={"/signup"}
        >
          Sign Up
        </Link>
        <Link
          className="underline text-blue-600 hover:text-blue-800"
          to={"/login"}
        >
          Login
        </Link>
      </div>
    </div>
  );
}
