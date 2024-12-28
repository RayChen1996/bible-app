"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { createContext, useContext, useState } from "react";
import { apiClient } from "@/lib/axios";
const AxiosContext = createContext(apiClient);
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AxiosContext.Provider value={apiClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AxiosContext.Provider>
  );
}

export const useAxios = () => useContext(AxiosContext);
