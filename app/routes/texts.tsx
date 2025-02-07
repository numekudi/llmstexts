import { auth } from "~/firebase/firebase.client";
import type { Route } from "./+types/texts";
import {
  getCustomProfileByCustomId,
  getText,
} from "~/firebase/repository.client";
import { getCustomProfileByCustomId as getCustomProfileByCustomIdServer } from "~/firebase/repository.server";
import MdLikeHeading from "~/components/mdLikeHeading";
import type { LLMText } from "~/firebase/models";
import { data, Link, redirect } from "react-router";
import { getLLMText } from "~/firebase/repository.server";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const userId = params.userId;
  const textId = params.textId;
  if (textId.endsWith(".txt")) {
    const textIdWithoutExtension = textId.slice(0, -4);
    const profile = await getCustomProfileByCustomIdServer(userId);
    const uid = profile.docs[0]?.id as string | undefined;
    if (uid) {
      const res = await getLLMText(uid, textIdWithoutExtension);
      const url = res.data()?.url;
      return redirect(url);
    }
  }
};

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const userId = params.userId;
  const textId = params.textId;

  await auth.authStateReady();
  const profile = await getCustomProfileByCustomId(userId);
  const profileId = profile.docs[0]?.id as string | undefined;
  const text = profileId ? await getText(profileId, textId) : undefined;
  const data = text?.data() as LLMText | undefined;
  console.log(data);

  return {
    text: text,
    user: auth.currentUser,
  };
};

export default function Texts({ loaderData }: Route.ComponentProps) {
  const text = loaderData.text;
  const textData = text?.data() as LLMText | undefined;
  const href = textData?.url as string;
  return (
    <div className="h-full w-full">
      <div className="container mx-auto p-4 flex flex-col justify-center prose dark:prose-invert w-full">
        <MdLikeHeading title={"Text"} variant="h1" />
        <div className="not-prose">
          {textData && (
            <div className="flex flex-col py-2 px-4 w-full space-y-4">
              <MdLikeHeading title={"ID"} variant="h2" />
              <p>{textData.customId}</p>
              <MdLikeHeading title={"Description"} variant="h2" />
              <p>{textData.description}</p>
              <MdLikeHeading title={"Type"} variant="h2" />
              <p>{textData.inputType}</p>
              <MdLikeHeading title={"File name"} variant="h2" />
              <p>{textData.name}</p>
              <MdLikeHeading title={"URL"} variant="h2" />
              <Link to={href}>{href}</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
