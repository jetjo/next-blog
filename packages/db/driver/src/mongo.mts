import { ObjectId, db as _db, connectOption, dbOption, mongodb } from "utils/mongoose.mjs";

const _GLOBAL = globalThis as unknown as GlobalNode;

_GLOBAL.db ||= _db;

const db = _GLOBAL.db;

const server = process.env.db_mongoDB; // "mongodb://localhost:27017";
connectOption.dbName = process.env.dbName;

const uri = `${server}/${connectOption.dbName}`;
await db.connect(uri, connectOption);

export { ObjectId, db, dbOption, mongodb };

