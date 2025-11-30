"use client";

export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-5 text-gray-800 leading-relaxed mt-52">
      <h1 className="text-3xl font-bold mb-8">Shipping Policy</h1>

      {/* DELIVERY TIME */}
      <h2 className="text-xl font-semibold mb-3">
        How long will it take for my order to reach me?
      </h2>
      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>
          <strong>Order processing time:</strong> 2–4 business days (Monday–
          Saturday; excludes Sundays and public holidays).
        </li>
        <li>
          <strong>India deliveries:</strong> 2–7 business days after dispatch,
          depending on pin code and courier serviceability.
        </li>
        <li>
          <strong>International deliveries:</strong> Economy 13–20 business
          days; Express 8–11 business days (business days exclude weekends and
          holidays in both origin and destination). Live estimates are shown at
          checkout.
        </li>
      </ul>

      {/* DELIVERY METHODS */}
      <h2 className="text-xl font-semibold mb-3">
        What delivery methods do you use?
      </h2>
      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>
          We ship via leading carriers such as DHL, FedEx, UPS, Aramex, and
          trusted domestic partners depending on serviceability and speed.
        </li>
        <li>
          All orders receive tracking details by Email, SMS, or WhatsApp once
          dispatched.
        </li>
      </ul>

      {/* DUTIES */}
      <h2 className="text-xl font-semibold mb-3">
        How do international duties and taxes work?
      </h2>
      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>
          Customs duties, import taxes, VAT/GST, or handling fees (if applicable)
          are charged by the destination country and payable by the recipient.
        </li>
        <li>
          These charges vary by country and order value. Acossa does not control
          or pre-collect them unless explicitly stated at checkout.
        </li>
      </ul>

      {/* LOST / DELAYED */}
      <h2 className="text-xl font-semibold mb-3">
        What should I do if my package is delayed, lost, or marked delivered but
        not received?
      </h2>
      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>
          Please contact our support team within <strong>72 hours</strong> of the
          last tracking update with your Order ID and tracking number.
        </li>
        <li>
          We will initiate a carrier investigation and keep you informed.
          Resolution may include re-delivery, replacement, or refund depending
          on the carrier’s findings and our policy.
        </li>
      </ul>

      {/* TAMPERED */}
      <h2 className="text-xl font-semibold mb-3">
        What if my package appears opened or tampered?
      </h2>
      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>
          Do not accept the shipment. Ask the courier to mark it as “received
          open/tampered” and refuse delivery.
        </li>
        <li>
          Notify our customer care within <strong>24 hours</strong> with photos
          of the outer carton, shipping label, and visible damage. Claims raised
          after 24 hours may not be eligible.
        </li>
      </ul>

      {/* PO BOX */}
      <h2 className="text-xl font-semibold mb-3">
        Do you ship to PO Boxes or military addresses?
      </h2>
      <p className="mb-6">
        Most international couriers do not deliver to PO boxes or APO/FPO
        addresses. Please provide a complete street address and a reachable
        phone number to avoid delays or cancellations.
      </p>

      {/* ADDRESS CHANGE */}
      <h2 className="text-xl font-semibold mb-3">
        Can I change my address or phone number after placing an order?
      </h2>
      <p className="mb-6">
        Address or contact updates are possible only before dispatch. Once the
        Airway Bill (AWB) is generated, changes may not be feasible. Please
        contact support immediately with your Order ID.
      </p>

      {/* SHIPPING FEES */}
      <h2 className="text-xl font-semibold mb-3">
        Shipping fees and free shipping thresholds
      </h2>
      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>
          Shipping charges and any free shipping thresholds are calculated at
          checkout based on destination, weight, and service level.
        </li>
        <li>
          Re-delivery or address correction fees charged by the courier may be
          payable by the customer if the original address was incorrect or
          incomplete.
        </li>
      </ul>

      {/* PEAK SEASON */}
      <h2 className="text-xl font-semibold mb-3">
        Peak season and festive dispatches
      </h2>
      <p className="mb-6">
        During festive launches and high-volume sale periods, processing and
        transit times may be extended. The delivery window shown at checkout
        reflects real-time conditions.
      </p>

      {/* PACKAGING */}
      <h2 className="text-xl font-semibold mb-3">
        Packaging and tracking
      </h2>
      <p className="mb-6">
        All orders are dispatched in tamper-evident packaging. Tracking links
        are shared once the order is shipped and remain accessible from your
        Order page.
      </p>

      {/* CONTACT */}
      <h2 className="text-xl font-semibold mb-3">Contact</h2>
      <p className="mb-2">Email: info@acossaenterprise.com</p>
      <p className="mb-2">WhatsApp / Phone: +91&nbsp;9638000593</p>
      <p className="mb-6">
        Support hours: Monday–Saturday, 9:00 AM – 8:00 PM IST
      </p>

      {/* TIP */}
      <div className="bg-gray-100 border-l-4 border-black p-4 rounded">
        <p className="text-sm">
          <strong>Tip:</strong> For time-sensitive gifting or event wear, choose
          <strong> Express Shipping</strong> at checkout and share your wear
          date in the order note so our team can prioritize where possible.
        </p>
      </div>

      <p className="mt-10 text-sm text-gray-500">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
