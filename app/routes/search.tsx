import { useState } from "react";
import { Form, useSearchParams } from "react-router";
import type { Route } from "./+types/search";
import MdLikeHeading from "~/components/mdLikeHeading";
import { searchTextByUrl } from "~/firebase/repository.server";
import type { LLMText } from "~/firebase/models";
import MdLikeList from "~/components/mdLikeList";
const pageSize = 10;

export const loader = async ({ request }: Route.ActionArgs) => {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const query = url.searchParams.get("q");
  const page = parseInt(url.searchParams.get("page") || "0");

  if (!query) {
    return null;
  }

  if (type === "url") {
    const res = await searchTextByUrl(query, page * pageSize);
    return res.docs.map((d) => {
      return { id: d.id, ...d.data() } as LLMText & { id: string };
    });
  }
  return null;
};
export default function Search({ loaderData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const defaultType = searchParams.get("type") || "name";
  const defaultQuery = searchParams.get("q") || "";
  const defaultPage = parseInt(searchParams.get("page") || "0");

  const [searchType, setSearchType] = useState(defaultType);
  const res = loaderData as (LLMText & { id: string })[] | undefined;
  return (
    <div className="flex p-4 flex-col mx-auto prose dark:prose-invert">
      <MdLikeHeading title="Search" variant="h1" />
      <div className="flex flex-col items-center w-full">
        <Form
          method="get"
          action="/search"
          className="w-full max-w-sm"
          navigate={true}
        >
          <fieldset className="flex gap-2">
            <div className="flex flex-col">
              <label>
                <input
                  type="radio"
                  name="type"
                  value="url"
                  checked={searchType === "url"}
                  onChange={() => setSearchType("url")}
                />
                URL (prefix search)
              </label>
              <label>
                <input
                  type="radio"
                  name="type"
                  value="name"
                  checked={searchType === "name"}
                  onChange={() => setSearchType("name")}
                />
                Name (semantic search)
              </label>
            </div>
          </fieldset>
          <div className="flex items-center p-1">
            <input
              type={searchType === "url" ? "url" : "text"}
              name="q"
              required
              className="flex-grow rounded-md min-w-0 p-2 border"
              defaultValue={defaultQuery}
            />
            <button type="submit" className="border rounded-lg px-3 py-2 ml-2">
              Search
            </button>
          </div>
        </Form>
      </div>
      {res?.length && (
        <>
          <MdLikeHeading title="Result" variant="h2" />
          {res &&
            res.map((text, i) => {
              return <MdLikeList text={text} key={i} />;
            })}
        </>
      )}
    </div>
  );
}
