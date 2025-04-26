"use client"
import TrendingToken from "@/components/custom/trendingToken";
import SolanaPriceChart from "@/components/custom/solanaPriceChart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TokenContext, useTokenContext } from "@/components/custom/context";
export default function Page() {
    const [sortBy, setSortBy] = useState("market_cap")
    const [pageNum, setPageNum] = useState(1)
    const { tokenInfo, setTokenInfo } = useTokenContext()
    useEffect(() => {
        setTokenInfo(prev => ({ ...prev, url: `https://pro-api.solscan.io/v2.0/token/list?sort_by=${sortBy}&page=${pageNum}&page_size=20`, urlName: "tokens" }))
    }, [sortBy, pageNum])
    return (
        <section className="px-4 py-4">
            <div className="flex flex-col items-start justify-between">
                {tokenInfo.urlName == "tokens" ? (
                    <div className="w-full flex items-center mb-4 justify-end gap-2 font-medium">
                        <p>sort by:</p>
                        <div className="">
                            <Select onValueChange={(value: string) => setSortBy(value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Market Cap" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="market_cap">Market Cap</SelectItem>
                                    <SelectItem value="holder">Holder</SelectItem>
                                    <SelectItem value="create_time">Created Time</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ) : (<div></div>)
                }

                <div className="w-full">
                    <TrendingToken sortBy={sortBy} setSortBy={setSortBy} />
                    {
                        tokenInfo.urlName !== "trending" ? (
                            <p></p>
                        ) : (
                            <div className="text-sm">top trending tokens</div>
                        )

                    }

                </div>
                <div className="w-full flex items-center justify-center mt-4">
                    {tokenInfo.urlName == "tokens" ? <div className="text-sm flex items-center gap-2 mt-4">
                        <Button variant={"outline"} onClick={() => setPageNum(prev => prev -= 1)}>Prev</Button>
                        <p>Showing {(pageNum - 1) * 20 + 1} - {pageNum * 20} tokens</p>
                        <Button variant={"outline"} onClick={() => setPageNum(prev => prev += 1)} >Next</Button>
                    </div> : <div className="text-sm">top trending tokens</div>}
                </div>




            </div>
            <SolanaPriceChart />
        </section>
    )
}