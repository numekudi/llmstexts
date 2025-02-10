import {
  addDoc,
  collection,
  count,
  deleteDoc,
  doc,
  getCountFromServer,
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
  ref,
  uploadBytesResumable,
  deleteObject,
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

export const getText = async (uid: string, customId: string) => {
  const q = query(collection(db, "texts"), where("customId", "==", customId));
  return await getDocs(q);
};

export const deleteText = async (uid: string, customId: string) => {
  const docs = await getText(uid, customId);
  const d = docs.docs[0];
  if (d) {
    await deleteDoc(d.ref);
  }
  return;
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
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
}

export const createLLMText = async (uid: string, data: LLMText) => {
  const c = collection(db, "texts");
  // 重複チェック
  const q = query(
    c,
    where("uid", "==", uid),
    where("customId", "==", data.customId)
  );
  const s = await getDocs(q);
  if (!s.empty) {
    throw new CustomIdAlreadyExistsError();
  }
  const d: WithTimeStamp<LLMText> = {
    ...data,
    uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await addDoc(c, d);
};

export const countLLMText = async (uid: string) => {
  const c = collection(db, "texts");
  const q = query(c, where("uid", "==", uid));
  const res = await getCountFromServer(q);
  return res.data().count;
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

export const deleteTextFile = async (uid: string, customId: string) => {
  const fileRef = ref(storage, `users/${uid}/texts/${customId}`);
  try {
    return await deleteObject(fileRef);
  } catch (error) {
    console.error("Upload error:", error);
  }
};

export const getLLMTextUrl = async (uid: string, customId: string) => {
  const fileRef = ref(storage, `users/${uid}/texts/${customId}`);
  return await getDownloadURL(fileRef);
};
