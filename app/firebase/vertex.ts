import { helpers, PredictionServiceClient } from "@google-cloud/aiplatform";
import type { google } from "@google-cloud/aiplatform/build/protos/protos";
import type { FirebaseOptions } from "firebase/app";
const config = JSON.parse(
  import.meta.env.VITE_FIREBASE_CONFIG
) as FirebaseOptions;
const project = config.projectId;
const location = "us-central1";
const model = "text-embedding-004";
const client = new PredictionServiceClient();
const type = "SEMANTIC_SIMILARITY";

export const getEmbedding = async (text: string) => {
  const endpoint = `projects/${project}/locations/${location}/publishers/google/models/${model}`;

  const instances = helpers.toValue({
    content: text,
    task_type: type,
  }) as google.protobuf.IValue;
  try {
    const [response] = await client.predict({
      endpoint: endpoint,
      instances: [instances],
    });

    return response?.predictions?.[0].structValue?.fields?.embeddings.structValue?.fields?.values.listValue?.values?.map(
      (e) => e.numberValue as number
    );
  } catch (error) {
    console.error("Error:", error);
  }
};
