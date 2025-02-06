import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  startAfter,
  where,
} from "firebase/firestore";
import { db, storage } from "./firebase.client";
import type { CustomUserData, LLMText, WithTimeStamp } from "./models";
import {
  getDownloadURL,
  getMetadata,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export class CustomIdAlreadyExistsError extends Error {
  constructor(message = "CustomIdAlreadyExistsError") {
    super(message);
    this.name = "CustomIdAlreadyExistsError";
  }
}

export const getCustomProfile = (uid: string) => {
  return doc(db, "users", uid);
};

export const getCustomProfileByCustomId = (customId: string) => {
  const q = query(collection(db, "users"), where("customId", "==", customId));
  return getDocs(q);
};

export const listLLMTexts = async (
  uid: string,
  lim: number = 10,
  afterId?: string
) => {
  const after = afterId && doc(db, "users", uid, "texts", afterId);
  const q = query(
    collection(db, "users", uid, "texts"),
    orderBy("createdAt", "desc"),
    startAfter(after),
    limit(lim)
  );
  return getDocs(q);
};

export async function updateProfile(
  uid: string,
  data: Partial<CustomUserData>
) {
  const customProfileRef = doc(db, "users", uid);
  const coll = collection(db, "users");
  const q = query(coll, where("customId", "==", data.customId));
  const querySnapshot = await getDocs(q);
  const first = querySnapshot.docs[0];
  try {
    await runTransaction(db, async (transaction) => {
      if (first) {
        const f = await transaction.get(first.ref);
        const firstData = f.data();
        if (firstData && firstData?.uid !== uid) {
          throw new CustomIdAlreadyExistsError();
        }
      }

      if (first) {
        const d: WithTimeStamp<Partial<CustomUserData>> = {
          customId: data.customId,
          profile: data.profile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          uid,
        };
        transaction.update(customProfileRef, d);
      } else {
        const d: WithTimeStamp<CustomUserData> = {
          customId: data.customId ?? "",
          profile: data.profile ?? "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          uid,
        };
        transaction.set(customProfileRef, d);
      }
    });

    console.log("customId created successfully");
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
}

export const createLLMText = async (uid: string, data: LLMText) => {
  const textRef = doc(db, "users", uid, "texts", data.customId);
  // 重複チェック
  const td = await getDoc(textRef);
  if (td.exists()) {
    throw new CustomIdAlreadyExistsError();
  }
  const d: WithTimeStamp<LLMText> = {
    ...data,
    uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(textRef, d);
};

export const uploadTextFile = async (
  uid: string,
  customId: string,
  file: File
) => {
  const fileRef = ref(storage, `users/${uid}/texts/${customId}`);
  const metadata = {
    contentType: "text/plain; charset=utf-8",
  };
  try {
    const uploadTask = uploadBytesResumable(fileRef, file, metadata);
    return await uploadTask;
  } catch (error) {
    console.error("Upload error:", error);
  }
};

export const getLLMTextUrl = async (uid: string, customId: string) => {
  const fileRef = ref(storage, `users/${uid}/texts/${customId}`);
  return await getDownloadURL(fileRef);
};
