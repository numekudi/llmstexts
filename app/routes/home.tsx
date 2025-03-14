import type { Route } from "./+types/home";
import { Welcome } from "~/features/welcome/welcome";
import { listRecentLLMTexts } from "~/firebase/repository.server";
import type { LLMText } from "~/firebase/models";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "llmstxtshub" },
    { name: "description", content: "A Website for Large Language Models." },
  ];
}

export const loader = async ({}: Route.LoaderArgs) => {
  const d = await listRecentLLMTexts(30);
  return {
    recent: d.map((t) => {
      return { ...t.data(), id: t.id } as LLMText & { id: string };
    }),
  };
};

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="h-full w-full">
      <Welcome
        recentList={(loaderData.recent as (LLMText & { id: string })[]) ?? []}
      />
    </div>
  );
}
