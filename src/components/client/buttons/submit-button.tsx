"use client";
import clsx from "clsx";
import { useFormStatus } from "react-dom";
import { BiSave } from "react-icons/bi";

export function SubmitButton({
  children,
  className,
  ...props
}: {
  children: string;
  className: any;
  props?: unknown;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      className={clsx(
        className,
        " inline-flex items-center",
        pending ? "cursor-wait" : "cursor-pointer"
      )}
      {...props}
      disabled={pending}
    >
      {/* {children || "Submit"} */}
      <BiSave />
    </button>
  );
}
