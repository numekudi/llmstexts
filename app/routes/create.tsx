import { useState } from "react";
import { redirect, useFetcher } from "react-router";
import { auth } from "~/firebase/firebase.client";
import { getCustomProfile as getCustomProfileClient } from "~/firebase/repository.client";
import MdLikeHeading from "~/components/mdLikeHeading";
import type { CustomUserData } from "~/firebase/models";
import type { Route } from "./+types/create";
import { getEmbedding } from "~/firebase/vertex";
import { serverAuth } from "~/firebase/firebase.server";
import {
  createLLMText,
  uploadTextFile,
  countLLMText,
  getLLMTextUrl,
  getCustomProfile,
} from "~/firebase/repository.server";
import { getDoc } from "firebase/firestore";
const LIMIT = 50;
const SIZE = 1024 * 1024 * 4; // 4MB
// alphabet + numbers + underscore
const CUSTOM_ID_REGEX = /^[a-zA-Z0-9_]+$/;

export const action = async ({ request }: Route.ActionArgs) => {
  const data = await request.formData();
  const token = String(data.get("token"));
  const decoded = token ? await serverAuth.verifyIdToken(token) : undefined;

  if (!decoded?.uid) {
    return { error: "Not authenticated" };
  }

  const customId = String(data.get("customId"));
  if (customId.length === 0) {
    return { error: "Custom ID cannot be empty" };
  }
  if (customId.length > 64) {
    return { error: "Custom ID must be less than 64 characters" };
  }

  if (!CUSTOM_ID_REGEX.test(customId)) {
    return {
      error: "Custom ID must contain only alphabets, numbers, and underscores",
    };
  }
  const customName = String(data.get("name"));
  if (customName.length === 0) {
    return { error: "Name cannot be empty" };
  }
  if (customName.length > 64) {
    return { error: "Name must be less than 64 characters" };
  }

  if (!CUSTOM_ID_REGEX.test(customName)) {
    return {
      error: "Name must contain only alphabets, numbers, and underscores",
    };
  }
  const description = String(data.get("description"));
  if (description.length > 1024) {
    return { error: "Profile must be less than 1024 characters" };
  }

  const webpageUrl = String(data.get("webpage"));

  const inputType = data.get("inputType");
  if (inputType !== "file" && inputType !== "url") {
    return { error: "Invalid input type" };
  }

  const urlData = data.get("url");
  let url = urlData ? String(urlData) : null;
  const file = data.get("file") as File | null;

  if (inputType === "url" && !url) {
    return { error: "URL is required" };
  }
  if (inputType === "file") {
    if (!file) {
      return { error: "File is required" };
    }
    if (file.size > SIZE) {
      return { error: "File size must be less than 5MB" };
    }
  }
  try {
    if (file) {
      const count = await countLLMText(decoded.uid);
      if (count > LIMIT) {
        return { error: "Cannot create more than 50" };
      }
      await uploadTextFile(decoded.uid, customId, file);
      url = await getLLMTextUrl(decoded.uid, customId);
    }
    await createLLMText(decoded.uid, {
      customId,
      customName: customName,
      description: description,
      inputType: inputType,
      webpage: webpageUrl,
      filename: file?.name || null,
      uid: decoded.uid,
      downloadUrl: url as string,
      customNameEmbedding: await getEmbedding(customName),
    });
    const profile = await getCustomProfile(decoded.uid);
    const docData = profile.data() as CustomUserData | undefined;
    console.log("done");
    return redirect(`/users/${docData?.customId}`);
  } catch (error) {
    console.error(error);
    return { error: error };
  }
};

export const clientLoader = async () => {
  await auth.authStateReady();
  if (!auth.currentUser) {
    return redirect("/signin");
  }
  const profile = getCustomProfileClient(auth.currentUser.uid);
  const doc = await getDoc(profile);
  if (!doc.exists()) {
    return redirect("/settings");
  }
  const docData = doc.data() as CustomUserData | undefined;
  return { user: docData, idToken: await auth.currentUser.getIdToken() };
};

export default function Create({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const [inputType, setInputType] = useState<"file" | "url">("file");
  const fetcher = useFetcher();

  console.log(actionData);

  return (
    <div className="container mx-auto p-4 flex flex-col prose dark:prose-invert">
      <fetcher.Form
        method="post"
        encType="multipart/form-data"
        className="flex flex-col space-y-2"
      >
        <MdLikeHeading title="Create" variant="h1" />
        <input type="hidden" name="token" value={loaderData.idToken}></input>
        <label htmlFor="customId">
          <div className="font-bold">Your text ID*</div>
          <span>{loaderData?.user?.customId} / </span>
          <input
            className="border rounded-lg"
            type="text"
            name="customId"
            required
            maxLength={64}
          />
        </label>
        <label htmlFor="name">
          <div className="font-bold">Name*</div>
          <input
            type="text"
            className="border rounded-lg"
            name="name"
            maxLength={64}
          />
        </label>
        <label htmlFor="description">
          <div>Description (optional)</div>
          <textarea
            className="border rounded-lg w-full"
            name="description"
            maxLength={1024}
          />
        </label>
        <label htmlFor="webpage">
          <div>Substitute webpage? (optional)</div>
          <input
            type="url"
            className="border rounded-lg"
            name="webpage"
            maxLength={64}
          />
        </label>
        <label>
          <div>Input Type</div>
          <div className="flex space-x-2">
            <label>
              <input
                type="radio"
                name="inputType"
                value="file"
                checked={inputType === "file"}
                onChange={() => setInputType("file")}
              />
              File
            </label>
            <label>
              <input
                type="radio"
                name="inputType"
                value="url"
                checked={inputType === "url"}
                onChange={() => setInputType("url")}
              />
              URL
            </label>
          </div>
        </label>
        {inputType === "url" && (
          <label htmlFor="url">
            <div className="font-bold">URL*</div>
            <input className="border rounded-lg w-full" type="url" name="url" />
          </label>
        )}
        {inputType === "file" && (
          <label htmlFor="file">
            <div className="font-bold">Text or Markdown file*</div>
            <input
              className="border rounded-lg"
              type="file"
              name="file"
              accept=".txt,.md"
              required
            />
          </label>
        )}
        <button
          className="border rounded-lg px-2 w-fit cursor-pointer"
          type="submit"
          disabled={fetcher.state === "submitting"}
        >
          {fetcher.state === "submitting" ? "creating..." : "create"}
        </button>
      </fetcher.Form>
      {actionData?.error && <p className="text-red-500">{actionData?.error}</p>}
      {actionData?.error && (
        <p className="text-green-500">{actionData.error}</p>
      )}
    </div>
  );
}
