import { ObjectId, db, connectOption, dbOption } from "@/utils/mongoose";

let uri = process.env.db_mongoDB; // "mongodb://localhost:27017";
connectOption.dbName = process.env.dbName;

uri = `${uri}/${connectOption.dbName}`;
await db.connect(uri, connectOption);

export { ObjectId, db, dbOption };
