// components/AuthHydrator.tsx
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login, logout } from "@/store/reducer/authReducer";

export default function AuthHydrator() {
  const dispatch = useDispatch();

  useEffect(() => {
    const hydrate = async () => {
      try {
        const { data } = await axios.get("/api/auth/me");
        if (data.success) {
          dispatch(login(data.user));
        } else {
          dispatch(logout());
        }
      } catch {
        dispatch(logout());
      }
    };

    hydrate();
  }, [dispatch]);

  return null;
}
