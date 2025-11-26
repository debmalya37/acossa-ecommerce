import { Suspense } from "react";
import ShopPage from "./Shop";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopPage />
    </Suspense>
  );
}
