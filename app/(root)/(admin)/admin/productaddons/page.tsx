"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ProductAddonsPage() {
  const [addons, setAddons] = useState<any[]>([]);

  const load = async () => {
    const res = await axios.get("/api/admin/productaddons");
    setAddons(res.data.addons);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this addon?")) return;
    await axios.delete(`/api/admin/productaddons/${id}`);
    load();
  };

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Product Addons</h1>

        <Link
          href="/admin/productaddons/create"
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Create Addon
        </Link>
      </div>

      <div className="overflow-x-auto border rounded-xl bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th>Label</th>
              <th>Key</th>
              <th>Type</th>
              <th>Base Price($)</th>
              <th>Required</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {addons.map(addon => (
              <tr key={addon._id} className="border-t">
                <td className="p-3">{addon.product?.name}</td>
                <td className="text-center">{addon.label}</td>
                <td className="text-center">{addon.key}</td>
                <td className="p-1 text-center">{addon.type}</td>
                <td className="p-1 text-center">{addon.basePrice}</td>
                <td className="text-center">{addon.required ? "Yes" : "No"}</td>
                <td>
                  <button
                    onClick={() => remove(addon._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!addons.length && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No addons found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
