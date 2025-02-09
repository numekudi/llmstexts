import type { Route } from "./+types/home";
import { Welcome } from "~/features/welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "llmstxts" },
    { name: "description", content: "A Website for Large Language Models." },
  ];
}

export default function Home() {
  return (
    <div className="h-full w-full">
      <Welcome />
    </div>
  );
}
