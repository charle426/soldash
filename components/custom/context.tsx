"use client"
import { createContext, ReactNode, useContext, useState } from "react";

interface TokenInfo {
    address: string | null;
    name?: string | null;
    symbol?: string | null;
    priceChange?: number | null;
    holder?: number | null;
    supply?: number | null;
    created_time?: number | null;
    logoURI?: string | null
    price?: number | null;
    market_cap?: number | null;
    market_cap_rank?: number | null;
    url?: string;
    urlName?: string | null;
    volume_24h?: number | null;
  }
  
  interface TokenContextProps {
    tokenInfo: TokenInfo;
    setTokenInfo: React.Dispatch<React.SetStateAction<TokenInfo>>;
  }



export const TokenContext = createContext<TokenContextProps | null>(null);

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    address: "So11111111111111111111111111111111111111112",
    url: "https://pro-api.solscan.io/v2.0/token/list?sort_by=market_cap&page=1&page_size=20",
    urlName: "tokens",

  });

  return (
    <TokenContext.Provider value={{ tokenInfo, setTokenInfo }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokenContext = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useTokenContext must be used within a TokenProvider");
  }
  return context;
};