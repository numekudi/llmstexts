import { auth } from "~/firebase/firebase.client";
import { Form, redirect } from "react-router";
import MdLikeHeading from "~/components/mdLikeHeading";
import {
  CustomIdAlreadyExistsError,
  getCustomProfile,
  updateProfile,
} from "~/firebase/repository.client";
import type { Route } from "./+types/settings";
import { getDoc } from "firebase/firestore";
import type { CustomUserData } from "~/firebase/models";

const CUSTOM_ID_REGEX = /^[a-zA-Z0-9]+$/;

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
  if (customId.length > 16) {
    return { error: "Custom ID must be less than 20 characters" };
  }

  if (!CUSTOM_ID_REGEX.test(customId)) {
    return {
      error: "Custom ID must contain only alphabets, numbers.",
    };
  }

  const profile = String(data.get("profile"));
  if (profile.length > 1024) {
    return { error: "Profile must be less than 1024 characters" };
  }

  try {
    await updateProfile(auth.currentUser.uid, {
      customId: customId,
      profile: profile,
    });
    return { message: "Settings updated successfully" };
  } catch (error) {
    console.error(error);
    if (error instanceof CustomIdAlreadyExistsError) {
      console.log("CustomIdAlreadyExistsError");
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

export default function Settings({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  console.log(actionData);

  return (
    <div className="container mx-auto p-4 flex flex-col prose dark:prose-invert">
      <Form method="post" className="flex flex-col space-y-2">
        <MdLikeHeading title="Settings" variant="h1" />
        <label htmlFor="customId">
          <div className="font-bold">Your custom ID*</div>
          <div className="text-sm text-gray-500">
            The published text will be customId/textId.
          </div>
          <input
            className="border rounded-lg"
            type="text"
            name="customId"
            defaultValue={loaderData?.customId}
            required
            maxLength={16}
          />
        </label>
        <label htmlFor="profile">
          Your profile <br />
          <textarea
            className="border rounded-lg w-full"
            name="profile"
            defaultValue={loaderData?.profile}
            maxLength={1024}
          />
        </label>
        <button className="border rounded-lg px-2 w-fit" type="submit">
          Save
        </button>
      </Form>
      {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
      {actionData?.message && (
        <p className="text-green-500">{actionData.message}</p>
      )}
    </div>
  );
}
