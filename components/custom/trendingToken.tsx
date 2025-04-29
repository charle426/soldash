"use client";
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "../ui/skeleton"
import axiosInstance from "@/lib/axiosClient"
import { useTokenContext } from "./context"
import axios from "axios";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { formatPrice } from "./formatNumbers";
import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import formatUSD from "./formatUSD";


export default function TrendingToken(props : { setSortBy: React.Dispatch<React.SetStateAction<string>>, sortBy: string, pageNum: number}) {
    const [trendingToken, setTrendingToken] = useState<any>([])
    const { setTokenInfo, tokenInfo } = useTokenContext()
    const SOLSCAN_API_KEY = process.env.NEXT_PUBLIC_SOLSCAN_API_KEY || ""
    const skeletonArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    
    
    useEffect(() => {
    
      
        async function fetchedTokens() {
            // Fetch trending tokens or top tokens from Solscan API
            const requestOptions = {
                method: "get",
                url: tokenInfo.url,
                headers: {
                    token: SOLSCAN_API_KEY
                }
            }

            await axios.request(requestOptions)
                .then(response => getMetaData(response.data.data))
                .catch(err => {toast(err.message)});


            // Fetch metadata for each token because the API does not return metadata for all tokens
            async function getMetaData(data: any) {
                const metaData = await Promise.all(
                    data.map(async (token: any) => {
                        if (!token.address) {
                            console.warn("Token missing address:", token);
                            return {
                                ...token,
                                logoURI: null,
                                price: null,
                                price_change_24h: null,
                                holder: null,
                                supply: null,
                                created_time: null,
                                market_cap_rank: null,
                                market_cap: null,
                                symbol: null

                            };
                        }
                        try {
                            const metaRes = await axiosInstance.get(
                                `https://pro-api.solscan.io/v2.0/token/meta?address=${token.address}`,
                                {
                                    headers: {
                                        token: SOLSCAN_API_KEY,
                                    },
                                }
                            )
                            const setSelectedTokens = {
                                ...token,
                                logoURI: metaRes.data.data.icon || null,
                                price: metaRes.data.data.price || null,
                                price_change_24h: metaRes.data.data.price_change_24h || null,
                                holder: metaRes.data.data.holder || null,
                                supply: metaRes.data.data.supply || null,
                                created_time: metaRes.data.data.created_time || null,
                                market_cap_rank: metaRes.data.data.market_cap_rank || null,
                                market_cap: metaRes.data.data.market_cap || null,
                                symbol: metaRes.data.data.symbol || null,
                                volume_24h: metaRes.data.data.volume_24h || null
                            }

                            
                            return setSelectedTokens                        
                        } catch (err) {
                            console.error("Metadata fetch failed for token", token.address, err);
                            // Handle the error gracefully, e.g., set default values or skip the token

                            return {
                                ...token,
                                logoURI: null,
                                price: null,
                                price_change_24h: null,
                                holder: null,
                                supply: null,
                                created_time: null,
                                symbol: null,
                                market_cap_rank: null,
                                market_cap: null,
                                volume_24h: null
                            }
                        }

                        
                    }
                    
                ))

                // Get 

                
                const allTokens = [...metaData]

                // return tokens with metadata

                setTrendingToken(allTokens)

            }
        }

        fetchedTokens()


    }, [tokenInfo.urlName, tokenInfo.url, props.sortBy, props.pageNum]) // refresh data when sortBy or pageNum changes

    // Frontend
    return (
        <div className="w-full">
            <div className="gap-2 flex justify-end">
                <Button variant={tokenInfo.urlName == "tokens" ? "default" : "outline"} className="mb-2" onClick={() => setTokenInfo(prev => ({...prev, urlName: "tokens", url: `https://pro-api.solscan.io/v2.0/token/list?sort_by=${props.sortBy}&page=1&page_size=20` }))}>
                    <span className="text-sm">Tokens</span>
                </Button>
                <Button variant={tokenInfo.urlName == "trending" ? "default" : "outline"} onClick={() => setTokenInfo(prev => ({...prev, name: "trending", url: "https://pro-api.solscan.io/v2.0/token/trending?limit=20" }))}>
                    <span className="text-sm">Trending Tokens</span>
                </Button>
            </div>
            <Table className="relative font-medium *:text-[0.8em]">
                <TableHeader className="">
                    <TableRow className="">
                        <TableHead>Token</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Holders</TableHead>
                        <TableHead className="">Price</TableHead>
                        <TableHead className="text-right ">Market Cap</TableHead>
                    </TableRow>
                </TableHeader>

                {
                    trendingToken.length === 0 ? (
                        skeletonArray.map((skeleton) => {
                            return (
                                <TableBody key={skeleton} className="m-2">
                                    <TableRow className="mb-5">
                                        <TableCell className="font-medium">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                        </TableCell>
                                        <TableCell className="font-bold underline"><Skeleton className="h-4 w-[70px] rounded-xl" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-[50px] rounded-xl" /></TableCell>
                                        <TableCell className=" fle justify-end items-center"><Skeleton className="h-4 w-[120px] rounded-xl" /></TableCell>
                                        <TableCell className="t fex justify-end items-center"><Skeleton className="h-4 w-[100px] rounded-xl" /></TableCell>
                                    </TableRow>

                                </TableBody>

                            )
                        })
                    ) : (


                        trendingToken.map((tokens: any, index: number) => {

                            return (

                                <TableBody className={tokenInfo.address === tokens.address ? "rounded-2xl m-2 cursor-pointer divide-y odd:bg-blue-200 even:bg-blue-200" : "m-2 divide-y odd:bg-slate-100 even:bg-white"}
                                    onClick={() => {
                                        setTokenInfo({
                                            address: tokens.address || "",
                                            name: tokens.name || "",
                                            holder: tokens.holder || 0,
                                            supply: tokens.supply || 0,
                                            created_time: tokens.created_time || 0,
                                            priceChange: tokens.price_change_24h || 0,
                                            market_cap: tokens.market_cap || 0,
                                            logoURI: tokens.logoURI || "",
                                            market_cap_rank: tokens.market_cap_rank || 0,
                                            symbol: tokens.symbol || "",
                                            volume_24h: tokens.volume_24h || 0,
                                            price: tokens.price || 0,
                                        });

                                    }}
                                    onLoad={() => {
                                    if (index === 0 ){
                                        setTokenInfo({
                                            address: tokens.address || "",
                                            name: tokens.name || "",
                                            holder: tokens.holder || 0,
                                            supply: tokens.supply || 0,
                                            created_time: tokens.created_time || 0,
                                            priceChange: tokens.price_change_24h || 0,
                                            market_cap: tokens.market_cap || 0,
                                            logoURI: tokens.logoURI || "",
                                            market_cap_rank: tokens.market_cap_rank || 0,
                                            symbol: tokens.symbol || "",
                                            volume_24h: tokens.volume_24h || 0,
                                        });
                                    }
                                    }}
                                    data-tooltip-id={tokens.address}
                                    data-tooltip-content={tokens.name}
                                    key={tokens.address}
                                >
                                    <TableRow>
                                        <TableCell className="font-medium flex gap-2 justify-start items-center">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={tokens.logoURI} alt="Token Logo" />
                                                <AvatarFallback>{tokens.symbol.slice(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="underline cursor-pointer">{tokens.name}</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="w-fit p-1 rounded-lg">
                                                        <span className="flex flex-col gap-1 justify-center items-center"><span>{tokens.symbol}</span> <span>{tokens.address}</span></span>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                        </TableCell>
                                        <TableCell className="">{tokens.symbol}</TableCell>
                                        <TableCell className="">
                                            {tokenInfo.address === tokens.address ?  <Link href={`/tokens/${tokens.address}`} className="text-blue-500 underline
                                            
                                            ">{tokens.holder}</Link> : <span>{tokens.holder}</span>}
                                        </TableCell>
                                        <TableCell className="flex justify-start items-center align-middle  gap-1 md:gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <span className="underline">
                                                            {tokens.price == null ? "---" : `$${formatPrice(tokens.price)}`}
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                    <span>
                                                
                                                {tokens.price == null ? "---" : `${tokens.price}$`}
                                            </span>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <span className={tokens.price_change_24h > 0 ? "text-green-500 text-right flex gap-[2px] items-center justify-center" : tokens.price_change_24h < 0 ? "text-red-500 text-right flex gap-1 items-center justify-center" : "text-gray-400 text-right"}>
                                                {tokens.price_change_24h > 0 ? <ArrowUp size={15} className="text-green-500 text-right text-[0.5rem]"/> : tokens.price_change_24h < 0 ? <ArrowDown size={15} className="text-red-500 text-right text-[0.5em]"/> : "--"}
                                                {tokens.price_change_24h !== null ? formatPrice(tokens.price_change_24h) : "0"}%
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">{tokens.market_cap !== null ? formatUSD(tokens.market_cap) : "N/A"}</TableCell>
                                    </TableRow>
                                </TableBody>

                            )
                        })

                    )}

            </Table>
        </div>
    )
} 