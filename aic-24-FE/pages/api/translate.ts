// pages/api/translate.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as TranslateV2 } from "@google-cloud/translate";

type Data = {
  translatedText?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { queryString } = req.body;

  if (!queryString) {
    res.status(400).json({ error: "Missing queryString" });
    return;
  }

  try {
    const CREDENTIALS = JSON.parse(process.env.NEXT_PUBLIC_API_CREDENTIAL || "");

    const translate = new TranslateV2.Translate({
      credentials: CREDENTIALS,
      projectId: CREDENTIALS.project_id,
    });

    const [response] = await translate.translate(queryString, {
      from: "vi",
      to: "en",
    });

    res.status(200).json({ translatedText: response });
  } catch (error: any) {
    console.error("Error during translation:", error);
    res.status(500).json({ error: error.message });
  }
}
