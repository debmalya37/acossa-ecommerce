'use client'
import { CldUploadWidget } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import { FilePlus } from "lucide-react"
import { showToast } from "@/lib/showToast"
import type {
  CloudinaryUploadWidgetError,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

import axios from "axios"
const UploadMedia = ({ isMultiple, queryClient }: { isMultiple: boolean; queryClient: any }) => {
    interface UploadError {
        statusText: string;
    }

    const handleOnError = (error: CloudinaryUploadWidgetError) => {
  if (!error) {
    showToast("error", "Unknown upload error");
    return;
  }

  // error is a string or object
  showToast("error", typeof error === "string" ? error : error.statusText ?? "Upload failed");
};

    // interface FileUploadInfo {
    //     asset_id: string;
    //     public_id: string;
    //     secure_url: string;
    //     path: string;
    //     thumbnail_url: string;
    // }

    // interface FileResult {
    //     uploadInfo?: FileUploadInfo;
    // }

    // interface Results {
    //     info: {
    //         files: FileResult[];
    //     };
    // }

    interface MediaUploadResponse {
        success: boolean;
        message: string;
    }

    const handleOnQueueEnd = async (results: CloudinaryUploadWidgetResults) => {
  // Ensure info exists & is not a string
  if (!results.info || typeof results.info === "string") return;

  // Cast info into a predictable type
  const info = results.info as unknown as {
    files?: Array<{
      uploadInfo?: {
        asset_id: string;
        public_id: string;
        secure_url: string;
      };
    }>;
  };

  const files = info.files ?? [];

  const uploadedFiles = files
    .filter((f) => f.uploadInfo)
    .map((file) => ({
      asset_id: file.uploadInfo!.asset_id,
      public_id: file.uploadInfo!.public_id,
      secure_url: file.uploadInfo!.secure_url,
      path: file.uploadInfo!.public_id,
      thumbnail_url: file.uploadInfo!.secure_url,
    }));

  if (uploadedFiles.length === 0) return;

  try {
    const { data } = await axios.post("/api/media/create", uploadedFiles);
    if (!data.success) throw new Error(data.message);

    queryClient.invalidateQueries(["media-data"]);
    showToast("success", data.message);
  } catch (error: any) {
    showToast("error", error.message);
  }
};


    return (
        <CldUploadWidget
            signatureEndpoint={"/api/cloudinary-signature"}
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPDATE_PRESET}
            onError={handleOnError}
            onQueuesEnd={handleOnQueueEnd}
            config={{
                cloud:{
                    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                }
            }}
            options={{
                multiple: isMultiple,
                sources: ['local', 'url', 'unsplash', 'google_drive']
            }}
        >


            {({ open }) => {
                return (
                    <Button onClick={()=>open()}>
                        <FilePlus />
                        Upload Media
                    </Button>
                )
            }}
        </CldUploadWidget>
    )
}

export default UploadMedia