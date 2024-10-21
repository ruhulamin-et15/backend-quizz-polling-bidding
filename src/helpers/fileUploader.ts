import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: async function (req, file, cb) {
    const sanitizedFilename = file.originalname
      .toLowerCase()
      .replace(/\s+/g, "-");

    cb(null, sanitizedFilename);
  },
});

const upload = multer({ storage: storage });

const uploadArtworkImage = upload.single("artworkImage");
const updateArtworkImage = upload.single("artworkImage");
const updateUserAvatar = upload.single("avatar");

// // upload multiple image
// const uploadRiderVehicleInfo = upload.fields([
//   { name: "vehicleRegistrationImage", maxCount: 1 },
//   { name: "vehicleInsuranceImage", maxCount: 1 },
//   { name: "drivingLicenceImage", maxCount: 1 },
// ]);

export const fileUploader = {
  upload,
  uploadArtworkImage,
  updateArtworkImage,
  updateUserAvatar,
};
