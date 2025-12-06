import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import logo from "@/public/assets/images/logo/acossa.jpg";
import stamp from "@/public/assets/images/logo/company-stamp.png";

// ---------- Styles ----------
const styles = StyleSheet.create({
  page: { padding: 35, fontSize: 11, fontFamily: "Helvetica" },

  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  bold: { fontWeight: "bold" },

  sectionTitle: { fontSize: 14, marginBottom: 8, fontWeight: "bold", borderBottom: "1px solid #000" },

  tableHeader: { backgroundColor: "#EEE", padding: 5, fontWeight: "bold" },
  tableRow: { paddingVertical: 5, borderBottom: "1px solid #DDD", flexDirection: "row" },

  leftCol: { width: "60%" },
  rightCol: { width: "40%" },

  logo: { width: 80, height: 50, marginBottom: 6 },
  stamp: { width: 120, height: 70, marginTop: 10 },

  footerNote: { marginTop: 30, textAlign: "center", fontSize: 10, opacity: 0.7 },
});

// ---------- Component ----------
export default function OrderInvoicePDF({ order }: { order: any }) {
  const company = {
    legalName: "FEATHER INTERNATIONAL PVT. LTD.",
    tradeName: "ACOSSA ENTERPRISE",
    gst: "GSTIN: 24AAFCF3314E1Z7",
    cin: "CIN: U17299GJ2022PTC137811",
    tan: "TAN: SRTF01211A",
    iec: "IEC: AAFCF3314E",
    address:
      "B-2,303, ANAND VATIKA SATELITE ROAD,\nMOTAVARACHHA, SURAT, GUJARAT, INDIA - 394101",
    contact: "+91 9638000593",
    modeOfTransport: "BY AIR",
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ---------------- Company Header ---------------- */}
        <View style={{ marginBottom: 20 }}>
          <Image src={logo.src} style={styles.logo} />
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{company.tradeName}</Text>
          <Text style={{ marginTop: 3 }}>{company.legalName}</Text>
          <Text>{company.address}</Text>
          <Text>{company.contact}</Text>

          <Text style={{ marginTop: 6 }}>
            {company.gst} | {company.cin} | {company.tan} | {company.iec}
          </Text>
        </View>

        {/* ---------------- Invoice Meta ---------------- */}
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.sectionTitle}>INVOICE</Text>
          <Text>Order ID: {order.order_id}</Text>
          <Text>Payment ID: {order.payment_id}</Text>
          <Text>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
        </View>

        {/* ---------------- Billing Info ---------------- */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Billing Details</Text>
          <Text style={styles.bold}>{order.name}</Text>
          <Text>{order.email}</Text>
          <Text>{order.phone}</Text>
          <Text>
            {order.landmark}, {order.city}, {order.state}, {order.country} - {order.pinCode}
          </Text>
        </View>

        {/* ---------------- Shipping Info ---------------- */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Shipping & Compliance</Text>
          <Text>Mode of Transport: {company.modeOfTransport}</Text>
          <Text>Incoterms: CIF</Text>
          <Text style={{ marginTop: 5, fontSize: 10 }}>
            Customs, import duties, VAT/GST, and handling fees (if any) are charged by the destination
            country and must be paid by the recipient.
          </Text>
        </View>

        {/* ---------------- Product Table ---------------- */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Order Items</Text>

          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={{ width: "40%" }}>Product</Text>
            <Text style={{ width: "20%" }}>Price</Text>
            <Text style={{ width: "20%" }}>Qty</Text>
            <Text style={{ width: "20%" }}>Total</Text>
          </View>

          {/* Table Rows */}
          {order.products.map((item: any) => (
            <View key={item._id} style={styles.tableRow}>
              <Text style={{ width: "40%" }}>
                {item.name}
                {"\n"}Color: {item.variantId.color}
                {"\n"}Size: {item.variantId.size}
                {item.addons?.length > 0 &&
                  item.addons.map((ad: any) => (
                    <Text key={ad._id}>
                      {"\n"}• {ad.label}
                      {ad.option?.label ? ` (${ad.option.label})` : ""} → {ad.totalPrice}
                    </Text>
                  ))}
              </Text>

              <Text style={{ width: "20%" }}>{item.sellingPrice}</Text>
              <Text style={{ width: "20%" }}>{item.qty}</Text>
              <Text style={{ width: "20%" }}>${item.finalPrice}</Text>
            </View>
          ))}

          {/* Summary */}
          <View style={{ marginTop: 10 }}>
            <Text>Subtotal: ${order.subtotal}</Text>
            <Text>Discount: ${order.discount}</Text>
            <Text>Coupon Discount: ${order.couponDiscountAmount}</Text>
            <Text style={{ fontWeight: "bold", marginTop: 5 }}>
              TOTAL AMOUNT: ${order.totalAmount}
            </Text>
          </View>
        </View>

        {/* ---------------- Signature & Stamp ---------------- */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.bold}>For, FEATHER INTERNATIONAL PVT. LTD.</Text>

          <Image src={stamp.src} style={styles.stamp} />

          <Text style={{ marginTop: 3 }}>Authorized Signatory</Text>
          <Text>Director</Text>
        </View>

        {/* ---------------- Footer ---------------- */}
        <Text style={styles.footerNote}>
          Thank you for shopping with ACOSSA ENTERPRISE.
        </Text>
      </Page>
    </Document>
  );
}
