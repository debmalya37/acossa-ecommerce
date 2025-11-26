"use client";

export default function ReturnPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-6">Return & Replacement Policy</h1>

      <p className="mb-4">
        ACOSSA ENTERPRISE offers easy returns and replacements under the
        conditions mentioned below.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">1. Return Eligibility</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Return window: <strong>7 days</strong> from delivery</li>
        <li>Item must be unused, unwashed & in original packaging</li>
        <li>Tags and labels must be intact</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">2. Non-Returnable Products</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Used or washed products</li>
        <li>Hygiene-sensitive categories</li>
        <li>Customized stitching or fall-pico sarees</li>
        <li>Discounted or clearance sale products</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">3. Replacement</h2>
      <p className="mb-4">
        If your product is damaged or defective, we will provide a replacement
        at no extra cost.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">4. Return Shipping</h2>
      <p className="mb-4">
        For international customers, return shipping charges must be borne by
        the customer unless the product is defective.
      </p>

      <p className="mt-8">Last Updated: {new Date().getFullYear()}</p>
    </div>
  );
}
