import { getCustomProfile, getLLMText } from "~/firebase/repository.server";
import type { Route } from "./+types/textsByUid";
import type { CustomUserData, LLMText } from "~/firebase/models";
import { redirect } from "react-router";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const p = await getCustomProfile(params.userId);
  const t = await getLLMText(params.textId);
  const profile = p.data() as CustomUserData;
  const text = t.data() as LLMText;
  return redirect(`/users/${profile.customId}/texts/${text.customId}`);
};
