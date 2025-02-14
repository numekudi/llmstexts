import React from "react";
import { Link } from "react-router";
import type { LLMText } from "~/firebase/models";

const MdLikeList = ({ text }: { text: LLMText & { id: string } }) => {
  return (
    <div className="flex w-full">
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
                <span className="font-bold">{text.customName}</span>
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
            <Link to={`/u/${text.uid}/t/${text.id}`}>more...</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MdLikeList;
