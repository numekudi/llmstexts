import type { Route } from "./+types/home";
import { auth } from "~/firebase/firebase.client";
import { Welcome } from "~/features/welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "llmstexts" },
    { name: "description", content: "A Website for Large Language Models." },
  ];
}

export const clientLoader = async ({}: Route.ClientLoaderArgs) => {
  await auth.authStateReady();
  return { user: auth.currentUser };
};

export default function Home({ loaderData }: Route.ComponentProps) {
  console.log("javascript enabled!");
  return (
    <div className="h-full w-full">
      <Welcome />
    </div>
  );
}
