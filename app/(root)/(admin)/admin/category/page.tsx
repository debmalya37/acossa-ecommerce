import { Suspense } from "react";
import ShowCategoryClient from "./ShowCategoryClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading categories…</div>}>
      <ShowCategoryClient />
    </Suspense>
  );
}
