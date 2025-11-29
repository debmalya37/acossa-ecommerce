"use client";

export default function CancellationPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-5 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Cancellation Policy</h1>

      <p className="mb-6">
        This Cancellation Policy outlines the terms and conditions under which
        orders placed on <strong>Acossa Enterprise</strong> may be cancelled.
        By placing an order on our website, you agree to the terms below.
      </p>

      {/* SECTION 1 */}
      <h2 className="text-xl font-semibold mt-8 mb-3">
        What is Acossa’s Cancellation Policy?
      </h2>
      <p className="mb-4">
        You may cancel your order until it is marked <strong>“Ready to Ship”</strong>
        in our warehouse. This applies to both regular and sale items.
      </p>
      <p className="mb-4">
        If the order has already entered packing or production, cancellation may
        no longer be possible. In such cases, please reach out to our Customer
        Care team for assistance.
      </p>

      {/* SECTION 2 */}
      <h2 className="text-xl font-semibold mt-8 mb-3">
        How do I cancel my order?
      </h2>
      <ul className="list-disc ml-6 mb-4 space-y-2">
        <li>
          Use the <strong>“Cancel Order”</strong> option available on your Order
          page before dispatch.
        </li>
        <li>
          Alternatively, email us at{" "}
          <a
            href="mailto:info@acossaenterprise.com"
            className="text-rose-600 underline"
          >
            info@acossaenterprise.com
          </a>{" "}
          or call/WhatsApp us at{" "}
          <strong>+91 9638000593</strong>, mentioning your Order ID.
        </li>
      </ul>
      <p className="mb-4">
        Orders can only be cancelled <strong>before handover to the courier</strong>.
      </p>

      {/* SECTION 3 */}
      <h2 className="text-xl font-semibold mt-8 mb-3">
        Refund Timeline After Cancellation
      </h2>
      <p className="mb-4">
        For prepaid orders, refunds are initiated once cancellation is confirmed.
        The refunded amount typically reflects in the original payment method
        within <strong>5–7 business days</strong>.
      </p>
      <p className="mb-4 text-sm text-gray-600">
        Please note: Actual credit time may vary based on bank, card issuer, or
        payment gateway processing timelines.
      </p>

      {/* SECTION 4 */}
      <h2 className="text-xl font-semibold mt-8 mb-3">
        Additional Notes
      </h2>
      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>
          <strong>Custom stitched, altered, or made-to-measure items</strong> become
          non-cancellable once production begins.
        </li>
        <li>
          If your order has already been dispatched, please refuse delivery.
          Refunds will be processed after the item is received back and passes
          quality checks, as per our Returns & Exchange Policy.
        </li>
        <li>
          During festive launches or high-demand sale events, the cancellation
          window may be shorter. The applicable cut-off time will be shown at
          checkout and on your Order page.
        </li>
      </ul>

      {/* CONTACT */}
      <div className="border-t pt-6 mt-10 text-sm">
        <p className="font-medium mb-1">Need help with your order?</p>
        <p>
          Email:{" "}
          <a
            href="mailto:info@acossaenterprise.com"
            className="text-rose-600 underline"
          >
            info@acossaenterprise.com
          </a>
        </p>
        <p>Phone / WhatsApp: +91 9638000593</p>
      </div>

      <p className="mt-8 text-xs text-gray-500">
        Last Updated: {new Date().getFullYear()}
      </p>
    </div>
  );
}
