import { useId, useState } from "react";
import { auth, storage } from "~/firebase/firebase.client";
import { Form, Link, Navigate, redirect } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import MdLikeHeading from "~/components/mdLikeHeading";
import {
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

const SIZE = 1024 * 1024 * 5; // 5MB
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
    return { error: "Custom ID must be less than 20 characters" };
  }

  if (!CUSTOM_ID_REGEX.test(customId)) {
    return {
      error: "Custom ID must contain only letters, numbers, and underscores",
    };
  }

  const profile = String(data.get("description"));
  if (profile.length > 1024) {
    return { error: "Profile must be less than 1024 characters" };
  }

  const inputType = data.get("inputType");
  if (inputType !== "file" && inputType !== "url") {
    return { error: "Invalid input type" };
  }

  const url = String(data.get("url"));
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
    await createLLMText(auth.currentUser.uid, {
      customId,
      description: profile,
      inputType: inputType,
      name: file?.name || null,
      uid: auth.currentUser.uid,
      externalUrl: url || null,
    });
    if (file) {
      await uploadTextFile(auth.currentUser.uid, customId, file);
    }
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
  console.log(actionData?.error);

  return (
    <div className="container mx-auto p-4 flex flex-col prose dark:prose-invert">
      <Form
        method="post"
        encType="multipart/form-data"
        className="flex flex-col space-y-2"
      >
        <MdLikeHeading title="Create" variant="h1" />
        <label htmlFor="customId">
          <div className="font-bold">Your custom ID*</div>
          <span>{loaderData?.customId} / </span>
          <input
            className="border rounded-lg"
            type="text"
            name="customId"
            required
            maxLength={64}
          />
        </label>
        <label htmlFor="description">
          <div>Description</div>
          <textarea
            className="border rounded-lg w-full"
            name="description"
            maxLength={1024}
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
            <div>URL</div>
            <input className="border rounded-lg w-full" type="url" name="url" />
          </label>
        )}
        {inputType === "file" && (
          <label htmlFor="file">
            <div>Text or Markdown file</div>
            <input
              className="border rounded-lg"
              type="file"
              name="file"
              accept=".txt,.md"
              required
            />
          </label>
        )}
        <button className="border rounded-lg px-2 w-fit" type="submit">
          create
        </button>
      </Form>
      {actionData?.error && <p className="text-red-500">{actionData?.error}</p>}
      {actionData?.message && (
        <p className="text-green-500">{actionData.message}</p>
      )}
    </div>
  );
}
