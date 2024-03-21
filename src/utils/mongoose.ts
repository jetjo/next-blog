import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connectionOptDef = { dbName: "test" } as mongoose.ConnectOptions;
async function createDBConnection(
  uri = "mongodb://localhost:27017",
  opts = connectionOptDef
) {
  uri = `${uri}/${opts.dbName}`;
  const con = await mongoose.connect(uri, opts);
  return con;
}

const schemaOptDef = { timestamps: true };

function createModel(name = "", schemaDef = {}, schemaOpts = schemaOptDef) {
  const schema = new mongoose.Schema(schemaDef, schemaOpts);
  const model = mongoose.model(name, schema);
  model.schema = schema;
  return { [name]: model };
}

export type CollectionOptions = {
  [collectionName: string]: {
    schemaDefine: any;
    schemaOptions?: any;
  };
};

const collectionOptDef: CollectionOptions = {};

export async function createCollectionEndpoint(
  _uri = "",
  _connectOption = connectionOptDef,
  {
    collectionOptions = collectionOptDef,
    uri = "mongodb://localhost:27017",
    connectOption = connectionOptDef,
  } = {}
) {
  uri ||= _uri;
  connectOption = Object.assign({}, _connectOption, connectOption);
  const con = await createDBConnection(uri, connectOption);
  const models = {};
  for (const [name, { schemaDefine, schemaOptions }] of Object.entries(
    collectionOptions
  )) {
    Object.assign(models, createModel(name, schemaDefine, schemaOptions));
  }
  return { con, models };
}
