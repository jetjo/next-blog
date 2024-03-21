import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connectOption = { dbName: "test" } as mongoose.ConnectOptions;

const ObjectId = mongoose.Schema.ObjectId;

export { mongoose as db, connectOption, ObjectId };
