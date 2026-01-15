"use client";

export default function ReturnPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-5 mt-52">
      <h1 className="text-3xl font-bold mb-6">Return & Replacement Policy</h1>

      <h2 className="text-xl font-semibold mt-6 mb-3">Return eligibility</h2>
      <ul className="list-disc ml-6 mb-4 space-y-4">
        <li>
          <strong>Return window:</strong> Request a return within 48 hours of
          delivery with unboxing photos/video; past this window, returns aren’t
          accepted.
        </li>
        <li>
          <strong>Condition:</strong> Items must be unused, unwashed, unaltered,
          with all tags/labels and original packaging intact. Perfume stains,
          makeup marks, or missing tags invalidate returns.
        </li>
        <li>
          <strong>Not eligible:</strong> Custom‑stitched, altered,
          made‑to‑measure or personalized items; sarees with fall/pico or
          stitched blouse; lehengas with stitched blouse; pre‑stitched
          sarees/lehengas; final‑sale and festive/offer items; accessories and
          cut fabrics.
        </li>
        <li>
          <strong>Eligibility basis:</strong> Returns are accepted for wrong
          item, manufacturing defect, or significant mismatch from the product
          page. Minor color variations due to lighting/screens are not defects.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">How to raise a return</h2>
      <ul className="list-disc ml-6 mb-4 space-y-4">
        <li>
          <strong>Contact:</strong> WhatsApp +91 9638000593 or email
          info@acossaenterprise.com within 48 hours, sharing Order ID, issue
          description, and photos/video of the unopened parcel, shipping label,
          and product.
        </li>
        <li>
          <strong>Approval:</strong> All returns require prior approval and a
          Return Authorization (RA) number. Parcels without RA may be refused.
        </li>
        <li>
          <strong>Shipping:</strong> If reverse pickup is unavailable at your
          pin code, self‑ship using a trackable courier and share the AWB.
          Return shipping costs are customer‑borne unless the return is due to
          our error (wrong/defective item).
        </li>
      </ul>

      <p className="mt-6 font-medium">
        Note-Customer will be responsible for paying for your own shipping costs
        for returning your item.
      </p>

      <p className="mt-8">Last Updated: {new Date().getFullYear()}</p>
    </div>
  );
}