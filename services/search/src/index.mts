import { Model } from "@db/blog-model/index.mjs";

Model.Blog.watch().on('change', change => console.log(change))
