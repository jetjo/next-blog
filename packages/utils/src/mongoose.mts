import mongoose from "mongoose";
import mongodb from "mongodb";

mongoose.set("strictQuery", false);

const connectOption = { dbName: "test" } as mongoose.ConnectOptions;

const ObjectId = mongoose.Schema.ObjectId;

const _dbOptions = {} as mongoose.MongooseOptions;

const dbOption = new Proxy(_dbOptions, {
  set(target, prop, value, receiver) {
    // const curVal = mongoose.get(prop);
    if (prop === "bufferCommands" && value === false) {
      throw new Error("bufferCommands must be true");
    }
    // return Reflect.set(target, prop, value, receiver);
    // @ts-ignore
    mongoose.set(prop, value);
    return true;
  },
});

export { mongodb, mongoose as db, connectOption, ObjectId, dbOption };
