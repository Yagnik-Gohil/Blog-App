const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "A Blog must have a Title"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "A Blog must have a Description"],
    trim: true,
  },
  thumbnail: {
    type: String,
    default: "thumbnail.jpeg",
  },
  background: {
    type: String,
    default: "background.jpg",
  },
  auther: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  slug: {
    type: String,
  },
});

blogSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});
blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: "auther",
    select: "name image",
  });
  next();
});
const Blog = mongoose.model("Blog", blogSchema);

export default Blog
