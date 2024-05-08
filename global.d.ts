export interface Context { }

declare global {
    interface GlobalNode {
        db: typeof import('mongoose');
        db_models: { [key: string]: any };
    }

    type WriteAble<T> = {
        - readonly [P in keyof T]: T[P];
    };

}