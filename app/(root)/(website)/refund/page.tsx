"use client";

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-5 mt-52">
      <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>

      <h2 className="text-xl font-semibold mt-6 mb-3">
        Refunds and store credit
      </h2>
      <ul className="list-disc ml-6 mb-4 space-y-4">
        <li>
          <strong>Mode:</strong> Refunds are issued as store credit by default.
          Prepaid refunds to original payment method are available only for
          wrong/defective items where store credit isn’t accepted or required by
          law.
        </li>
        <li>
          <strong>Timelines:</strong> Store credit within 48 hours after QC
          approval. Original‑method refunds (when applicable) are initiated
          within 5–7 business days post‑approval; bank posting times may vary by
          issuer/country.
        </li>
        <li>
          <strong>Deductions:</strong> Original shipping, COD, duties/taxes, and
          payment gateway fees are non‑refundable unless the return is due to
          our error.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">International orders</h2>
      <ul className="list-disc ml-6 mb-4 space-y-4">
        <li>
          <strong>Duties and taxes:</strong> Import duties/VAT paid to customs
          are non‑refundable by Acossa. For eligible returns, claim with your
          local customs office where applicable.
        </li>
        <li>
          <strong>Transit damage or tampering:</strong> Refuse delivery for
          visibly opened/tampered parcels and notify us within 24 hours with
          photos; accepted “open/tampered” deliveries may not be eligible.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">Exchanges</h2>
      <p className="mb-4">
        One‑time exchange is possible for eligible items and sizes, subject to
        stock. If unavailable, store credit will be issued. Price differences
        (if any) apply at the time of exchange.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Important notes</h2>
      <ul className="list-disc ml-6 mb-4 space-y-4">
        <li>
          <strong>Reverse pickup attempts:</strong> Up to two attempts; failure
          to hand over will auto‑cancel the return request.
        </li>
        <li>
          <strong>Combo/BOGO:</strong> Partial returns recalibrate discounts;
          kept items revert to full price and credit is adjusted accordingly.
        </li>
        <li>
          <strong>Marketplace orders:</strong> Items purchased via third‑party
          marketplaces must follow that platform’s return process.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">Need help?</h2>
      <ul className="list-none ml-0 mb-4 space-y-4">
        <li>
          <strong>Email:</strong> info@acossaenterprise.com
        </li>
        <li>
          <strong>WhatsApp/Phone:</strong> +91-9638000593
        </li>
        <li>
          <strong>Hours:</strong> Monday–Saturday, 9:00 AM–8:00 PM IST
        </li>
      </ul>

      <p className="mt-8">Last Updated: {new Date().getFullYear()}</p>
    </div>
  );
}