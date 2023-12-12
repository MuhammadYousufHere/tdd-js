import mongoose, { Schema, Types, model } from "mongoose";
import { IArticle } from "./article-types";

mongoose.Schema.Types.String.set("trim", true);

const articleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: [true, `Title is required`],
    },
    content: {
      type: String,
      required: [true, `Content is required`],
    },
    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "Owner ID is required"],
    },
  },
  { timestamps: true }
);

const Article = model("Article", articleSchema);

export default Article;
