import clsx from "clsx";
import { RxCross2 } from "react-icons/rx";

export function Cross(className_ = '', { className, ...props } = { className: '' }) {
  return (
    <i className={clsx(' text-[color:var(--not-pass-icon-color)] text-[1.2em]', ' inline-flex', ' align-middle')}>
      <RxCross2 className={clsx(className_, className)} {...props} />
    </i>
  );
}
