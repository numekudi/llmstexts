import { Link, Outlet, redirect } from "react-router";
import type { Route } from "./+types/layout";
import { auth } from "~/firebase/firebase.client";
import { getCustomProfile } from "~/firebase/repository.client";
import { getDoc } from "firebase/firestore";
import type { CustomUserData } from "~/firebase/models";
export const clientLoader = async ({}: Route.ClientLoaderArgs) => {
  await auth.authStateReady();

  const currentProfile =
    auth.currentUser && getCustomProfile(auth.currentUser.uid);
  const profile = currentProfile && (await getDoc(currentProfile));
  const data = profile && (profile.data() as CustomUserData);

  return { user: auth.currentUser, profile: data };
};

export default function Layout({ loaderData }: Route.ComponentProps) {
  return (
    <div className="w-full">
      <div className="w-full">
        {loaderData.user && (
          <div className="w-full flex justify-end font-bold bg-gray-100 dark:bg-zinc-900 px-4">
            {loaderData.profile && (
              <>
                <Link
                  className="underline text-blue-600 hover:text-blue-800 px-2 py-4"
                  to={`users/${loaderData.profile.customId}`}
                >
                  Manage Texts
                </Link>
                <Link
                  className="underline text-blue-600 hover:text-blue-800 px-2 py-4"
                  to={`/create`}
                >
                  Create Text
                </Link>
              </>
            )}
            <Link
              className="underline text-blue-600 hover:text-blue-800 px-2 py-4"
              to={`/settings`}
            >
              Settings
            </Link>
          </div>
        )}
        {!loaderData.user && (
          <div className="w-full flex justify-end">
            <Link
              to={"/signup"}
              className="underline text-blue-600 hover:text-blue-800 px-2 py-4"
            >
              Sign Up
            </Link>
            <Link
              to={"/signin"}
              className="underline text-blue-600 hover:text-blue-800 px-2 py-4"
            >
              Login
            </Link>
          </div>
        )}
      </div>
      <Outlet />
    </div>
  );
}
