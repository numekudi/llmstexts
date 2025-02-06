import type { FieldValue, WithFieldValue } from "firebase/firestore";

export type WithTimeStamp<T> = {
  createdAt: FieldValue;
  updatedAt: FieldValue;
} & T;

export type CustomUserData = {
  uid: string;
  customId: string;
  profile: string;
};

export type LLMText = {
  uid: string;
  customId: string;
  name: string | null;
  description: string | null;
  inputType: "file" | "url";
  externalUrl: string | null;
};
