import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
export const hasHeadingsData = (data) => data instanceof Object &&
    data.hasOwnProperty("headings") &&
    data.headings instanceof Array;
export const headings = (root) => {
    const headingList = [];
    visit(root, "heading", (node) => {
        const heading = {
            depth: node.depth,
            value: toString(node, { includeImageAlt: false }),
        };
        // Other remark plugins can store arbitrary data
        // inside a node's `data` property, such as a
        // custom heading id.
        const data = node?.data;
        if (data) {
            // @ts-ignore
            heading.data = data;
        }
        // @ts-ignore
        headingList.push(heading);
    });
    return headingList;
};
export default function remarkHeadings() {
    return (node, file) => {
        file.data.headings = headings(node);
    };
}
