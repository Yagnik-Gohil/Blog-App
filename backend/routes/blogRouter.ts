import express from "express";
import { protect } from "../controllers/authController";
import { uploadBlogImages, resizeBlogImages, createBlog, getBlogList, getMyBlogList, getBlog, editBlog } from "../controllers/blogController";

const router = express.Router();

router.route("/").post(protect, uploadBlogImages, resizeBlogImages, createBlog);
router
  .route("/edit/:id")
  .patch(
    protect,
    uploadBlogImages,
    resizeBlogImages,
    editBlog
  );
router.route("/").get(getBlogList);
router.route("/my-blogs").get(protect, getMyBlogList);
router.route("/:id").get(getBlog);

export default router;
