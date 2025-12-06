"use client";
import { Provider } from "react-redux";
import { ReactNode } from "react";
import { store } from "@/store/store";
import AuthHydrator from "@/components/AuthHydrator";

interface ReduxProviderProps {
  children: ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>
    <AuthHydrator />
    {children}</Provider>;
}
