export interface Context { }

declare global {
    interface GlobalNode {
        db: typeof import('mongoose');
        db_models: (typeof import('mongoose'))['models'];
    }

    type WriteAble<T> = {
        - readonly [P in keyof T]: T[P];
    };

}

// import { CSSProp } from "styled-components";

// declare module "styled-components" {
//   export interface DefaultTheme {
//     // Your theme stuff here
//   }
// }

declare module "react" {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        // css?: CSSProp;
        theme?: string
    }
}

// declare module '*.mdx' {
//     let MDXComponent: (props: any) => JSX.Element;
//     export default MDXComponent;
// }
