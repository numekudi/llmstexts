import { db } from "./firebase.server";

export const getCustomProfile = (uid: string) => {
  return db.collection("users").doc(uid).get();
};

export const getCustomProfileByCustomId = (customId: string) => {
  return db.collection("users").where("customId", "==", customId).get();
};

export const listLLMTexts = async (
  uid: string,
  limit: number = 10,
  offset: number = 0
) => {
  const col = await db
    .collection("users")
    .doc(uid)
    .collection("texts")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .offset(offset)
    .get();
  return col.docs;
};
