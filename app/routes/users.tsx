import {
  getCustomProfileByCustomId,
  listLLMTexts,
} from "~/firebase/repository.client";
import type { LLMText } from "~/firebase/models";
import { auth } from "~/firebase/firebase.client";
import { Link, useParams } from "react-router";
import MdLikeHeading from "~/components/mdLikeHeading";
import MdLikeList from "~/components/mdLikeList";
import type { Route } from "./+types/users";

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const userId = params.userId;
  await auth.authStateReady();
  const profile = await getCustomProfileByCustomId(userId);
  const profileId = profile.docs[0]?.id as string | undefined;
  const isLoginUser = auth.currentUser?.uid === profileId;
  const texts = profileId ? await listLLMTexts(profileId) : undefined;
  return {
    texts: texts,
    user: auth.currentUser,
    isLoginUser,
  };
};

export default function UsersUserId({ loaderData }: Route.ComponentProps) {
  const data = loaderData;
  const params = useParams();
  console.log(data);

  return (
    <div className="h-full w-full">
      <div className="container mx-auto p-4 flex flex-col justify-center prose dark:prose-invert w-full">
        <MdLikeHeading title={`${params.userId}'s texts`} variant="h1" />
        <div className="not-prose overflow-x-scroll">
          {data.texts &&
            data.texts.docs.map((text, i) => {
              const t = text.data() as LLMText;
              return (
                <MdLikeList key={i}>
                  <Link to={`texts/${t.customId}`} className="">
                    <div className="flex py-2 px-4 space-x-2 w-full ">
                      <div className="underline text-blue-600 hover:text-blue-800">
                        {t.customId}
                      </div>
                    </div>
                  </Link>
                </MdLikeList>
              );
            })}
        </div>
      </div>
    </div>
  );
}
