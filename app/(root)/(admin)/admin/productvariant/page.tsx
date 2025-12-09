import { Suspense } from "react";
import ShowProductVariantClient from "./ShowProductVariantClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading product variants…</div>}>
      <ShowProductVariantClient />
    </Suspense>
  );
}
