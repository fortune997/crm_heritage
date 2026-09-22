'use client'

import { Badge } from "@/components/ui/badge";

const qualificationConfig = {
  H1: {
    label: "H1 - Non intéressé",
    className: "bg-red-100 text-red-800",
  },
  H2: {
    label: "H2 - Besoin d’informations",
    className: "bg-amber-100 text-amber-800",
  },
  H3: {
    label: "H3 - Intéressé",
    className: "bg-orange-100 text-orange-800",
  },
  H4: {
    label: "H4 - Souhaite un rendez-vous au bureau",
    className: "bg-blue-100 text-blue-800",
  },
  H5: {
    label: "H5 - Souhaite effectuer une visite",
    className: "bg-purple-100 text-purple-800",
  },
  H6: {
    label: "H6 - Visite effectuée",
    className: "bg-teal-100 text-teal-800",
  },
  H7: {
    label: "H7 - Paiement effectué",
    className: "bg-emerald-100 text-emerald-800",
  },
} as const;

type QualificationCode = keyof typeof qualificationConfig;

function isQualificationCode(value: string): value is QualificationCode {
  return Object.prototype.hasOwnProperty.call(qualificationConfig, value);
}

type QualificationStatusProps = {
  qualificationStatus?: string | null;
};

export function QualificationStatus({
  qualificationStatus,
}: QualificationStatusProps) {
  const config =
    qualificationStatus && isQualificationCode(qualificationStatus)
      ? qualificationConfig[qualificationStatus]
      : null;

  return (
    <Badge variant="secondary" className={config?.className}>
      {config?.label || qualificationStatus || "Non défini"}
    </Badge>
  );
}