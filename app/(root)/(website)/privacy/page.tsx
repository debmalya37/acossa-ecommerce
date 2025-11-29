"use client";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-5 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-6">
        This Privacy Policy explains how <strong>Feather International Pvt. Ltd.</strong>,
        operating as <strong>Acossa Enterprise</strong> (&quot;Company&quot;, &quot;We&quot;, 
        &quot;Us&quot;, or &quot;Our&quot;), collects, uses, and protects personal information 
        of users (&quot;You&quot; or &quot;Your&quot;) who access or interact with our website{" "}
        <strong>www.acossaenterprise.com</strong> (&quot;Website&quot;).
      </p>

      <p className="mb-8">
        By using our Website or services, you agree to the terms of this Privacy Policy.
      </p>

      {/* -------------------------------------------------- */}
      <h2 className="text-xl font-semibold mt-8 mb-4">
        Information We Collect
      </h2>

      <p className="mb-4">
        We collect personal and non-personal data to provide better user experiences 
        and facilitate our sales operations. This may include:
      </p>

      <ul className="list-disc ml-6 space-y-2 mb-6">
        <li>Your name, contact details, shipping and billing addresses</li>
        <li>Account registration details such as username, email, and password</li>
        <li>Payment information for completed transactions</li>
        <li>Order history, preferences, and communication records</li>
        <li>
          Technical details such as IP address, browser type, device information, 
          and approximate location data
        </li>
      </ul>

      <p className="mb-6">
        We also collect information through cookies, analytics tools, and log files 
        to enhance Website performance and improve marketing relevance.
      </p>

      {/* -------------------------------------------------- */}
      <h2 className="text-xl font-semibold mt-8 mb-4">
        How We Use Your Information
      </h2>

      <ul className="list-disc ml-6 space-y-2 mb-6">
        <li>Process orders, payments, returns, and shipments</li>
        <li>Communicate order updates, promotions, or policy changes</li>
        <li>Improve Website usability, recommendations, and customer experience</li>
        <li>Send transactional messages, newsletters, and service notifications</li>
        <li>Prevent fraud and comply with legal or regulatory obligations</li>
      </ul>

      <p className="mb-6">
        You may unsubscribe from promotional communications at any time by using 
        the opt-out link in emails or by contacting us directly.
      </p>

      {/* -------------------------------------------------- */}
      <h2 className="text-xl font-semibold mt-8 mb-4">
        Sharing and Disclosure
      </h2>

      <p className="mb-4">
        We do <strong>not sell customer data</strong>. However, limited information may 
        be shared with:
      </p>

      <ul className="list-disc ml-6 space-y-2 mb-6">
        <li>Service providers handling logistics, payments, or analytics</li>
        <li>Marketing or advertising partners operating under confidentiality agreements</li>
        <li>Government or legal authorities when required by law</li>
      </ul>

      <p className="mb-6">
        Any information shared follows strict confidentiality and data protection 
        standards.
      </p>

      {/* -------------------------------------------------- */}
      <h2 className="text-xl font-semibold mt-8 mb-4">
        Cookies and Tracking
      </h2>

      <p className="mb-6">
        Cookies help us optimize browsing experience, maintain shopping carts, 
        and analyze campaign performance. We may use tools such as Google Analytics 
        to collect aggregated visitor insights.
      </p>

      <p className="mb-6">
        You may disable cookies through your browser settings, though certain site 
        features may not function as intended.
      </p>

      {/* -------------------------------------------------- */}
      <h2 className="text-xl font-semibold mt-8 mb-4">
        Data Security
      </h2>

      <p className="mb-6">
        Your data security is important to us. We use SSL encryption and secure 
        payment gateways to protect your information. While we follow 
        industry-standard safeguards, no internet transmission is completely secure.
      </p>

      <p className="mb-6">
        Once received, we apply commercially reasonable measures to protect stored 
        data from unauthorized access or misuse.
      </p>

      {/* -------------------------------------------------- */}
      <h2 className="text-xl font-semibold mt-8 mb-4">
        International Transfers
      </h2>

      <p className="mb-6">
        As an export-focused company, your data may be transferred to and stored 
        on servers outside your region. By submitting information, you consent 
        to such transfers in compliance with Indian data protection laws.
      </p>

      {/* -------------------------------------------------- */}
      <h2 className="text-xl font-semibold mt-8 mb-4">
        Retention and Deletion
      </h2>

      <p className="mb-6">
        We retain personal data only as long as necessary to fulfill orders, 
        provide services, or comply with legal obligations. You may request 
        correction or deletion of your data by contacting us.
      </p>

      {/* -------------------------------------------------- */}
      <h2 className="text-xl font-semibold mt-8 mb-4">
        Updates to This Policy
      </h2>

      <p className="mb-6">
        This Privacy Policy may be updated periodically to reflect operational, 
        legal, or regulatory changes. Updates will be posted on this page with 
        a revised effective date.
      </p>

      {/* -------------------------------------------------- */}
      <h2 className="text-xl font-semibold mt-8 mb-4">
        Contact Us
      </h2>

      <p className="mb-2">
        For privacy concerns, data deletion requests, or other queries, please contact:
      </p>

      <p className="font-medium">
        Acossa Enterprise (Feather International Pvt. Ltd.)
      </p>
      <p>Email: info@acossaenterprise.com</p>
      <p>Phone / WhatsApp: +91-9638000593</p>

      <p className="mt-10 text-sm text-gray-500">
        Last Updated: {new Date().getFullYear()}
      </p>
    </div>
  );
}
