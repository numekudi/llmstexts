import type { FieldValue } from "firebase/firestore";

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
  customName: string;
  filename: string | null;
  description: string | null;
  webpage?: string;
  inputType: "file" | "url";
  downloadUrl: string;
};
