import express from "express";
import {protect, updatePassword} from "../controllers/authController";
import {getUserDetails, uploadUserPhoto, resizeUserPhoto, updateUserData} from "../controllers/accountControlle";

const router = express.Router();

router.route("/").get(protect, getUserDetails);
router
  .route("/")
  .patch(
    protect,
    uploadUserPhoto,
    resizeUserPhoto,
    updateUserData
  );
router
  .route("/updatePassword")
  .patch(protect, updatePassword);

export default router;
