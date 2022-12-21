import multer from "multer";
import sharp from "sharp";
import AppError from "../utils/appError";
import User from "../models/userModel";
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

export const uploadUserPhoto = upload.single("image");

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (req.file) {
        req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`public/users/${req.file.filename}`);
        next();
    } else if (req.body.isUpdate) {
        return next();
    } else {
        return next(new AppError("Please upload an image", 401));
    }
});

export const getUserDetails = catchAsync(async (req, res, next) => {
    const user = await User.findById({ _id: req.user.id });
    res.status(200).json({ status: "success", data: user });
});

export const updateUserData = catchAsync(async (req, res, next) => {
    // console.log(!req.body.isUpdate || (req.body.isUpdate && req.file))
    if (!req.body.isUpdate || (req.body.isUpdate && req.file))
        req.body.image = req.file.filename;
    // console.log(req.user.id, req.body);
    const doc = await User.findByIdAndUpdate(req.user.id, req.body);
    res.status(201).json({ status: "success", data: doc });
});

export const updatePassword = catchAsync(async (req, res, next) => {
    return next(new AppError("Not Implemented", 400));
})
