"use client"
import TrendingToken from "@/components/custom/trendingToken";
import SolanaPriceChart from "../components/custom/solanaPriceChart";
import SolanaExchange from "../components/custom/topTokenHolders";
import DashNav from "../components/custom/dashNav";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Page() {
  
  return (
    <section className="px-4 py-4">
      <DashNav/>
        <div className="flex h-fit relative lg:flex-row flex-col items-start gap-5 justify-between">
          <div className="lg:max-w-[700px]">
             <TrendingToken/>
                <div className="w-full flex items-center justify-center mt-3">
                <Link href="/tokens" className="p-2"><Button variant={"outline"}>See More</Button></Link>
                </div>                
          </div>
      <div className="lg:max-w-[700px] w-full sticky top-0">
        <SolanaPriceChart />
      </div>
      
    </div>
    </section>
  );
}