"use client";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <p className="mb-4">
        Welcome to ACOSSA ENTERPRISE (“we”, “our”, “us”). By accessing or using
        our website and services, you agree to comply with the following Terms
        & Conditions. Please read them carefully.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">1. General</h2>
      <p className="mb-4">
        These Terms apply to all purchases made on our website and to all users
        visiting or browsing our online store. We reserve the right to update
        or modify these Terms at any time without prior notice.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">2. Eligibility</h2>
      <p className="mb-4">
        You must be at least 18 years old to make a purchase. By purchasing
        from us, you confirm that the information you provide is accurate and
        complete.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">3. Pricing & Currency</h2>
      <p className="mb-4">
        All prices displayed on our website are listed in <strong>USD (United
        States Dollar)</strong>. Prices may change without notice.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">4. Payment</h2>
      <p className="mb-4">
        We accept secure online payments using Razorpay, international cards,
        and other supported payment gateways. By completing a purchase, you
        authorize us to charge the provided payment method.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">5. Order Confirmation</h2>
      <p className="mb-4">
        After placing an order, you will receive an order confirmation email.
        This does not guarantee product availability. We reserve the right to
        cancel or refuse an order for any reason and issue a refund if
        applicable.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">6. Intellectual Property</h2>
      <p className="mb-4">
        All content on this website, including images, text, logos, graphics,
        and designs, is the intellectual property of ACOSSA ENTERPRISE. You may
        not copy, reproduce, or use it without written permission.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">7. Limitation of Liability</h2>
      <p className="mb-4">
        We are not responsible for delays, failures, or damages caused by events
        beyond our control, including customs delays, courier disruptions, or
        inaccurate customer information.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">8. Governing Law</h2>
      <p className="mb-4">
        These Terms shall be governed by the laws of India. Any disputes shall
        be subject to the jurisdiction of the courts in India.
      </p>

      <p className="mt-8">Last Updated: {new Date().getFullYear()}</p>
    </div>
  );
}
