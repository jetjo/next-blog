import { ObjectId, db, connectOption } from "@/utils/mongoose";

let uri = "mongodb://localhost:27017";

uri = `${uri}/${connectOption.dbName}`;
await db.connect(uri, connectOption);

export { ObjectId, db };
