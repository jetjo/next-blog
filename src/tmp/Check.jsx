import { RiCheckLine } from "react-icons/ri";

export function Check(props = {}) {
  return (
    <i style={{ color: "#4fdc5f" }}>
      <RiCheckLine {...props} />
    </i>
  );
}
