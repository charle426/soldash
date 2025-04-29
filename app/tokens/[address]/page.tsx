"use client"

import { useTokenContext } from "@/components/custom/context"
import axios from "axios"
import { use, useEffect, useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import axiosInstance from "@/lib/axiosClient"
import { LucideClipboardCopy, LucideCopy } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { format } from "date-fns/format"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TooltipContent } from "@radix-ui/react-tooltip";
import formatUSD from "@/components/custom/formatUSD";

type TokenHolder = {
  account: string | null,
  lamports: number | null,
  type: string | null,
  executable: boolean | null,
  owner_program: string | null,
  rent_epoch: number | null,
  is_oncurve: boolean | null,
  address: string | null,
  amount: number | null,
  decimals: number | null,
  owner: string | "",
  rank: number | null,
  account_address: string | null,
  account_label: string | null,
  account_icon: string | null,
  account_tags: any,
}

type TokenTransfer = {
  block_id: number,
  trans_id: string,
  block_time: number,
  time: number,
  activity_type: string,
  from_address: string,
  to_address: string,
  token_address: string,
  token_decimals: number,
  amount: number,
  from_account: {
    account_address: string,
    account_label: string | null,
    account_icon: string | null,
    account_tags: any,
  },
  to_account: {
    account_address: string,
    account_label: string | null,
    account_icon: string | null,
    account_tags: any,
  }

}



