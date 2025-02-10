import type { Route } from "./+types/texts";
import { getCustomProfileByCustomId as getCustomProfileByCustomIdServer } from "~/firebase/repository.server";

import MdLikeHeading from "~/components/mdLikeHeading";
import type { CustomUserData, LLMText } from "~/firebase/models";
import { Form, Link, redirect, useParams } from "react-router";
import { getLLMTextByCustomId } from "~/firebase/repository.server";
import { auth } from "~/firebase/firebase.client";
import { useEffect, useState } from "react";
import {
  deleteText,
  deleteTextFile,
  getCustomProfile,
} from "~/firebase/repository.client";
import { getDoc } from "firebase/firestore";

export const loader = async ({ params }: Route.LoaderArgs) => {
  const userId = params.userId;
  const textId = params.textId;
  if (textId.endsWith(".txt")) {
    const textIdWithoutExtension = textId.slice(0, -4);
    const profile = await getCustomProfileByCustomIdServer(userId);
    const uid = profile.docs[0]?.id as string | undefined;
    if (uid) {
      const res = await getLLMTextByCustomId(uid, textIdWithoutExtension);
      const d = res.docs[0]?.data() as LLMText;

      return redirect(d.downloadUrl);
    }
  }
  const profile = await getCustomProfileByCustomIdServer(userId);
  const profileId = profile.docs[0]?.id as string | undefined;
  const text = profileId
    ? await getLLMTextByCustomId(profileId, textId)
    : undefined;

  const data = text?.docs[0]?.data() as LLMText | undefined;
  return {
    text: data,
  };
};

export const clientAction = async ({ params }: Route.ClientActionArgs) => {
  // delete only
  await auth.authStateReady();
  if (auth.currentUser?.uid) {
    await deleteText(auth.currentUser.uid, params.textId);
    await deleteTextFile(auth.currentUser.uid ?? "", params.textId);
  }
  const p = await getDoc(await getCustomProfile(auth.currentUser?.uid ?? ""));

  const d = p.data() as CustomUserData;
  return redirect(`/users/${d.customId}`);
};

export default function Texts({ loaderData }: Route.ComponentProps) {
  const params = useParams();
  const textData = loaderData.text;
  const href = textData?.downloadUrl as string;
  const [isLoginUser, setIsLoginUser] = useState(false);
  useEffect(() => {
    const f = async () => {
      await auth.authStateReady();
      if (auth.currentUser?.uid) {
        const p = await getDoc(
          await getCustomProfile(auth.currentUser.uid ?? "")
        );
        const d = p.data() as CustomUserData;
        if (d.customId === params.userId) {
          setIsLoginUser(true);
        }
      }
    };
    f();
  }, []);

  return (
    <div className="h-full w-full">
      <div className="container mx-auto p-4 flex flex-col justify-center prose dark:prose-invert w-full break-words">
        <MdLikeHeading title={"Text"} variant="h1" />
        <div className="not-prose">
          {textData && (
            <div className="flex flex-col py-2 px-4 w-full space-y-4">
              <MdLikeHeading title={"ID"} variant="h2" />
              <p>{textData.customId}</p>
              <MdLikeHeading title={"Name"} variant="h2" />
              <p>{textData.customName}</p>
              <MdLikeHeading title={"Website"} variant="h2" />
              <Link to={textData.webpage ?? ""}>{textData.webpage}</Link>
              <MdLikeHeading title={"Description"} variant="h2" />
              <p>{textData.description}</p>
              <MdLikeHeading title={"Type"} variant="h2" />
              <p>{textData.inputType}</p>
              <MdLikeHeading title={"File name"} variant="h2" />
              <p>{textData.filename}</p>
              <MdLikeHeading title={"URL"} variant="h2" />
              <Link to={href}>{href}</Link>
            </div>
          )}
        </div>

        {isLoginUser && (
          <Form method="delete">
            <div className="w-full flex justify-end">
              <button className="bg-red-500 rounded-md px-2 cursor-pointer text-white">
                delete
              </button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
}
