"use client";

 

import { Customer360Page } from "@/components/shared/customer-360-page";
import { useParams } from "next/navigation";


const ProspectDetailPage = ()=> {
    const { id } =  useParams<{id: string}>();

    return (
        <Customer360Page id={id} />
    );
}

export default ProspectDetailPage