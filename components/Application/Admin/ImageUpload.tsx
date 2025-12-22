"use client";

import { useState } from "react";
import axios from "axios";

interface Props {
  value?: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await axios.post("/api/admin/upload", formData);
      onChange(res.data.url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3 bg-gray-300 dark:bg-gray-800 p-4 rounded-lg">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            uploadImage(e.target.files[0]);
          }
        }}
        className="block w-full text-sm bg-gray-200 cursor-pointer text-gray-900 border border-gray-300 rounded-lg" 
      />

      {uploading && (
        <p className="text-xs text-gray-500">Uploading image…</p>
      )}

      {value && (
        <img
          src={value}
          alt="Preview"
          className="w-full h-40 object-cover rounded-lg border dark:border-gray-700"
        />
      )}
    </div>
  );
}
