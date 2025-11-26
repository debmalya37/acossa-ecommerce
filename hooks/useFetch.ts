"use client";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useEffect, useMemo, useState } from "react";

// ==========================
// Types
// ==========================

// Allowed HTTP methods
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// Expected API response format
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  statusCode?: number;
  [key: string]: unknown;
}

export type UseFetchOptions = AxiosRequestConfig;

// Hook Return Type
export interface UseFetchResult<T> {
  data: ApiResponse<T> | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// ==========================
// Hook Definition
// ==========================

export default function useFetch<T>(
  url: string,
  method: HttpMethod = "GET",
  options: UseFetchOptions = {}
): UseFetchResult<T> {
  const [data, setData] = useState<ApiResponse<T> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState<number>(0);

  const optionString = JSON.stringify(options);

  const requestOptions = useMemo(() => {
    const opts = { ...options };

    if (["POST", "PUT", "PATCH"].includes(method) && !opts.data) {
      opts.data = {};
    }

    return opts;
  }, [method, optionString]);

  useEffect(() => {
    let isMounted = true;

    const apiCall = async () => {
      setLoading(true);
      setError(null);

      try {
        const response: AxiosResponse<ApiResponse<T>> = await axios({
          url,
          method,
          ...requestOptions
        });

        if (!response.data.success) {
          throw new Error(response.data.message || "Request failed");
        }

        if (isMounted) {
          // Ensure correct typing of data
          setData({
            success: response.data.success,
            message: response.data.message,
            statusCode: response.data.statusCode,
            data: response.data.data ?? null
          });
        }
      } catch (err) {
        if (isMounted) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Unknown error");
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    apiCall();

    return () => {
      isMounted = false;
    };
  }, [url, refreshIndex, requestOptions, method]);

  const refetch = () => setRefreshIndex((prev) => prev + 1);

  return { data, loading, error, refetch };
}
