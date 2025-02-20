import { Link } from "react-router";
import MdLikeHeading from "~/components/mdLikeHeading";
import MdLikeList from "~/components/mdLikeList";
import type { LLMText } from "~/firebase/models";

export function Welcome({
  recentList,
}: {
  recentList: (LLMText & { id: string })[];
}) {
  return (
    <main className="container mx-auto p-4 flex flex-col justify-center prose dark:prose-invert">
      <MdLikeHeading title="llmstextshub" variant="h1" />
      <p>
        A hub of LLM friendly Markdown, built for LLMs that browse the web for
        information.
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
          to={"/signin"}
        >
          Sign In
        </Link>
      </div>
      <MdLikeHeading title="Why llmstextshub?" variant="h2" />
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
            formats, llms.txt reduces unnecessary computation, making
            information retrieval more efficient and eco-friendly.
          </p>
        </li>
        <li>
          <strong>Preventing Excessive LLM-Driven Traffic</strong>
          <p>
            When LLMs repeatedly access the same website for information, they
            can generate unintended high traffic, potentially slowing down or
            disrupting the original site. llmstextshub acts as a dedicated
            text-based repository, reducing direct queries to primary websites
            and preventing excessive load caused by automated browsing.
          </p>
        </li>
      </ol>
      <MdLikeHeading title="How It Works" variant="h2" />
      <ol className="list-decimal list-inside space-y-2">
        <li>Sign up for an account.</li>
        <li>Upload a Markdown file or register a link to an llms.txt file.</li>
        <li>
          Hopefully, the Google search crawler will index it, making it
          accessible to LLMs through search.
        </li>
        <li>
          Uploaded text can be accessed at
          <code>
            users/{"{userId}"}/texts/{"{textId}"}.txt
          </code>
          .
        </li>
      </ol>
      <MdLikeHeading title="Recent Uploads" variant="h2" />
      {recentList.map((text, i) => {
        return <MdLikeList text={text} key={i} />;
      })}
      <div className="pt-8">
        <Link
          to={"https://x.com/numekudi"}
          className="dark:text-gray-400 text-gray-600 bottom-0"
        >
          bugs? X: @numekudi
        </Link>
      </div>
    </main>
  );
}
