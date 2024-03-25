import _Link from "next/link";

interface LinkProps {
  Link?: ((children: any) => JSX.Element) | typeof _Link;
  Icon?: () => JSX.Element;
  title: string;
  mode?: "text" | "icon" | "auto";
}

// prettier-ignore
export default function RLink({ Link, Icon, mode="auto", ...props }: LinkProps) {
  const Lk: any = Link || _Link;
  // prettier-ignore
  const titleClass = mode === "auto" ? "hidden md:inline-block" : "inline-block";
  const iconClass = mode === "auto" ? `inline-block md:hidden` : "inline-block";
  return (
    <Lk {...props}>
      {mode !== "icon" && <span className={titleClass}>{props.title}</span>}
      {mode !== "text" && <i className={iconClass}>{Icon && <Icon />}</i>}
    </Lk>
  );
}
