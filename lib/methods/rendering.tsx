import { IconType } from "react-icons/lib";

export function renderIcon(icon: IconType, size: number = 12) {
  return icon({ size, className: "shrink-0" });
}
