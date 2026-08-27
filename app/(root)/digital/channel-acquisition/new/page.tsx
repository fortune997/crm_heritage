'use client'

import { AcquisitionChannelForm } from "@/components/forms/canal/AcquisitionChannelForm"



export default function NewAcquisitionChannelPage() {

    return (

        <div className="space-y-6 p-6">


            <div>
                <h1 className="text-2xl font-bold">
                    Nouveau canal d'acquisition
                </h1>

                <p className="text-muted-foreground">
                    Configurez un nouveau canal marketing pour suivre vos prospects.
                </p>
            </div>
            <AcquisitionChannelForm />
        </div>

    )
}