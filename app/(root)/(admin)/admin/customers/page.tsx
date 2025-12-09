import { Suspense } from "react";
import ShowCustomerClient from "./ShowCustomerClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading customers…</div>}>
      <ShowCustomerClient />
    </Suspense>
  );
}
