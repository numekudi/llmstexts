import type { CustomUserData, LLMText } from "~/firebase/models";
import { Link, useSearchParams } from "react-router";
import MdLikeHeading from "~/components/mdLikeHeading";
import type { Route } from "./+types/users";
import {
  getCustomProfileByCustomId,
  listLLMTexts,
} from "~/firebase/repository.server";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const offset = url.searchParams.get("offset");
  const offsetNumber = offset ? Number(offset) : undefined;

  const userId = params.userId;
  const profile = await getCustomProfileByCustomId(userId);
  const profileId = profile.docs[0]?.id as string | undefined;
  const texts = profileId
    ? await listLLMTexts(profileId, 50, offsetNumber)
    : undefined;
  const data = (texts && texts.map((doc) => doc.data() as LLMText)) || [];

  return {
    texts: data,
    pageUser: profile.docs[0]?.data() as CustomUserData | undefined,
  };
};

export default function UsersUserId({ loaderData }: Route.ComponentProps) {
  const data = loaderData;

  return (
    <div className="h-full w-full">
      <div className="container mx-auto p-4 flex flex-col justify-center prose dark:prose-invert w-full not-prose">
        <MdLikeHeading title={`${data.pageUser?.customId}`} variant="h1" />
        <div className="py-4">{data.pageUser?.profile}</div>
        <MdLikeHeading title={`Texts for LLM`} variant="h2" />
        <div className="space-y-2 py-2">
          {data.texts &&
            data.texts.map((text, i) => {
              return (
                <div className="flex w-full" key={i}>
                  <div className="flex space-x-1 w-full">
                    <div className="flex flex-col py-2 px-4 space-x-2 w-full rounded-md">
                      <Link
                        to={`${text.downloadUrl}`}
                        className="flex hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      >
                        <div className="flex flex-col justify-center items-center px-2">
                          <div className="rounded-full bg-gray-500 w-2 h-2"></div>
                        </div>
                        <div>
                          <div className="space-x-2">
                            <span className="font-bold">
                              {text.customName}a
                            </span>
                            <span className="">{text.customId}</span>
                          </div>
                          <div className="flex justify-between">
                            <div className="text-gray-700 dark:text-gray-300 min-h-[1rem] break-words">
                              {text.description}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="flex rounded-md items-center">
                      <div className="hover:bg-zinc-200 dark:hover:bg-zinc-700">
                        <Link
                          to={`/users/${data.pageUser?.customId}texts/${text.customId}`}
                        >
                          more...
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
