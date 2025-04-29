"use client"
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import axios from "axios";

type chainDataType  = {
    currentEpoch: number
    blockHeight: number
    absoluteSlot: number
    transactionCount: number
}
export default function DashNav() {
    const [chainData, setChainData] = useState<chainDataType>()
    const SOLSCAN_API_KEY = process.env.NEXT_PUBLIC_SOLSCAN_API_KEY || ""
    // Fetch chain data from Solscan API
   useEffect(() => {
    const requestOptions = {
        method: "get",
        url: "https://public-api.solscan.io/chaininfo",
        headers: {
            token: SOLSCAN_API_KEY,
        }
    }

     axios.request(requestOptions)
        .then(response => setChainData(response.data.data))
        .catch(err => console.error(err));
   }, [SOLSCAN_API_KEY])
       
    return(
        <div className="mb-10 p-3">
                <Table>
                    <TableHeader className="">
                    <TableRow className="">
                        <TableHead className="w-[100px]">Current Enoch</TableHead>
                        <TableHead>Block Height</TableHead>
                        <TableHead>Absolute Slot</TableHead>
                        <TableHead>Transaction Count</TableHead>
                    </TableRow>
                </TableHeader>
            {
            chainData ? ( 
                    <TableBody className="font-medium text-sm">
                        <TableRow>
                            <TableCell className="">{chainData.currentEpoch}</TableCell>
                    <TableCell className="">{chainData.blockHeight}</TableCell>
                    <TableCell className="">{chainData.absoluteSlot}</TableCell>
                    <TableCell className="">{chainData.transactionCount}</TableCell>
                        </TableRow>
                    
                    </TableBody>
            )
                : (
                    <TableBody>
                        <TableRow>
                            <TableCell className=""><Skeleton className="w-20 h-4"/></TableCell>
                    <TableCell className=""><Skeleton className="w-20 h-4"/></TableCell>
                    <TableCell className=""><Skeleton className="w-20 h-4"/></TableCell>
                    <TableCell className=""><Skeleton className="w-20 h-4"/></TableCell>
                        </TableRow>
                    
                    </TableBody>
                )
                
            }
            
            </Table>
        </div>
    )
}
