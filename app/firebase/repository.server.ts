import { db } from "./firebase.server";

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
