"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import axios from "axios"
import { format } from "date-fns/format"
import { subDays } from "date-fns"
import { DateRange } from "react-day-picker"
import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useTokenContext } from "./context"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Link from "next/link"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig


export default function SolanaPriceCharts() {
  const { tokenInfo } = useTokenContext()
  const [chartData, setChartData] = useState([])
  const SOLSCAN_API_KEY = process.env.NEXT_PUBLIC_SOLSCAN_API_KEY || ""
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 10),
    to: new Date(),
  })

  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://pro-api.solscan.io/v2.0/token/price?address=${tokenInfo.address}&from_time=${format(date.from, "yyyyMMdd")}&to_time=${format(date.to, "yyyyMMdd")}`,
      headers: {
        token: SOLSCAN_API_KEY,
      }
    };

    axios
      .request(options)
      .then((res) => {
        const data = res.data.data
        setChartData(data)
      })
      .catch((err) => {
        console.error("Error fetching chain info:", err)
      })
  }, [date, tokenInfo.address, SOLSCAN_API_KEY])
  return (
    <section className="w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="mb-4"><Link className="flex gap-2" href={`/tokens?address=${tokenInfo.address}`}>${tokenInfo.symbol} Chart</Link></CardTitle>
          <CardDescription>
            <div className="grid gap-2 max-w-[150px] w-[150px]">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-fit justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >

<defs>
    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} /> 
      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
    </linearGradient>
  </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  try {
                    const stringVal = value.toString()
                    if (stringVal.length === 8) {
                      const formattedDate = new Date(
                        `${stringVal.slice(0, 4)}-${stringVal.slice(4, 6)}-${stringVal.slice(6, 8)}`
                      )
                      return format(formattedDate, "MMM d")
                    } else {
                      return "Invalid"
                    }
                  } catch {
                    return "Invalid"
                  }
                }
                }

              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="price"
                type="linear"
                fill="url(#priceGradient)"
                fillOpacity={0.3}
                stroke="var(--color-chart-2)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex w-full sm:flex-row flex-col gap-2 justify-between items-start">
          <div className="flex flex-col w-full mt-3 items-start gap-2 md:ml-3 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                {
                  tokenInfo.priceChange && (
                    tokenInfo.priceChange > 0
                      ?
                      <div className="text-green-500 text-sm flex gap-2">Trending up by {tokenInfo.priceChange}% <TrendingUp className="h-4 w-4" /></div>
                      : tokenInfo.priceChange < 0
                        ? <div className="text-red-500 text-sm flex gap-2">Trending down by {tokenInfo.priceChange}% <TrendingDown className="h-4 w-4" /></div>
                        : <div className="text-gray-500 text-sm">Price Change N/A</div>
                  )}

              </div>
            </div>
          <div className="text-gray-500 font-medium text-sm flex gap-2">
            <Link className="flex gap-2" href={`/tokens?address=${tokenInfo.address}`}>
            <div>Holders:</div>
            {tokenInfo.holder ? (<div>{tokenInfo.holder}</div>) : (<div></div>)}
            </Link>          
          </div>
          <div className="text-gray-500 font-medium text-sm flex gap-2">
            <div>Total Supply:</div>
            {tokenInfo.supply ? (<div>{tokenInfo.supply}</div>) : (<div></div>)}
          </div>
          <div className="gap-2">
            <div className="flex items-center text-sm gap-2 font-medium leading-none">
              {tokenInfo.created_time ? (
                <div className="text-gray-500 text-sm">
                  Created at: {format(new Date(tokenInfo.created_time * 1000), "dd/MM/yyyy")}
                </div>
              ) : (
                <div className="text-gray-400">Creation date unknown</div>
              )}  </div>
          </div>
          </div>
          <div className="flex flex-col w-full gap-2 md:justify-end md:items-end text-sm">
          <div className="text-gray-500 font-medium text-sm flex gap-2">
            <div>Current Price</div>
            {tokenInfo.price ? (<div>{tokenInfo.price}</div>) : (<div>--</div>)}
          </div>
          <div className="text-gray-500 font-medium text-sm flex gap-2">
            <div>Market Cap Rank:</div>
            {tokenInfo.market_cap_rank ? (<div>{tokenInfo.market_cap_rank}</div>) : (<div>--</div>)}
          </div>
          <div className="text-gray-500 font-medium text-sm flex gap-2">
            <div>24h Volume:</div>
            {tokenInfo.volume_24h ? (<div>{tokenInfo.volume_24h}</div>) : (<div>--</div>)}
          </div>
          </div>
          
        </CardFooter>
      </Card>
    </section>
  )
}