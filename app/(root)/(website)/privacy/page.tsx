"use client";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        ACOSSA ENTERPRISE (“we”, “our”, “us”) is committed to protecting your
        privacy. This Privacy Policy explains how we collect, use, store, and
        protect your personal information.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Name</li>
        <li>Email & phone number</li>
        <li>Shipping and billing address</li>
        <li>Payment details (handled securely by Razorpay)</li>
        <li>Device & browser information</li>
        <li>Order history</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>To process orders and payments</li>
        <li>To provide customer support</li>
        <li>To improve our website & services</li>
        <li>To send order updates and promotional messages</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">3. Payment Security</h2>
      <p className="mb-4">
        All online payments are securely processed via Razorpay. We **never
        store your card details** on our servers.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">4. Sharing of Information</h2>
      <p className="mb-4">
        We do not sell your data. We share information only with:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Trusted payment processors (Razorpay)</li>
        <li>Courier & logistics partners</li>
        <li>Fraud-prevention agencies if required</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">5. Cookies</h2>
      <p className="mb-4">
        We use cookies to provide a better user experience, analyze traffic,
        and personalize content.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">6. Data Protection</h2>
      <p className="mb-4">
        We use encryption, SSL, and security best practices to protect your
        data. However, no method of internet transmission is 100% secure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">7. International Users</h2>
      <p className="mb-4">
        If you are accessing our website from outside India, your data may be
        transferred and processed in India.
      </p>

      <p className="mt-8">Last Updated: {new Date().getFullYear()}</p>
    </div>
  );
}
