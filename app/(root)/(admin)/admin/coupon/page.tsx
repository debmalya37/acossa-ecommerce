import { Suspense } from "react";
import ShowCouponClient from "./ShowCouponClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading coupons…</div>}>
      <ShowCouponClient />
    </Suspense>
  );
}
