"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import imgPlaceHolder from "@/public/assets/images/img-placeholder.webp";

interface SimilarProduct {
  _id: string;
  name: string;
  slug: string;
  mrp: number;
  sellingPrice: number;
  media?: { secure_url: string }[];
}

const SimilarProducts = ({
  category,
  productId,
}: {
  category: string;
  productId: string;
}) => {
  const [products, setProducts] = useState<SimilarProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSimilar() {
      try {
        const { data } = await axios.get(
          `/api/product/similar?category=${category}&exclude=${productId}`
        );

        if (data.success) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error("Similar products error", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSimilar();
  }, [category, productId]);

  if (loading || products.length === 0) return null;

  return (
    <div className="my-20">
      <h2 className="text-2xl font-semibold mb-8">
        You may also like
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/product/${product.slug}`}
            className="group"
          >
            <div className="border rounded-lg overflow-hidden bg-white hover:shadow-lg transition">
              <Image
  src={product.media?.[0]?.secure_url || imgPlaceHolder}
  alt={product.name}
  width={300}
  height={400}
  className="w-full h-[280px] object-cover object-top transition-transform duration-300 group-hover:scale-105"
  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
/>


              <div className="p-3">
                <h3 className="text-sm font-medium line-clamp-2 mb-1">
                  {product.name}
                </h3>
                <div className="flex gap-2 items-center">
                  <span className="font-semibold text-sm">
                    ${product.sellingPrice}
                  </span>
                  <span className="text-xs line-through text-gray-400">
                    ${product.mrp}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
