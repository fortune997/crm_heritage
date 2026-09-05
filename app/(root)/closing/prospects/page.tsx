"use client";

import Link from "next/link";
import {
    Suspense,
    useMemo,
    useState,
} from "react";
import { useSearchParams } from "next/navigation";

import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    CalendarClock,
    FilterX,
    Loader2,
    MoreHorizontal,
    RefreshCcw,
    Search,
    Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    useClosingCases,
} from "@/core/hooks/closing/useClosing";

import {
    CLOSING_STAGES,
    type ClosingCase,
    type ClosingPriority,
    type ClosingStage,
} from "@/core/types/closing";
import { ClosingReportButton } from "@/components/closing/ui/ClosingReportButton";


// ============================================================
// CONFIGURATION
// ============================================================

const ITEMS_PER_PAGE = 10;

const stageConfig: Record<
    ClosingStage,
    {
        label: string;
        className: string;
    }
> = {
    nouveau: {
        label: "Nouveau",
        className:
            "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
    },
    a_contacter: {
        label: "À contacter",
        className:
            "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300",
    },
    contacte: {
        label: "Contacté",
        className:
            "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950 dark:text-cyan-300",
    },
    interesse: {
        label: "Intéressé",
        className:
            "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-300",
    },
    negociation: {
        label: "Négociation",
        className:
            "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300",
    },
    documents_attendus: {
        label: "Documents attendus",
        className:
            "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
    },
    reservation_attendue: {
        label: "Réservation attendue",
        className:
            "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-300",
    },
    paiement_initial: {
    label: "Paiement initial",
    className:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
},
    a_relancer: {
        label: "À relancer",
        className:
            "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
    },
    gagne: {
        label: "Gagné",
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    },
    perdu: {
        label: "Perdu",
        className:
            "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
    },
};

const priorityConfig: Record<
    ClosingPriority,
    {
        label: string;
        className: string;
    }
> = {
    basse: {
        label: "Basse",
        className:
            "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300",
    },
    normale: {
        label: "Normale",
        className:
            "border-blue-200 text-blue-700 dark:border-blue-900 dark:text-blue-300",
    },
    haute: {
        label: "Haute",
        className:
            "border-orange-200 text-orange-700 dark:border-orange-900 dark:text-orange-300",
    },
    urgente: {
        label: "Urgente",
        className:
            "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
    },
};


// ============================================================
// UTILITAIRES
// ============================================================

function isClosingStage(
    value: string | null
): value is ClosingStage {
    return CLOSING_STAGES.some(
        (stage) => stage === value
    );
}

function formatDate(
    date: string | null
): string {
    if (!date) {
        return "Non renseignée";
    }

    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
    }).format(new Date(date));
}

function formatDateTime(
    date: string | null
): string {
    if (!date) {
        return "Aucune relance";
    }

    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
}

