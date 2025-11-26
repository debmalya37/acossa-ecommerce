import { Suspense } from "react";
import AdminMedia from "./AdminMediaPage";

export default function AdminMediaPage() {
  return (
    <Suspense fallback={<div>Loading media...</div>}>
      <AdminMedia />
    </Suspense>
  );
}
