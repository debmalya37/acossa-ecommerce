import { Suspense } from "react";
import ShowOrderClient from "./ShowOrderClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading orders…</div>}>
      <ShowOrderClient />
    </Suspense>
  );
}
