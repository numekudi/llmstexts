import {
  getCustomProfileByCustomId,
  listLLMTexts,
} from "~/firebase/repository.server";
import type { Route } from "./+types/users.$userId";
import { getCustomProfile } from "~/firebase/repository.client";
import type { CustomUserData, LLMText } from "~/firebase/models";
import { auth } from "~/firebase/firebase.client";
import { data, Link, useParams } from "react-router";
import MdLikeHeading from "~/components/mdLikeHeading";
import { getDoc } from "firebase/firestore";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const userId = params.userId;
  const customProfile = await getCustomProfileByCustomId(userId);
  const user = customProfile.docs[0];
  if (user) {
    const customProfile = user.data() as CustomUserData;
    const uid = customProfile.uid;
    const texts = await listLLMTexts(uid);
    const llmTexts = texts.map((t) => t.data() as LLMText);
    return { user: customProfile, texts: llmTexts };
  }
  return data({ messaage: "user not found" }, { status: 404 });
};

export const clientLoader = async ({
  params,
  request,
  serverLoader,
}: Route.ClientLoaderArgs) => {
  await auth.authStateReady();
  const serverData = await serverLoader();
  const currentProfile =
    auth.currentUser && getCustomProfile(auth.currentUser.uid);
  const profile = currentProfile && (await getDoc(currentProfile));
  const currentProfileData = profile && (profile.data() as CustomUserData);
  return {
    serverData,
    currentUserData: currentProfileData,
  };
};

export default function UsersUserId({ loaderData }: Route.ComponentProps) {
  const params = useParams();

  return (
    <div className="h-full w-full">
      <div className="container mx-auto p-4 flex flex-col justify-center prose dark:prose-invert">
        <MdLikeHeading title={`${params.userId}'s texts`} variant="h1" />
      </div>
    </div>
  );
}
