"use client";

import { SessionProvider } from "next-auth/react";
import LanguageProvider from "./LanguageProvider";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function AllProvider({ children }) {
  return (
<Provider store={store}>

       <SessionProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </SessionProvider>
</Provider>
  );
}