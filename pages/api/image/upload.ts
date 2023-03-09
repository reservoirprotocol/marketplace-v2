import { Storage } from '@google-cloud/storage';
import type {NextApiRequest, NextApiResponse} from "next";

export default async function imageUploadHandler(req: NextApiRequest, res: NextApiResponse) {
  const storage = new Storage({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
      client_email: process.env.GOOGLE_STORAGE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_STORAGE_PRIVATE_KEY,
    },
  });

  const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET_NAME as string);
  const file = bucket.file(req.query.file as string);
  const options = {
    expires: Date.now() + 60 * 1000, //  1 minute
    rewrites: true
  };

  const [response] = await file.generateSignedPostPolicyV4(options);
  res.status(200).json(response);
}
