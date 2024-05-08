import type { Props } from "../../types/types.[tag]";
import { capitalize } from "lodash-es";
import { FaTags } from "react-icons/fa6";

export default function Page(props: Props) {
    const tag = capitalize(decodeURIComponent(props.params.tag));
    return (<>
        <i><FaTags /></i>
        {tag}系列文章</>)
}