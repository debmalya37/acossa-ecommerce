import { showToast } from "@/lib/showToast";
import axios, { AxiosResponse } from "axios";
import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";

// ==========================
// Types
// ==========================

// Request payload for this mutation
export type DeletePayload = {
  ids: string[];
  deleteType: "SD" | "PD" | "RSD";
};

// Expected API response shape
export interface DeleteResponse {
  success: boolean;
  message: string;
  deletedCount?: number;
}

// Hook definition with generics
export default function useDeleteMutation(
  queryKey: string,
  deleteEndPoint: string
): UseMutationResult<DeleteResponse, Error, DeletePayload> {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, DeletePayload>({
    mutationFn: async ({ ids, deleteType }): Promise<DeleteResponse> => {
      const response: AxiosResponse<DeleteResponse> = await axios({
        url: deleteEndPoint,
        method: deleteType === "PD" ? "DELETE" : "PUT",
        data: { ids, deleteType }
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data;
    },

    onSuccess: (data: DeleteResponse) => {
      showToast("success", data.message);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },

    onError: (error: Error) => {
      showToast("error", error.message);
    }
  });
}
