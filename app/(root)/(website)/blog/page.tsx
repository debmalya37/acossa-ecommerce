import { Suspense } from "react";
import BlogClient from "./BlogClient";

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="mt-40 text-center">Loading blogs…</div>}>
      <BlogClient />
    </Suspense>
  );
}
