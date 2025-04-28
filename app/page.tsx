"use client"
import SolanaPriceChart from "../components/custom/solanaPriceChart";
import DashNav from "../components/custom/dashNav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TokenSm from "@/components/custom/tokensSm";


export default function Page() {
  
  return (
    <section className="px-4 py-4">
      <div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-800 mb-6 bg-clip-text text-transparent">
  SolDash
</h1>
      </div>
      <DashNav/>
        <div className="flex h-fit relative lg:flex-row flex-col items-start gap-5 justify-between">
          <div className="w-full">
             <TokenSm/>
                <div className="w-full flex items-center justify-center mt-3">
                <Link href="/tokens/tokenslist" className="p-2"><Button variant={"outline"}>See More</Button></Link>
                </div>                
          </div>
      <div className=" w-full md:sticky md:top-0">
        <SolanaPriceChart />
      </div>
      
    </div>
    </section>
  );
}