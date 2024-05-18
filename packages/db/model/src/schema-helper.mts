import type { Schema } from "mongoose";
import { db, dbOption } from "@db/driver";

const _GLOBAL = globalThis as unknown as GlobalNode;

_GLOBAL.db_models = _GLOBAL.db.models;

export const SchemaCtor = db.Schema;

export type IModel = {
    readonly _id: string
    readonly date?: string
}

export const ModelGen_ = <S extends Schema, DK extends string>(name = '', schema: S, defineKeys: DK) => {
    const Model = (_GLOBAL.db_models[name] as unknown as false) || db.model(name, schema);
    _GLOBAL.db_models[name] ||= Model;
    type IDoc = InstanceType<typeof Model>;

    type IPojo = {
        - readonly [key in DK]: IDoc[key];
    } & IModel;

    const M = Model as (typeof Model & { doc: IDoc, pojo: IPojo })
    M.doc = null as unknown as IDoc;
    M.pojo = null as unknown as IPojo;
    return M;
}
