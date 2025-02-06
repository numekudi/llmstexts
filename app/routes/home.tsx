import type { Route } from "./+types/home";
import { auth } from "~/firebase/firebase.client";
import { Welcome } from "~/features/welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "llmstexts" },
    { name: "description", content: "A Website for Large Language Models." },
  ];
}

export const loader = async ({}: Route.LoaderArgs) => {
  // const result = await remark().use(html).process(content);
  // console.log(result);
  // return { html: result.value.toString() };
  return { data: "" };
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
