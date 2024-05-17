import { BlogModel } from "@db/blog-model";

BlogModel.watch().on('change', change => console.log(change))
