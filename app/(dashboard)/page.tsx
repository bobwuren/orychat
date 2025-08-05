import {SiteHeader} from "@/components/site-header";
import {SectionCards} from "@/components/section-cards";
import {ChartAreaInteractive} from "@/components/chart-area-interactive";
import {DataTable} from "@/components/ui/data-table";
import React from "react";

export default function DashboardHome() {
    return (
        <div className="flex flex-1 flex-col">
            <SiteHeader/>
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <SectionCards/>
                    <div className="px-4 lg:px-6">
                        <ChartAreaInteractive/>
                    </div>
                    {/* <DataTable data={[]} columns={[]}/> */}
                </div>
            </div>
        </div>
    );
}
