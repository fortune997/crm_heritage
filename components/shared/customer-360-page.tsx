import { customer360Demo } from "@/core/types/prospectId/data_dema";
import { Customer360Header } from "../prospectId/customer-360-header";
import { Customer360Pipeline } from "../prospectId/customer-360-pipeline";
import { PersonalInfoCard } from "../prospectId/personal-info-card";
import { ProjectInfoCard } from "../prospectId/project-info-card";
import { CustomerSummaryCard } from "../prospectId/customer-summary-card";
import { VisitsCard } from "../prospectId/visits-card";
import { PaymentsCard } from "../prospectId/payments-card";
import { DocumentsCard } from "../prospectId/documents-card";
import { AssignedCommercialCard } from "../prospectId/assigned-commercial-card";
import { ActivityTimeline } from "../prospectId/activity-timeline";
import { ProposedLandCard } from "../prospectId/proposed-land-card";
import { QuickActions } from "../prospectId/quick-actions";


export function Customer360Page() {
    const customer = customer360Demo;

    return (
        <div className="min-h-screen bg-muted/20 pb-20">
            <div className="mx-auto max-w-[1800px] space-y-5 p-4 md:p-6 lg:p-4">
                {/* HEADER */}
                <Customer360Header
                    customer={customer}
                />

                {/* PIPELINE */}
                <Customer360Pipeline
                    customer={customer}
                />

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                    {/* LEFT */}
                    <main className="min-w-0 space-y-5">
                        {/* OVERVIEW */}
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                            <PersonalInfoCard
                                customer={customer}
                            />



                            <CustomerSummaryCard
                                customer={customer}
                            />
                        </div>

                        {/* TRANSACTION */}
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                            <VisitsCard
                                customer={customer}
                            />

                            <PaymentsCard
                                customer={customer}
                            />

                            <DocumentsCard
                                customer={customer}
                            />
                            <ProjectInfoCard
                                customer={customer}
                            />
                        </div>

                        {/* NOTES
            <NotesCard
              customer={customer}
            /> */}
                    </main>

                    {/* RIGHT SIDEBAR */}
                    <aside className="min-w-0 space-y-5">
                        <AssignedCommercialCard
                            customer={customer}
                        />

                        <ActivityTimeline
                            customer={customer}
                        />

                        <ProposedLandCard
                            customer={customer}
                        />
                    </aside>
                </div>
            </div>

            <QuickActions />
        </div>
    );
}