"use client"

import { useTokenContext } from "@/components/custom/context"
import axios from "axios"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import axiosInstance from "@/lib/axiosClient"


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
  owner: string | null,
  rank: number | null,
}

export default function Page() {
  const SOLSCAN_API_KEY = process.env.NEXT_PUBLIC_SOLSCAN_API_KEY || ""
  const searchParams = useSearchParams()
  const address = searchParams.get("address")
  const { tokenInfo } = useTokenContext()
  const [holderData, setHolderData] = useState<TokenHolder[]>([])
  console.log( holderData)

  useEffect(() => {
    const options = {
      method: "GET",
      url: `https://pro-api.solscan.io/v2.0/token/holders?address=${address}&page=1&page_size=20`,
      headers: {
        token: SOLSCAN_API_KEY,
      }
    };

    axios
      .request(options)
      .then((res) => {
        const data = res.data.data.items
        console.log(data)
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

      setHolderData(allTokens)

    }
  }, [address, tokenInfo.address])
  return (
    <div className="mb-10 p-3">
      <Table>
        <TableHeader className="">
          <TableRow className="">
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead>Account Owner</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Transaction Count</TableHead>
          </TableRow>
        </TableHeader>
        {
          holderData.length > 0 ?
            holderData.map((data: TokenHolder, index: number) =>
            (
              <TableBody className="font-medium text-sm">
                <TableRow>
                  <TableCell className="">{ data.rank }</TableCell>
                  <TableCell className="">{ data.owner?.slice(0, 8) }...</TableCell>
                  <TableCell className="">{ data.amount}</TableCell>
                  <TableCell className="">{ data.type}</TableCell>
                </TableRow>

              </TableBody>
            ))
            : (
              <TableBody>
                <TableRow>
                  <TableCell className=""><Skeleton className="w-20 h-4" /></TableCell>
                  <TableCell className=""><Skeleton className="w-20 h-4" /></TableCell>
                  <TableCell className=""><Skeleton className="w-20 h-4" /></TableCell>
                  <TableCell className=""><Skeleton className="w-20 h-4" /></TableCell>
                </TableRow>

              </TableBody>
            )}
      </Table>
    </div>
  )
}
