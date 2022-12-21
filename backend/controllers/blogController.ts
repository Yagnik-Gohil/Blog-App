import multer from "multer";
import sharp from "sharp";
import AppError from "../utils/appError";
import Blog from "../models/blogModel";
import catchAsync from "../utils/catchAsync";

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    } else {
        callback(
            new AppError("Not an image! Please upload only images.", 400),
            false
        );
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

export const uploadBlogImages = upload.fields([
    {
        name: "background"
    },
    {
        name: "thumbnail"
    },
]);

export const resizeBlogImages = catchAsync(async (req, res, next) => {

    if(req.body.isThumbnailChange || req.body.isBackgroundChange){
        if (req.body.isBackgroundChange == "true") {
            // console.log("bg")
            req.body.background = `blog-${Date.now()}-cover.jpeg`;
            await sharp(req.files.background[0].buffer)
                // .resize(1920, 1080)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`public/images/${req.body.background}`);
        } 
        if (req.body.isThumbnailChange == "true") {
            // console.log("thumb")
            req.body.thumbnail = `blog-${Date.now()}-thumbnail.jpeg`;
            await sharp(req.files.thumbnail[0].buffer)
                // .resize(1280, 720)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`public/images/${req.body.thumbnail}`);
        }
    } else {
        if (!req.files.background || !req.files.thumbnail) return next();

        req.body.background = `blog-${Date.now()}-cover.jpeg`;
        await sharp(req.files.background[0].buffer)
            // .resize(1920, 1080)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`public/images/${req.body.background}`);
    
        req.body.thumbnail = `blog-${Date.now()}-thumbnail.jpeg`;
        await sharp(req.files.thumbnail[0].buffer)
            // .resize(1280, 720)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`public/images/${req.body.thumbnail}`);
    }
    next();
});

export const createBlog = catchAsync(async (req, res, next) => {
    if (!req.body.auther) req.body.auther = req.user.id;
    const newBlog = await Blog.create(req.body);
    res.status(201).json({ status: "success", data: newBlog });
});
export const getBlogList = catchAsync(async (req, res, next) => {
    const list = await Blog.find();
    res.status(201).json({ status: "success", total: list.length, data: list });
})
export const getMyBlogList = catchAsync(async (req, res, next) => {
    const list = await Blog.find({ auther: req.user._id });
    res.status(201).json({ status: "success", total: list.length, data: list });
})
export const getBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.find({ slug: req.params.id });
    res.status(201).json({ status: "success", data: blog[0] });
})
export const editBlog = catchAsync(async (req, res, next) => {
    // console.log(req.body)
    // console.log(req.file)
    if (!req.body.isThumbnailChange || (req.body.isThumbnailChange && req.file))
        req.body.thumbnail = req.file.filename;
    if (!req.body.isBackgroundChange || (req.body.isBackgroundChange && req.file))
        req.body.background = req.file.filename;
    // console.log(req.user.id, req.body);
    const doc = await Blog.findByIdAndUpdate(req.params.id, req.body);
    res.status(201).json({ status: "success", data: doc });
});