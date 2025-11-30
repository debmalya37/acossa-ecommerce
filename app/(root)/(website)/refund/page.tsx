"use client";

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-5 mt-52">
      <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>

      <p className="mb-4">
        At ACOSSA ENTERPRISE, customer satisfaction is our priority. Please
        read our refund guidelines carefully.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">1. Refund Eligibility</h2>
      <p className="mb-4">
        Refunds are applicable only in the following situations:
      </p>

      <ul className="list-disc ml-6 mb-4">
        <li>You received a damaged or defective item</li>
        <li>You received the wrong product</li>
        <li>Your order was cancelled before dispatch</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">2. Non-Refundable Items</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Used or washed products</li>
        <li>Products damaged due to customer handling</li>
        <li>Customized or altered products</li>
        <li>International orders (except if product is damaged)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">3. Refund Timeframe</h2>
      <p className="mb-4">
        Approved refunds are processed within **7–10 business days** back to the
        original payment method (via Razorpay or card issuer).
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">4. How to Request a Refund</h2>
      <p className="mb-4">
        Email us at: <strong>support@acossa.com</strong> with:
      </p>

      <ul className="list-disc ml-6 mb-4">
        <li>Order ID</li>
        <li>Reason for refund</li>
        <li>Photos or videos of issue (if applicable)</li>
      </ul>

      <p className="mt-8">Last Updated: {new Date().getFullYear()}</p>
    </div>
  );
}
