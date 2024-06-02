import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import nextConnect from "next-connect";

// Set up Multer storage
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads", // Ensure this directory exists
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry, something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

// Apply Multer middleware
apiRoute.use(upload.single("file"));

apiRoute.post((req, res) => {
  res.status(200).json({ data: "File uploaded successfully" });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, so Multer can handle it
  },
};