export default function Page({ params }: { params: Promise<{ address: string }> }) {
  const SOLSCAN_API_KEY = process.env.NEXT_PUBLIC_SOLSCAN_API_KEY || ""
  const { address } = use(params)
  const { tokenInfo } = useTokenContext()
  const [holderData, setHolderData] = useState<TokenHolder[]>([])
  const [transferData, setTransferData] = useState<TokenTransfer[]>([])
  const [transferHolder, setTransferHolder] = useState<"holder" | "transfer">("transfer")
  const [supplyPrice, setSupplyPrice] = useState<{ supply: number, price: number, symbol: string, icon:  string}>()
  const skeletonArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  console.log(transferData)

  useEffect(() => {
    const transferoptions = {
      method: "GET",
      url: `https://pro-api.solscan.io/v2.0/token/transfer?address=${address}&page=1&page_size=20&sort_by=block_time&sort_order=desc`,
      headers: {
        token: SOLSCAN_API_KEY,
      }
    };

    axios
      .request(transferoptions)
      .then((res) => {
        const data = res.data.data
        getTransferDetails(data)
      })
      .catch((err) => {
        console.error("Error fetching chain info:", err)
      })

    const metaoptions = {
      method: "GET",
      url: `https://pro-api.solscan.io/v2.0/token/meta?address=${address}`,
      headers: {
        token: SOLSCAN_API_KEY,
      }
    };

    axios
      .request(metaoptions)
      .then((res) => {
        const data = res.data.data
        setSupplyPrice({ supply: data.supply, price: data.price, symbol: data.symbol, icon: data.icon, })
      })
      .catch((err) => {
        console.error("Error fetching chain info:", err)
      })

    const holderoptions = {
      method: "GET",
      url: `https://pro-api.solscan.io/v2.0/token/holders?address=${address}&page=1&page_size=20`,
      headers: {
        token: SOLSCAN_API_KEY,
      }
    };

    axios
      .request(holderoptions)
      .then((res) => {
        const data = res.data.data.items
        accountDetails(data)
      })
      .catch((err) => {
        console.error("Error fetching chain info:", err)
      })

    async function accountDetails(data: any) {
      // Check account details for each token
      const metaData = await Promise.all(
        data.map(async (token: any) => {
          if (!token.address) {
            console.warn("Token missing address:", token);
            return {
              ...token,
              account: null,
              lamports: null,
              type: null,
              executable: null,
              owner_program: null,
              rent_epoch: null,
              is_oncurve: null

            };
          }
          try {
            const metaRes = await axiosInstance.get(
              `https://pro-api.solscan.io/v2.0/account/detail?address=${address}`,
              {
                headers: {
                  token: SOLSCAN_API_KEY,
                },
              }
            )
            // return the account details for each holder
            return {
              ...token,
              lamports: metaRes.data.data.lamports || null,
              account: metaRes.data.data.account || null,
              type: metaRes.data.data.type || null,
              executable: metaRes.data.data.executable || null,
              owner_program: metaRes.data.data.owner_program || null,
              rent_epoch: metaRes.data.data.rent_epoch || null,
              is_oncurve: metaRes.data.data.is_oncurve || null,
            }
          } catch (err) {
            console.error("Metadata fetch failed for token", token.address, err);
            // Handle the error gracefully, e.g., set default values or skip the token

            return {
              ...token,
              account: null,
              lamports: null,
              type: null,
              executable: null,
              owner_program: null,
              rent_epoch: null,
              is_oncurve: null
            }
          }


        }

        ))

      // Get 



      const allTokens = [...metaData]

      getAccountDetails(allTokens)

    }

    async function getAccountDetails(data: any) {
      const accountData = await Promise.all(
        data.map(async (token: any) => {
          if (!token.address) {
            console.warn("Token missing address:", token);
            return {
              ...token,
              account_address: null,
              account_label: null,
              account_icon: null,
              account_tags: null,
              type: null,

            };
          }
          try {
            const res = await axiosInstance.get(
              `https://pro-api.solscan.io/v2.0/account/metadata?address=${token.owner}`,
              {
                headers: {
                  token: SOLSCAN_API_KEY,
                },
              }
            )
            console.log(res.data.data)
            // return the account details for each holder
            return {
              ...token,
              account_address: res.data.data.account_address || null,
              account_label: res.data.data.account_label || null,
              account_icon: res.data.data.account_icon || null,
              account_tags: res.data.data.account_tags || null,
              account_type: res.data.data.account_type || null,
            }
          } catch (err) {
            console.error("Metadata fetch failed for token", token.owner, err);
            // Handle the error gracefully, e.g., set default values or skip the token

            return {
              ...token,
              account_address: null,
              account_label: null,
              account_icon: null,
              account_tags: null,
              type: null,
            }
          }


        }

        ))

      // Get info
      const allTokens = [...accountData]
      setHolderData(allTokens)
    }

    async function getTransferDetails(data: any) {
      const accountData = await Promise.all(
        data.map(async (token: any) => {
          if (!token.from_address || !token.to_address) {
            console.warn("Token missing from_address or to_addresss:", token);
            return {
              ...token,
              from_account: {
                account_address: null,
                account_label: null,
                account_icon: null,
                account_tags: null,

              },
              to_account: {
                account_address: null,
                account_label: null,
                account_icon: null,
                account_tags: null,

              },
            };
          }
          try {
            const [fromRes, toRes] = await Promise.all([
              axiosInstance.get(`https://pro-api.solscan.io/v2.0/account/metadata?address=${token.from_address}`, {
                headers: { token: SOLSCAN_API_KEY },
              }),
              axiosInstance.get(`https://pro-api.solscan.io/v2.0/account/metadata?address=${token.to_address}`, {
                headers: { token: SOLSCAN_API_KEY },
              }),
            ]);
            // return the account details for each holder
            return {
              ...token,
              from_account: {
                account_address: fromRes.data.data.account_address || null,
                account_label: fromRes.data.data.account_label || null,
                account_icon: fromRes.data.data.account_icon || null,
                account_tags: fromRes.data.data.account_tags || null,
                account_type: fromRes.data.data.account_type || null,
              },
              to_account: {
                account_address: toRes.data.data.account_address || null,
                account_label: toRes.data.data.account_label || null,
                account_icon: toRes.data.data.account_icon || null,
                account_tags: toRes.data.data.account_tags || null,
                account_type: toRes.data.data.account_type || null,
              },
            };
          } catch (err) {
            console.error("Metadata fetch failed for token", token.from_address, err);
            // Handle the error gracefully, e.g., set default values or skip the token

            return {
              ...token,
              from_account: {
                account_address: null,
                account_label: null,
                account_icon: null,
                account_tags: null,
                account_type: null,
              },
              to_account: {
                account_address: null,
                account_label: null,
                account_icon: null,
                account_tags: null,
                account_type: null,
              },
            };
          }
        }

        ))

      // Get Acount details for transfer
      const allTokens = [...accountData]
      setTransferData(allTokens)
    }

  }, [address, tokenInfo.address])
  return (
    <div className="mb-10 p-3">
      <div className="flex items-end justify-end mb-5">
        <div className="flex gap-1">
          <Button variant={transferHolder == "holder" ? "default" : "outline"} onClick={() => setTransferHolder("holder")}>Holder</Button>
          <Button variant={transferHolder == "transfer" ? "default" : "outline"} onClick={() => setTransferHolder("transfer")}>Transfers</Button>
        </div>
      </div>
      {transferHolder === "holder" ? (
        <Table className="p-5">
          <TableHeader className="">
            <TableCaption className="font-medium flex">
              Top 20 whales on {supplyPrice?.symbol}
            </TableCaption>
            <TableRow className="">
              <TableHead className="w-[100px]">Rank</TableHead>
              <TableHead>Account Owner</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          {
            holderData.length > 0 ?
              holderData.map((data: TokenHolder, index: number) =>
              (
                <TableBody className="font-medium p-5 text-sm divide-y" key={index}>
                  <TableRow>
                    <TableCell className="py-3">{data.rank}</TableCell>
                    <TableCell className="flex relative">
                      {data.account_icon ? (
                        <Avatar>
                          <AvatarImage src={data.account_icon} />
                          <AvatarFallback>{data.account_label?.slice(0, 2)}</AvatarFallback>
                        </Avatar>) : (<span></span>)}
                      {data.account_label ? (<span>{data.account_label}</span>) : (<span>{data.owner?.slice(0, 5) + "..." + data.owner?.slice(data.owner.length - 5, data.owner.length)}</span>)}

                      11 <div className="flex justify-end items-end">{data.type ? (<span className="text-[0.5rem] h-3 px-0.5 w-fit rounded-xl bg-slate-200">{data.type}</span>) : (<span></span>)}</div>
                    </TableCell>
                    <TableCell className="">{data.amount}</TableCell>
                    <TableCell className=""> {data.amount && supplyPrice?.supply
                      ? ((Number(data.amount) / Number(supplyPrice?.supply)) * 100).toFixed(2) + '%'
                      : 'N/A'}</TableCell>
                    <TableCell className=""> {data.amount && supplyPrice?.price
                      ? ((Number(data.amount) * Number(supplyPrice?.price))) + '$'
                      : 'N/A'}</TableCell>
                  </TableRow>

                </TableBody>
              ))
              : (
                skeletonArray.map((data) => {
                  return (<TableBody>
                    <TableRow>
                      <TableCell className=""><Skeleton className="w-30 h-4" /></TableCell>
                      <TableCell className=""><Skeleton className="w-15 h-4" /></TableCell>
                      <TableCell className=""><Skeleton className="w-20 h-4" /></TableCell>
                      <TableCell className=""><Skeleton className="w-10 h-4" /></TableCell>
                      <TableCell className=""><Skeleton className="w-20 h-4" /></TableCell>
                    </TableRow>

                  </TableBody>)
                })

              )}
          <TableFooter>

          </TableFooter>
        </Table>
      ) : (
        <Table>
          <TableCaption className="font-medium flex">
            Top 20 whales on {supplyPrice?.symbol}
          </TableCaption>
          <TableHeader className="">
            <TableRow className="">
              <TableHead className="">Signature</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Token</TableHead>
            </TableRow>
          </TableHeader>

          {
            transferData?.length > 0 ? (
              transferData.map((data, index) => {
                return (
                  <TableBody key={index}>
                    <TableRow>

                      <TableCell className="py-3">
                        <span className="">
                          {data.trans_id.slice(0, 5) + "..." + data.trans_id?.slice(data.trans_id.length - 5, data.trans_id.length)}
                          <LucideCopy size={10} className="text-blue-600" fontSize={2} onClick={() => { navigator.clipboard.writeText(data.trans_id), toast("Signature Address Copied ✅") }} />
                        </span>
                      </TableCell>

                      <TableCell className="">{formatDistanceToNow(new Date(data.time), { addSuffix: true })}</TableCell>

                      <TableCell className="">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button variant={"outline"}>Transfer</Button>
                            </TooltipTrigger>
                            <TooltipContent>{data.activity_type}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>

                      <TableCell className="">
                        <div className="flex gap-1">
                          {
                            data.from_account.account_icon ? (<Avatar>
                              <AvatarImage src={data.from_account.account_icon} />
                              <AvatarFallback>{data.from_address?.slice(0, 2)}</AvatarFallback>
                            </Avatar>) : (<span></span>)}
                          {
                            data.from_account.account_label ? (<span>{data.from_account.account_label}</span>)
                              : (<span>{data.from_address?.slice(0, 5) + "..." + data.from_address?.slice(data.from_address?.length - 5, data.from_address?.length)}</span>)
                          }

                          <LucideCopy size={10} className="text-blue-600" fontSize={2} onClick={() => { navigator.clipboard.writeText(data.from_address), toast("From Address Copied ✅") }} />
                        </div>

                      </TableCell>

                      <TableCell className="">
                        <div className="flex gap-1">
                          {data.to_account.account_icon ? (<Avatar><AvatarImage>{data.to_account.account_icon}</AvatarImage><AvatarFallback>{data.to_account.account_address?.slice(0, 2)}</AvatarFallback></Avatar>) : (<span></span>)}
                          {data.to_account.account_label ? (<span>{data.to_account.account_label}</span>) : (<span>{data.to_address?.slice(0, 5) + "..." + data.to_address?.slice(data.to_address?.length - 5, data.to_address?.length)}</span>)}

                          <LucideCopy size={10} className="text-blue-600" fontSize={2} onClick={() => { navigator.clipboard.writeText(data.to_address), toast("To Address Copied ✅") }} />
                        </div>

                      </TableCell>
                                            
                      <TableCell className=""> {data.amount
                        ? <span>{data.amount}</span>
                        : 'N/A'}
                        </TableCell>

                      
                      <TableCell className=""> {data.amount && supplyPrice?.price
                        ? (formatUSD(Number(data.amount) * Number(supplyPrice?.price)))
                        : 'N/A'}
                        </TableCell>
                      <TableCell className=""> 
                        <div className="flex gap-1 items-center justify-center">
                          <Avatar>
                            <AvatarImage src={supplyPrice?.icon}/>
                            <AvatarFallback>{supplyPrice?.symbol.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <p className="font-medium text-lg">{supplyPrice?.symbol}</p>
                        </div>
                        </TableCell>

                    </TableRow>
                  </TableBody>
                )
              })
            ) : (
              skeletonArray.map((data) => {
                return (<TableBody key={data}>
                  <TableRow>
                    <TableCell className=""><Skeleton className="w-30 h-4" /></TableCell>
                    <TableCell className=""><Skeleton className="w-15 h-4" /></TableCell>
                    <TableCell className=""><Skeleton className="w-20 h-4" /></TableCell>
                    <TableCell className=""><Skeleton className="w-30 h-4" /></TableCell>
                    <TableCell className=""><Skeleton className="w-30 h-4" /></TableCell>
                    <TableCell className=""><Skeleton className="w-20 h-4" /></TableCell>
                    <TableCell className=""><Skeleton className="w-13 h-4" /></TableCell>
                    <TableCell className=""><Skeleton className="w-10 h-4" /></TableCell>
                  </TableRow>

                </TableBody>)
              })
            )
          }

        </Table>
      )}
    </div>
  )
}
