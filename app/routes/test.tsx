import { remark } from "remark";
import type { Route } from "../+types/root";

const content = `
# llmstexts
A hub of Markdown, built for LLMs that browse the web for information.
`;

export const loader = async ({}: Route.LoaderArgs) => {
  return content;
};
