import { UploadApiResponse } from "cloudinary";

export interface CloudinaryUploadResult extends UploadApiResponse {
  asset_id: string;
  public_id: string;
  secure_url: string;
}