function normalizeSearch(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function getUniqueOptions(
    closingCases: ClosingCase[],
    type: "commercial" | "closer" | "site"
) {
    const options = new Map<
        string,
        string
    >();

    closingCases.forEach(
        (closingCase) => {
            if (
                type === "commercial" &&
                closingCase.source_commercial
            ) {
                options.set(
                    closingCase
                        .source_commercial.id,
                    closingCase
                        .source_commercial
                        .full_name
                );
            }

            if (
                type === "closer" &&
                closingCase.assigned_closer
            ) {
                options.set(
                    closingCase
                        .assigned_closer.id,
                    closingCase
                        .assigned_closer
                        .full_name
                );
            }

            if (
                type === "site" &&
                closingCase.visit.site
            ) {
                options.set(
                    closingCase.visit.site.id,
                    closingCase.visit.site
                        .nom_titre
                );
            }
        }
    );

    return Array.from(options)
        .map(([id, label]) => ({
            id,
            label,
        }))
        .sort((first, second) =>
            first.label.localeCompare(
                second.label,
                "fr"
            )
        );
}


// ============================================================
// CONTENU
// ============================================================

function ClosingProspectsContent() {
    const searchParams = useSearchParams();

    const initialStage =
        searchParams.get("stage");

    const [search, setSearch] =
        useState("");

    const [stage, setStage] = useState<
        ClosingStage | "all"
    >(
        isClosingStage(initialStage)
            ? initialStage
            : "all"
    );

    const [priority, setPriority] =
        useState<ClosingPriority | "all">(
            "all"
        );

    const [
        commercialId,
        setCommercialId,
    ] = useState("all");

    const [closerId, setCloserId] =
        useState("all");

    const [siteId, setSiteId] =
        useState("all");

    const [currentPage, setCurrentPage] =
        useState(1);

    const {
        data: closingCases = [],
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useClosingCases();

    const commercialOptions = useMemo(
        () =>
            getUniqueOptions(
                closingCases,
                "commercial"
            ),
        [closingCases]
    );

    const closerOptions = useMemo(
        () =>
            getUniqueOptions(
                closingCases,
                "closer"
            ),
        [closingCases]
    );

    const siteOptions = useMemo(
        () =>
            getUniqueOptions(
                closingCases,
                "site"
            ),
        [closingCases]
    );

    const filteredCases = useMemo(() => {
        const normalizedSearch =
            normalizeSearch(search);

        return closingCases.filter(
            (closingCase) => {
                const searchableContent =
                    normalizeSearch(
                        [
                            closingCase.prospect
                                .full_name,
                            closingCase.prospect
                                .phone ?? "",
                            closingCase.prospect
                                .email ?? "",
                            closingCase.visit.site
                                ?.nom_titre ?? "",
                            closingCase
                                .source_commercial
                                ?.full_name ?? "",
                            closingCase
                                .assigned_closer
                                ?.full_name ?? "",
                        ].join(" ")
                    );

                const matchesSearch =
                    !normalizedSearch ||
                    searchableContent.includes(
                        normalizedSearch
                    );

                const matchesStage =
                    stage === "all" ||
                    closingCase.stage === stage;

                const matchesPriority =
                    priority === "all" ||
                    closingCase.priority ===
                        priority;

                const matchesCommercial =
                    commercialId === "all" ||
                    closingCase
                        .source_commercial_id ===
                        commercialId;

                const matchesCloser =
                    closerId === "all" ||
                    closingCase
                        .assigned_closer_id ===
                        closerId;

                const matchesSite =
                    siteId === "all" ||
                    closingCase.visit.site_id ===
                        siteId;

                return (
                    matchesSearch &&
                    matchesStage &&
                    matchesPriority &&
                    matchesCommercial &&
                    matchesCloser &&
                    matchesSite
                );
            }
        );
    }, [
        closingCases,
        search,
        stage,
        priority,
        commercialId,
        closerId,
        siteId,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredCases.length /
                ITEMS_PER_PAGE
        )
    );

    const safeCurrentPage = Math.min(
        currentPage,
        totalPages
    );

    const paginatedCases = useMemo(() => {
        const start =
            (safeCurrentPage - 1) *
            ITEMS_PER_PAGE;

        return filteredCases.slice(
            start,
            start + ITEMS_PER_PAGE
        );
    }, [
        filteredCases,
        safeCurrentPage,
    ]);

    function resetFilters() {
        setSearch("");
        setStage("all");
        setPriority("all");
        setCommercialId("all");
        setCloserId("all");
        setSiteId("all");
        setCurrentPage(1);
    }

    const hasActiveFilters =
        search !== "" ||
        stage !== "all" ||
        priority !== "all" ||
        commercialId !== "all" ||
        closerId !== "all" ||
        siteId !== "all";

    return (
        <main
            className="
                min-h-screen bg-slate-50/60
                dark:bg-slate-950
            "
        >
            <div
                className="
                    mx-auto flex w-full
                    max-w-400 flex-col gap-6
                    p-4 sm:p-6 lg:p-8
                "
            >
                {/* En-tête */}

                <header
                    className="
                        flex flex-col gap-4
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                    "
                >
                    <div>
                        <Button
                            
                            variant="ghost"
                            size="sm"
                            className="-ml-3 mb-2"
                        >
                            <Link href="/closing">
                                <ArrowLeft className="size-4" />
                                Retour au tableau de bord
                            </Link>
                        </Button>

                        <div className="flex items-center gap-3">
                            <div
                                className="
                                    flex size-11 items-center
                                    justify-center rounded-xl
                                    bg-blue-600 text-white
                                    shadow-sm
                                "
                            >
                                <Users className="size-5" />
                            </div>

                            <div>
                                <h1
                                    className="
                                        text-2xl font-bold
                                        tracking-tight
                                        text-slate-950
                                        dark:text-white
                                    "
                                >
                                    Prospects à closer
                                </h1>

                                <p
                                    className="
                                        text-sm text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Gérez les prospects ayant
                                    effectué une visite.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
    <ClosingReportButton
        closingCases={filteredCases}
        disabled={isLoading || isError}
    />

    <Button
        variant="outline"
        disabled={isFetching}
        onClick={() => {
            void refetch();
        }}
    >
        {isFetching ? (
            <Loader2 className="size-4 animate-spin" />
        ) : (
            <RefreshCcw className="size-4" />
        )}

        Actualiser
    </Button>
</div>
                </header>

                {/* Filtres */}

                <Card
                    className="
                        border-slate-200 bg-white
                        dark:border-slate-800
                        dark:bg-slate-950
                    "
                >
                    <CardContent className="p-4 sm:p-5">
                        <div
                            className="
                                grid gap-3
                                md:grid-cols-2
                                xl:grid-cols-4
                            "
                        >
                            <div
                                className="
                                    relative
                                    md:col-span-2
                                "
                            >
                                <Search
                                    className="
                                        absolute left-3 top-1/2
                                        size-4 -translate-y-1/2
                                        text-slate-400
                                    "
                                />

                                <Input
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(
                                            event.target.value
                                        );
                                        setCurrentPage(1);
                                    }}
                                    placeholder="Rechercher un prospect, téléphone, site ou commercial..."
                                    className="pl-9"
                                />
                            </div>

                            <Select
                                value={stage}
                                onValueChange={(value) => {
                                    setStage(
                                        value as
                                            | ClosingStage
                                            | "all"
                                    );
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Étape" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">
                                        Toutes les étapes
                                    </SelectItem>

                                    {CLOSING_STAGES.map(
                                        (closingStage) => (
                                            <SelectItem
                                                key={closingStage}
                                                value={closingStage}
                                            >
                                                {
                                                    stageConfig[
                                                        closingStage
                                                    ].label
                                                }
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>

                            <Select
                                value={priority}
                                onValueChange={(value) => {
                                    setPriority(
                                        value as
                                            | ClosingPriority
                                            | "all"
                                    );
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Priorité" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">
                                        Toutes les priorités
                                    </SelectItem>

                                    {Object.entries(
                                        priorityConfig
                                    ).map(
                                        ([
                                            value,
                                            config,
                                        ]) => (
                                            <SelectItem
                                                key={value}
                                                value={value}
                                            >
                                                {config.label}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>

                            <Select
                                value={commercialId}
                                onValueChange={(value) => {
                                    setCommercialId(value ?? "");
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Commercial" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">
                                        Tous les commerciaux
                                    </SelectItem>

                                    {commercialOptions.map(
                                        (option) => (
                                            <SelectItem
                                                key={option.id}
                                                value={option.id}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>

                            <Select
                                value={closerId}
                                onValueChange={(value) => {
                                    setCloserId(value ?? "");
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Responsable closing" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">
                                        Tous les responsables
                                    </SelectItem>

                                    {closerOptions.map(
                                        (option) => (
                                            <SelectItem
                                                key={option.id}
                                                value={option.id}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>

                            <Select
                                value={siteId}
                                onValueChange={(value) => {
                                    setSiteId(value ?? "");
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Site" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">
                                        Tous les sites
                                    </SelectItem>

                                    {siteOptions.map(
                                        (option) => (
                                            <SelectItem
                                                key={option.id}
                                                value={option.id}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>

                            <Button
                                type="button"
                                variant="outline"
                                disabled={!hasActiveFilters}
                                onClick={resetFilters}
                            >
                                <FilterX className="size-4" />
                                Réinitialiser
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Erreur */}

                {isError && (
                    <div
                        role="alert"
                        className="
                            flex items-start gap-3 rounded-xl
                            border border-red-200
                            bg-red-50 p-4 text-red-700
                            dark:border-red-900
                            dark:bg-red-950/50
                            dark:text-red-300
                        "
                    >
                        <AlertCircle className="mt-0.5 size-5 shrink-0" />

                        <div>
                            <p className="font-medium">
                                Impossible de charger les dossiers
                            </p>

                            <p className="mt-1 text-sm">
                                {error.message}
                            </p>
                        </div>
                    </div>
                )}

                {/* Tableau */}

                <Card
                    className="
                        overflow-hidden border-slate-200
                        bg-white dark:border-slate-800
                        dark:bg-slate-950
                    "
                >
                    <div
                        className="
                            flex items-center justify-between
                            border-b border-slate-200
                            px-5 py-4
                            dark:border-slate-800
                        "
                    >
                        <div>
                            <h2 className="font-semibold">
                                Dossiers Closing
                            </h2>

                            <p
                                className="
                                    text-sm text-slate-500
                                    dark:text-slate-400
                                "
                            >
                                {filteredCases.length} dossier(s)
                                trouvé(s)
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table className="min-w-300">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Prospect</TableHead>
                                    <TableHead>Visite</TableHead>
                                    <TableHead>Commercial</TableHead>
                                    <TableHead>Site</TableHead>
                                    <TableHead>Étape</TableHead>
                                    
                                    <TableHead>Prochaine relance</TableHead>
                                    <TableHead>Responsable</TableHead>
                                    <TableHead className="w-14" />
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={9}
                                            className="h-64 text-center"
                                        >
                                            <Loader2
                                                className="
                                                    mx-auto size-7
                                                    animate-spin
                                                    text-slate-400
                                                "
                                            />
                                        </TableCell>
                                    </TableRow>
                                ) : paginatedCases.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={9}
                                            className="h-64 text-center"
                                        >
                                            <Users
                                                className="
                                                    mx-auto size-10
                                                    text-slate-300
                                                    dark:text-slate-700
                                                "
                                            />

                                            <p className="mt-3 font-medium">
                                                Aucun dossier trouvé
                                            </p>

                                            <p
                                                className="
                                                    mt-1 text-sm
                                                    text-slate-500
                                                "
                                            >
                                                Modifiez les filtres ou
                                                vérifiez les visites effectuées.
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedCases.map(
                                        (closingCase) => {
                                            const stage =
                                                stageConfig[
                                                    closingCase.stage
                                                ];

                                          

                                            return (
                                                <TableRow
                                                    key={closingCase.id}
                                                >
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">
                                                                {
                                                                    closingCase
                                                                        .prospect
                                                                        .full_name
                                                                }
                                                            </p>

                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-slate-500
                                                                "
                                                            >
                                                                {closingCase
                                                                    .prospect
                                                                    .phone ??
                                                                    "Aucun téléphone"}
                                                            </p>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        {formatDate(
                                                            closingCase
                                                                .visit
                                                                .visit_date
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        {closingCase
                                                            .source_commercial
                                                            ?.full_name ??
                                                            "Non renseigné"}
                                                    </TableCell>

                                                    <TableCell>
                                                        {closingCase
                                                            .visit.site
                                                            ?.nom_titre ??
                                                            "Non renseigné"}
                                                    </TableCell>

                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                stage.className
                                                            }
                                                        >
                                                            {stage.label}
                                                        </Badge>
                                                    </TableCell>

                                                    

                                                    <TableCell>
                                                        <span
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                            "
                                                        >
                                                            <CalendarClock className="size-4 text-slate-400" />

                                                            {formatDateTime(
                                                                closingCase
                                                                    .next_follow_up_at
                                                            )}
                                                        </span>
                                                    </TableCell>

                                                    <TableCell>
                                                        {closingCase
                                                            .assigned_closer
                                                            ?.full_name ??
                                                            "Non affecté"}
                                                    </TableCell>

                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger
                                                                
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="size-8"
                                                                >
                                                                    <MoreHorizontal className="size-4" />

                                                                    <span className="sr-only">
                                                                        Actions
                                                                    </span>
                                                                </Button>
                                                            </DropdownMenuTrigger>

                                                            <DropdownMenuContent
                                                                align="end"
                                                                className="w-48"
                                                            >
                                                                <DropdownMenuGroup>
                                                                <DropdownMenuLabel>
                                                                    Actions
                                                                </DropdownMenuLabel>

                                                                <DropdownMenuSeparator />

                                                                <DropdownMenuItem
                                                                    
                                                                >
                                                                    <Link
                                                                        href={`/closing/prospects/${closingCase.id}`}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        Voir le dossier

                                                                        <ArrowRight
                                                                            className="
                                                                                ml-auto
                                                                                size-4
                                                                            "
                                                                        />
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                </DropdownMenuGroup>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        }
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {!isLoading &&
                        filteredCases.length > 0 && (
                            <div
                                className="
                                    flex flex-col gap-3
                                    border-t border-slate-200
                                    px-5 py-4
                                    dark:border-slate-800
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >
                                <p
                                    className="
                                        text-sm text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    Page {safeCurrentPage} sur{" "}
                                    {totalPages}
                                </p>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={
                                            safeCurrentPage <= 1
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                (page) =>
                                                    Math.max(
                                                        1,
                                                        page - 1
                                                    )
                                            )
                                        }
                                    >
                                        Précédent
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={
                                            safeCurrentPage >=
                                            totalPages
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                (page) =>
                                                    Math.min(
                                                        totalPages,
                                                        page + 1
                                                    )
                                            )
                                        }
                                    >
                                        Suivant
                                    </Button>
                                </div>
                            </div>
                        )}
                </Card>
            </div>
        </main>
    );
}


// ============================================================
// PAGE
// ============================================================

export default function ClosingProspectsPage() {
    return (
        <Suspense
            fallback={
                <div
                    className="
                        flex min-h-96 items-center
                        justify-center
                    "
                >
                    <Loader2
                        className="
                            size-7 animate-spin
                            text-slate-400
                        "
                    />
                </div>
            }
        >
            <ClosingProspectsContent />
        </Suspense>
    );
}