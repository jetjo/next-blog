import clsx from "clsx";
import { RiCheckLine } from "react-icons/ri";
import { FaRegCheckCircle } from "react-icons/fa";

export function Check(className_ = '', { className, ...props } = { className: '' }) {
  return (
    <i className={clsx(' text-[color:var(--pass-icon-color)] text-[1.2em]', ' inline-flex', ' align-middle')}>
      <FaRegCheckCircle className={clsx(className_, className)} {...props} />
    </i>
  );
}
