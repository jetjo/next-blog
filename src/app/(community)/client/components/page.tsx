"use client";

import { useRouter } from "next/navigation";
import SortButton from "./sort-button";
import LocalOptions from "./local-options";

export default function Page() {
  const router = useRouter();
  return (
    <>
      <SortButton></SortButton>
      <LocalOptions></LocalOptions>
    </>
  );
}
