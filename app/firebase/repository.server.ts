import { db, storage } from "./firebase.server";
import { Readable } from "stream";
import type { LLMText } from "./models";
import { getDownloadURL } from "firebase-admin/storage";
import { Timestamp } from "firebase-admin/firestore";
type WithTimeStamp<T> = {
  createdAt: Timestamp;
  updatedAt: Timestamp;
} & T;

export const getCustomProfile = (uid: string) => {
  return db.collection("users").doc(uid).get();
};

export const getCustomProfileByCustomId = (customId: string) => {
  return db.collection("users").where("customId", "==", customId).get();
};

export const getLLMTextByCustomId = async (uid: string, customId: string) => {
  return db
    .collection("texts")
    .where("customId", "==", customId)
    .where("uid", "==", uid)
    .get();
};
export const getLLMText = async (id: string) => {
  return db.collection("texts").doc(id).get();
};

export const listLLMTexts = async (
  uid: string,
  limit: number = 10,
  offset: number = 0
) => {
  const col = await db
    .collection("texts")
    .where("uid", "==", uid)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .offset(offset)
    .get();
  return col.docs;
};

export const listRecentLLMTexts = async (
  limit: number = 10,
  offset: number = 0
) => {
  const col = await db
    .collection("texts")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .offset(offset)
    .get();
  return col.docs;
};

export const searchTextNameBySim = async (
  queryName: string,
  offset: number = 0,
  limit: number = 10
) => {};

export const searchTextByUrl = async (
  query: string,
  offset: number = 0,
  limit: number = 10
) => {
  return await db
    .collection("texts")
    .orderBy("webpage")
    .startAt(query)
    .endAt(query + "\uf8ff")
    .limit(limit)
    .offset(offset)
    .get();
};

export const countLLMText = async (uid: string) => {
  const c = db.collection("texts");
  const q = c.where("uid", "==", uid);
  const snapshot = await q.count().get();
  return snapshot.data().count;
};

export const uploadTextFile = async (
  uid: string,
  customId: string,
  file: File
) => {
  const bucket = storage.bucket();
  const filePath = `users/${uid}/texts/${customId}`;
  const fileRef = bucket.file(filePath);

  const stream = Readable.from(Buffer.from(await file.arrayBuffer()));
  const metadata = {
    contentType: "text/plain; charset=utf-8",
  };

  try {
    await new Promise((resolve, reject) => {
      const writeStream = fileRef.createWriteStream({ metadata });

      stream.pipe(writeStream).on("finish", resolve).on("error", reject);
    });

    return fileRef;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const getLLMTextUrl = async (uid: string, customId: string) => {
  const bucket = storage.bucket();
  const filePath = `users/${uid}/texts/${customId}`;
  const fileRef = bucket.file(filePath);

  try {
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
};

export const createLLMText = async (uid: string, data: LLMText) => {
  const c = db.collection("texts");

  // 重複チェック
  const q = c.where("uid", "==", uid).where("customId", "==", data.customId);
  const s = await q.get();

  if (!s.empty) {
    throw new Error("ID already exists.");
  }

  const d: WithTimeStamp<LLMText> = {
    ...data,
    uid,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await c.add(d);
};
