"use client";

export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>

      <p className="mb-4">
        ACOSSA ENTERPRISE ships worldwide. All prices and charges on our website
        are shown in <strong>USD</strong>.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">1. Processing Time</h2>
      <p className="mb-4">
        Orders are processed within <strong>1–3 business days</strong>. During
        festivals or high-volume periods, processing may take longer.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">2. Shipping Time</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>India: 3–7 business days</li>
        <li>USA / Canada / UK: 7–12 business days</li>
        <li>Europe: 7–15 business days</li>
        <li>Australia & Asia: 7–12 business days</li>
        <li>Rest of World: 10–20 business days</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">3. Tracking</h2>
      <p className="mb-4">
        A tracking link will be emailed after your order is shipped.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">4. Customs & Duties</h2>
      <p className="mb-4">
        International orders may be subject to customs duties depending on your
        country. These charges must be paid by the customer.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">5. Wrong Address Disclaimer</h2>
      <p className="mb-4">
        We are not responsible for failed deliveries due to incorrect or
        incomplete addresses provided by the customer.
      </p>

      <p className="mt-8">Last Updated: {new Date().getFullYear()}</p>
    </div>
  );
}
