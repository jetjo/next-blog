"use client";

import { useRouter } from "next/navigation";
import SortButton from "./components/sort-button";
import LocalOptions from "./components/local-options";

export default function Page() {
  const router = useRouter();
  return (
    <>
      <SortButton></SortButton>
      <LocalOptions></LocalOptions>
    </>
  );
}
