import type { Route } from "./+types/home";
import { auth } from "~/firebase/firebase.client";
import { remark } from "remark";
import html from "remark-html";
import { Welcome } from "~/welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "llmstexts" },
    { name: "description", content: "A Website for Large Language Models." },
  ];
}

const content = `
# llmstexts
A hub of Markdown, built for LLMs that browse the web for information.

## Why llmstexts?

1. Optimized for LLMs

Most web content includes styles, images, and videos that make it difficult for language models to extract accurate information. llmstexts serves as a hub that provides structured, text-based data in Markdown format, helping LLMs receive clean and easily interpretable content.

2. Environmentally Conscious

Both LLM inference and web browsing require significant computational resources. By focusing on lightweight, text-based formats, llmstexts reduces unnecessary computation, making information retrieval more efficient and eco-friendly.

## How It Works

1. Sign up for an account.

2. Upload a Markdown file or register a link to an llms.txt file.

Join us in making the web more readable for LLMs!
`;

export const loader = async ({}: Route.LoaderArgs) => {
  // const result = await remark().use(html).process(content);
  // console.log(result);
  // return { html: result.value.toString() };
  return { data: content };
};

export const clientLoader = async ({
  serverLoader,
}: Route.ClientLoaderArgs) => {
  await auth.authStateReady();
  const serverData = await serverLoader();
  return { user: auth.currentUser, data: serverData.data };
};

export default function Home({ loaderData }: Route.ComponentProps) {
  console.log("javascript enabled!");
  return (
    <div className="h-full w-full">
      <Welcome />
    </div>
  );
}
