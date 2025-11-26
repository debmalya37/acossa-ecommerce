import { Suspense } from "react";
import TrashPage from "./Trash";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Trash...</div>}>
      <TrashPage />
    </Suspense>
  );
}
