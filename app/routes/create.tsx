import { useId, useState } from "react";
import { auth, storage } from "~/firebase/firebase.client";
import { Form, Link, Navigate, redirect, useFetcher } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import MdLikeHeading from "~/components/mdLikeHeading";
import {
  countLLMText,
  createLLMText,
  CustomIdAlreadyExistsError,
  getCustomProfile,
  getLLMTextUrl,
  updateProfile,
  uploadTextFile,
} from "~/firebase/repository.client";
import type { Route } from "./+types/settings";
import { getDoc } from "firebase/firestore";
import type { CustomUserData } from "~/firebase/models";
const LIMIT = 50;
const SIZE = 1024 * 1024 * 4; // 4MB
// alphabet + numbers + underscore
const CUSTOM_ID_REGEX = /^[a-zA-Z0-9_]+$/;

export const clientAction = async ({ request }: Route.ClientActionArgs) => {
  await auth.authStateReady();
  if (!auth.currentUser) {
    return redirect("/");
  }
  const data = await request.formData();
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
      const count = await countLLMText(auth.currentUser.uid);
      if (count > LIMIT) {
        return { error: "Cannot create more than 50" };
      }
      await uploadTextFile(auth.currentUser.uid, customId, file);
      url = await getLLMTextUrl(auth.currentUser.uid, customId);
    }
    await createLLMText(auth.currentUser.uid, {
      customId,
      customName: customName,
      description: description,
      inputType: inputType,
      webpage: webpageUrl,
      filename: file?.name || null,
      uid: auth.currentUser.uid,
      downloadUrl: url as string,
    });
    const profile = getCustomProfile(auth.currentUser.uid);
    const doc = await getDoc(profile);
    const docData = doc.data() as CustomUserData | undefined;
    return redirect(`/users/${docData?.customId}`);
  } catch (error) {
    console.error(error);
    if (error instanceof CustomIdAlreadyExistsError) {
      return { error: "Custom ID already exists. Please try another ID." };
    }
  }
};

export const clientLoader = async () => {
  await auth.authStateReady();
  if (!auth.currentUser) {
    return redirect("/signin");
  }
  const profile = getCustomProfile(auth.currentUser.uid);
  const doc = await getDoc(profile);
  const docData = doc.data() as CustomUserData | undefined;
  return docData;
};

export default function Create({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const [inputType, setInputType] = useState<"file" | "url">("file");
  const fetcher = useFetcher();

  return (
    <div className="container mx-auto p-4 flex flex-col prose dark:prose-invert">
      <fetcher.Form
        method="post"
        encType="multipart/form-data"
        className="flex flex-col space-y-2"
      >
        <MdLikeHeading title="Create" variant="h1" />
        <label htmlFor="customId">
          <div className="font-bold">Your text ID*</div>
          <span>{loaderData?.customId} / </span>
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
          className="border rounded-lg px-2 w-fit"
          type="submit"
          disabled={fetcher.state === "submitting"}
        >
          {fetcher.state === "submitting" ? "creating..." : "create"}
        </button>
      </fetcher.Form>
      {actionData?.error && <p className="text-red-500">{actionData?.error}</p>}
      {actionData?.message && (
        <p className="text-green-500">{actionData.message}</p>
      )}
    </div>
  );
}
