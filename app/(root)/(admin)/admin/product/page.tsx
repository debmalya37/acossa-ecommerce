import { Suspense } from "react";
import ShowProductClient from "./ShowProductClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading products…</div>}>
      <ShowProductClient />
    </Suspense>
  );
}
