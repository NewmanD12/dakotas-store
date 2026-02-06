import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  image: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .onUploadComplete(({ file }) => {
      console.log("Uploaded:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;