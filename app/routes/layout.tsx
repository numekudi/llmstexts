import { Form, Link, Outlet, redirect } from "react-router";
import type { Route } from "./+types/layout";
import { auth } from "~/firebase/firebase.client";
import { getCustomProfile } from "~/firebase/repository.client";
import { getDoc } from "firebase/firestore";
import type { CustomUserData } from "~/firebase/models";
import { useEffect, useState } from "react";
import { signOut, type User } from "firebase/auth";
export const clientAction = async ({}: Route.ClientActionArgs) => {};

export default function Layout({}: Route.ComponentProps) {
  const [profile, setProfile] = useState<CustomUserData>();
  const [user, setUser] = useState<User>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const f = async () => {
      await auth.authStateReady();

      const currentProfile =
        auth.currentUser && getCustomProfile(auth.currentUser.uid);
      const profile = currentProfile && (await getDoc(currentProfile));
      const data = profile && (profile.data() as CustomUserData);
      setProfile(data ?? undefined);
      setLoading(false);
    };
    f();
    auth.onAuthStateChanged(async (u) => {
      setUser(u ?? undefined);
      const currentProfile = u && getCustomProfile(u.uid);
      const profile = currentProfile && (await getDoc(currentProfile));
      const data = profile && (profile.data() as CustomUserData);
      setProfile(data ?? undefined);
    });
  }, []);

  const handleSignOut = async () => {
    await auth.authStateReady();
    await signOut(auth);
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="flex justify-between w-full dark:bg-zinc-900 bg-gray-100 px-4 font-bold">
          <Link
            className="underline text-blue-600 hover:text-blue-800 px-1 py-4"
            to={"/"}
          >
            Home
          </Link>
          <div className="flex-1 flex justify-end">
            {user && !loading && (
              <>
                {profile && (
                  <Link
                    className="underline text-blue-600 hover:text-blue-800 px-1 py-4"
                    to={`users/${profile.customId}`}
                  >
                    Manage Texts
                  </Link>
                )}
                <Link
                  className="underline text-blue-600 hover:text-blue-800 px-1 py-4"
                  to={`/create`}
                >
                  Create Text
                </Link>
                <Link
                  className="underline text-blue-600 hover:text-blue-800 px-1 py-4"
                  to={`/settings`}
                >
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-blue-600 hover:text-blue-800 px-1 py-4 font-medium"
                >
                  Sign Out
                </button>
              </>
            )}
            {!user && !loading && (
              <div className="w-full flex justify-end">
                <Link
                  to={"/signup"}
                  className="underline text-blue-600 hover:text-blue-800 px-1 py-4"
                >
                  Sign Up
                </Link>
                <Link
                  to={"/signin"}
                  className="underline text-blue-600 hover:text-blue-800 px-1 py-4"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
