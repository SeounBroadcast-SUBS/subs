import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  mediaPost: f(["blob"]).onUploadComplete(async (data) => {
    console.log("file:", data);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
