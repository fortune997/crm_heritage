"use client";


import ReadValue from "@/components/rapport/ReadValue";
import { useUsersTopographique } from "@/core/hooks/admin/useUsers";
import { useAssignTopo, useTopoId, useUpdateVisitReport, useVisites } from "@/core/hooks/visites/useVisite";
import { formatDate } from "@/core/lib/utils";
import { HeritageUser } from "@/core/types/profiles";
import { Visit } from "@/core/types/visites/type";
import {
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    Edit3,
    FileText,
    Filter,
    MapPin,
    Phone,
    Printer,
    RotateCcw,
    Save,
    Search,
    User,
    UserPlus,
    Users,
    X,
} from "lucide-react";
import {
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";


export type InterestLevel =
    | "Très intéressé"
    | "Intéressé"
    | "Peu intéressé"
    | "Pas intéressé";

type ReportStatus = "Complété" | "À compléter";





const surveyors = [
    "Dylane Mempouza",
    "Jean Topographe",
    "Pierre Ndzié",
    "Paul Essomba",
];

/* =========================================================
   HELPERS
========================================================= */


function formatCurrency(value: number | "") {
    if (!value) return "—";

    return `${new Intl.NumberFormat("fr-FR").format(
        Number(value)
    )} FCFA`;
}

function getInterestClass(level: string) {
    switch (level) {
        case "Très intéressé":
            return `
        border-emerald-200 bg-emerald-50 text-emerald-700
        dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400
      `;

        case "Intéressé":
            return `
        border-blue-200 bg-blue-50 text-blue-700
        dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-400
      `;

        case "Peu intéressé":
            return `
        border-orange-200 bg-orange-50 text-orange-700
        dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-400
      `;

        case "Pas intéressé":
            return `
        border-red-200 bg-red-50 text-red-700
        dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400
      `;
    }
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ConfirmedVisitsView() {
    //const [visits, setVisits] = useState<Visit[]>(initialVisits);

    /* OPEN REPORT */
    const [openedVisitId, setOpenedVisitId] = useState<string | null>(null);


    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState<Visit | null>(null);

    /* MULTIPLE SELECTION */
    const [selectedVisitIds, setSelectedVisitIds] = useState<string[]>(
        []
    );

    /* ASSIGN MODAL */
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedSurveyor, setSelectedSurveyor] = useState("");

    /* FILTERS */
    const [search, setSearch] = useState("");
    const [period, setPeriod] = useState("all");
    const [surveyorFilter, setSurveyorFilter] = useState("all");
    const [interestFilter, setInterestFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const { data: visitData = [], isLoading, isError, error } = useVisites();
    const { data: topoData = [] } = useUsersTopographique();
    const { mutate: assign, isPending } = useAssignTopo();
    const {
        mutate: updateReport,
        isPending: isSavingReport,
    } = useUpdateVisitReport();


    const filteredVisits = useMemo(() => {
        return visitData?.filter((visit: Visit) => {
            const searchValue = search.toLowerCase();

            const matchesSearch =
                visit?.prospects?.full_name.toLowerCase().includes(searchValue) ||
                visit?.prospects?.phone.toLowerCase().includes(searchValue) ||
                visit?.prospects?.id.toLowerCase().includes(searchValue) ||
                visit?.sites?.nom_titre.toLowerCase().includes(searchValue);

            /* const matchesSurveyor =
                surveyorFilter === "all" ||
                visit.surveyor === surveyorFilter;

            const matchesInterest =
                interestFilter === "all" ||
                visit.interestLevel === interestFilter;

            const matchesStatus =
                statusFilter === "all" ||
                visit.reportStatus === statusFilter; */

            const today = new Date();

            const visitDate = new Date(visit.visit_date);

            let matchesPeriod = true;

            if (period === "today") {
                matchesPeriod = visitDate.toDateString() === today.toDateString();
            }

            if (period === "week") {
                const startOfWeek = new Date(today);

                startOfWeek.setDate(
                    today.getDate() - today.getDay()
                );

                startOfWeek.setHours(0, 0, 0, 0);

                const endOfWeek = new Date(startOfWeek);

                endOfWeek.setDate(startOfWeek.getDate() + 6);

                endOfWeek.setHours(23, 59, 59, 999);

                matchesPeriod =
                    visitDate >= startOfWeek &&
                    visitDate <= endOfWeek;
            }

            if (period === "month") {
                matchesPeriod =
                    visitDate.getMonth() === today.getMonth() &&
                    visitDate.getFullYear() === today.getFullYear();
            }

            return (
                matchesSearch &&
                /*  matchesSurveyor &&
                 matchesInterest &&
                 matchesStatus && */
                matchesPeriod
            );
        });
    }, [
        visitData,
        search,
        period,
        surveyorFilter,
        interestFilter,
        statusFilter,
    ]);

    const openedVisit = visitData.find(
        (visit: Visit) => visit.id === openedVisitId
    );

    useEffect(() => {
        if (
            openedVisitId &&
            !filteredVisits.some(
                (visit: Visit) => visit.id === openedVisitId
            )
        ) {
            setOpenedVisitId(null);
            setIsEditing(false);
            setDraft(null);
        }
    }, [filteredVisits, openedVisitId]);

    const completedReports = filteredVisits.filter(
        (visit: Visit) => visit.status === "completed"
    ).length;

    const pendingReports = filteredVisits.filter(
        (visit: Visit) => visit.status === "completed"
    ).length;

    const handleOpenVisit = (visit: Visit) => {
        setOpenedVisitId(visit.id);
        setIsEditing(false);
        setDraft(null);
    };

    const handleCloseReport = () => {
        setOpenedVisitId(null);
        setIsEditing(false);
        setDraft(null);
    };

    const handleStartEdit = () => {
        if (!openedVisit) return;

        setDraft({ ...openedVisit });

        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setDraft(null);

        setIsEditing(false);
    };


    const handleSaveReport = () => {
        if (!openedVisit || !draft) return;

        updateReport(
            {
                id: openedVisit.id,
                report: {
                    site: draft.sites.nom_titre,
                    interested_area:
                        draft.interested_area === ""
                            ? null
                            : draft.interested_area,
                    interest_level: draft.interest_level,
                    desired_price:
                        draft.desired_price === ""
                            ? null
                            : draft.desired_price,
                    observation: draft.observation,
                },
            },
            {
                onSuccess: () => {
                    setDraft(null);
                    setIsEditing(false);
                },
            }
        );
    };


    const toggleVisitSelection = (visitId: string) => {
        setSelectedVisitIds((current) => {
            if (current.includes(visitId)) {
                return current.filter((id) => id !== visitId);
            }

            return [...current, visitId];
        });
    };

    const toggleSelectAll = () => {
        const filteredIds = filteredVisits.map(
            (visit: Visit) => visit.id
        );

        const allSelected =
            filteredIds.length > 0 &&
            filteredIds.every((id: string) =>
                selectedVisitIds.includes(id)
            );

        if (allSelected) {
            setSelectedVisitIds((current) =>
                current.filter(
                    (id) => !filteredIds.includes(id)
                )
            );
        } else {
            setSelectedVisitIds((current) => [
                ...new Set([...current, ...filteredIds]),
            ]);
        }
    };

    const allFilteredSelected =
        filteredVisits.length > 0 &&
        filteredVisits.every((visit: Visit) =>
            selectedVisitIds.includes(visit.id)
        );

    const someFilteredSelected =
        filteredVisits.some((visit: Visit) =>
            selectedVisitIds.includes(visit.id)
        );

    /* =========================================================
       ASSIGN SURVEYOR
    ========================================================= */


    const handleAssignSurveyor = () => {
        if (!selectedSurveyor) return;

        selectedVisitIds.forEach((visitId) => {
            assign({
                id: visitId,
                topo: selectedSurveyor,
            });
        });

        setSelectedVisitIds([]);
        setSelectedSurveyor("");
        setIsAssignModalOpen(false);
    };

    /* =========================================================
       RESET FILTERS
    ========================================================= */

    const resetFilters = () => {
        setSearch("");

        setPeriod("all");

        setSurveyorFilter("all");

        setInterestFilter("all");

        setStatusFilter("all");
    };


    /*     const handlePrintList = () => {
            const printWindow = window.open("", "_blank");
    
            if (!printWindow) return;
    
            const rows = filteredVisits
                .map(
                    (visit: Visit) => `
              <tr>
                <td>${visit.id}</td>
                <td>${visit.clientName}</td>
                <td>${formatDate(visit.visitDate)}</td>
                <td>${visit.visitTime}</td>
                <td>${visit.commercial}</td>
                <td>${visit.surveyor ?? "Non attribué"}</td>
                <td>${visit.site || "-"}</td>
                <td>${visit.interestedArea || "-"} ${visit.interestedArea ? "m²" : ""
                        }</td>
                <td>${visit.interestLevel}</td>
                <td>${formatCurrency(
                            visit.desiredPrice
                        )}</td>
                <td>${visit.reportStatus}</td>
              </tr>
            `
                )
                .join("");
    
            printWindow.document.write(`
          <!DOCTYPE html>
          <html lang="fr">
            <head>
              <meta charset="UTF-8" />
              <title>Liste des visites confirmées</title>
    
              <style>
                * {
                  box-sizing: border-box;
                }
    
                body {
                  font-family: Arial, sans-serif;
                  padding: 30px;
                  color: #111827;
                }
    
                h1 {
                  margin-bottom: 5px;
                }
    
                p {
                  color: #6b7280;
                }
    
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 30px;
                  font-size: 12px;
                }
    
                th,
                td {
                  border: 1px solid #d1d5db;
                  padding: 8px;
                  text-align: left;
                }
    
                th {
                  background: #f3f4f6;
                }
              </style>
            </head>
    
            <body>
    
              <h1>Liste des visites confirmées</h1>
    
              <p>
                ${filteredVisits.length} visite(s)
              </p>
    
              <table>
    
                <thead>
                  <tr>
                    <th>Référence</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Commercial</th>
                    <th>Topographe</th>
                    <th>Site</th>
                    <th>Superficie</th>
                    <th>Intérêt</th>
                    <th>Prix souhaité</th>
                    <th>Rapport</th>
                  </tr>
                </thead>
    
                <tbody>
                  ${rows}
                </tbody>
    
              </table>
    
              <script>
                window.onload = () => {
                  window.print();
                }
              </script>
    
            </body>
          </html>
        `);
    
            printWindow.document.close();
        };
     */

    /*  const handlePrintReport = () => {
         if (!openedVisit) return;
 
         const printWindow = window.open("", "_blank");
 
         if (!printWindow) return;
 
         printWindow.document.write(`
       <!DOCTYPE html>
       <html lang="fr">
 
         <head>
 
           <meta charset="UTF-8" />
 
           <title>
             Rapport ${openedVisit.id}
           </title>
 
           <style>
 
             body {
               font-family: Arial, sans-serif;
               padding: 40px;
               color: #111827;
               max-width: 900px;
               margin: auto;
             }
 
             h1 {
               margin-bottom: 5px;
             }
 
             .reference {
               color: #6b7280;
               margin-bottom: 35px;
             }
 
             h2 {
               margin-top: 35px;
               padding-bottom: 10px;
               border-bottom: 1px solid #e5e7eb;
             }
 
             .grid {
               display: grid;
               grid-template-columns: 1fr 1fr;
               gap: 20px;
               margin-top: 20px;
             }
 
             .item {
               padding: 15px;
               border: 1px solid #e5e7eb;
               border-radius: 8px;
             }
 
             .label {
               color: #6b7280;
               font-size: 12px;
               margin-bottom: 7px;
             }
 
             .value {
               font-size: 16px;
               font-weight: bold;
             }
 
             .observation {
               margin-top: 20px;
               border: 1px solid #e5e7eb;
               padding: 20px;
               border-radius: 8px;
               min-height: 120px;
               line-height: 1.6;
             }
 
           </style>
 
         </head>
 
         <body>
 
           <h1>Rapport de visite</h1>
 
           <div class="reference">
             Référence : ${openedVisit.id}
           </div>
 
           <h2>Informations du client</h2>
 
           <div class="grid">
 
             <div class="item">
               <div class="label">Client</div>
               <div class="value">
                 ${openedVisit.clientName}
               </div>
             </div>
 
             <div class="item">
               <div class="label">Téléphone</div>
               <div class="value">
                 ${openedVisit.phone}
               </div>
             </div>
 
             <div class="item">
               <div class="label">Date de visite</div>
               <div class="value">
                 ${formatDate(openedVisit.visitDate)}
               </div>
             </div>
 
             <div class="item">
               <div class="label">Topographe</div>
               <div class="value">
                 ${openedVisit.surveyor ?? "Non attribué"}
               </div>
             </div>
 
           </div>
 
           <h2>Rapport du topographe</h2>
 
           <div class="grid">
 
             <div class="item">
               <div class="label">Site</div>
               <div class="value">
                 ${openedVisit.site || "-"}
               </div>
             </div>
 
             <div class="item">
               <div class="label">
                 Superficie intéressée
               </div>
 
               <div class="value">
                 ${openedVisit.interestedArea
                 ? `${openedVisit.interestedArea} m²`
                 : "-"
             }
               </div>
             </div>
 
             <div class="item">
               <div class="label">
                 Niveau d'intérêt
               </div>
 
               <div class="value">
                 ${openedVisit.interestLevel}
               </div>
             </div>
 
             <div class="item">
               <div class="label">
                 Prix souhaité
               </div>
 
               <div class="value">
                 ${formatCurrency(
                 openedVisit.desiredPrice
             )}
               </div>
             </div>
 
           </div>
 
           <div class="observation">
 
             <div class="label">
               Observations
             </div>
 
             <div class="value">
               ${openedVisit.observation ||
             "Aucune observation."
             }
             </div>
 
           </div>
 
           <script>
             window.onload = () => {
               window.print();
             }
           </script>
 
         </body>
 
       </html>
     `);
 
         printWindow.document.close();
     }; */


    return (
        <div
            className="
        min-h-screen
        bg-slate-50
        text-slate-900
        transition-colors

        dark:bg-slate-950
        dark:text-slate-100
      "
        >
            <div className="mx-auto max-w-450 p-4 ">


                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div
                            className="
                mb-2 flex items-center gap-2
                text-sm text-slate-500
                dark:text-slate-400
              "
                        >
                            <span>Visites</span>

                            <ChevronRight className="h-4 w-4" />

                            <span
                                className="
                  font-medium text-slate-900
                  dark:text-white
                "
                            >
                                Visites confirmées
                            </span>
                        </div>

                        <h1
                            className="
                text-2xl font-bold tracking-tight
                md:text-3xl
              "
                        >
                            Visites confirmées
                        </h1>

                        <p
                            className="
                mt-2 text-sm
                text-slate-500
                dark:text-slate-400
              "
                        >
                            Gérez les visites, attribuez-les aux topographes et consultez
                            les rapports.
                        </p>
                    </div>

                    <button

                        className="
              inline-flex items-center justify-center gap-2
              rounded-xl border
              border-slate-200
              bg-white
              px-4 py-2.5
              text-sm font-medium
              text-slate-700
              shadow-sm
              transition

              hover:bg-slate-50

              dark:border-slate-800
              dark:bg-slate-900
              dark:text-slate-200
              dark:hover:bg-slate-800
            "
                    >
                        <Printer className="h-4 w-4" />

                        Imprimer la liste
                    </button>
                </div>

                <div
                    className="
            mb-6 grid gap-4
            md:grid-cols-3
          "
                >
                    <StatCard
                        title="Visites affichées"
                        value={filteredVisits.length}
                        icon={<ClipboardList className="h-5 w-5" />}
                    />

                    <StatCard
                        title="Rapports complétés"
                        value={completedReports}
                        icon={<CheckCircle2 className="h-5 w-5" />}
                    />

                    <StatCard
                        title="À compléter"
                        value={pendingReports}
                        icon={<FileText className="h-5 w-5" />}
                    />
                </div>

                {/* =============================================
            FILTERS
        ============================================== */}

                <div
                    className="
            mb-6 rounded-2xl border
            border-slate-200
            bg-white
            p-4
            shadow-sm

            dark:border-slate-800
            dark:bg-slate-900
          "
                >
                    <div className="mb-4 flex items-center gap-2">
                        <Filter
                            className="
                h-4 w-4
                text-slate-500
                dark:text-slate-400
              "
                        />

                        <span className="text-sm font-semibold">
                            Filtres
                        </span>
                    </div>

                    <div
                        className="
              grid gap-3
              md:grid-cols-2
              xl:grid-cols-6
            "
                    >
                        {/* SEARCH */}

                        <div
                            className="
                relative
                xl:col-span-2
              "
                        >
                            <Search
                                className="
                  absolute left-3 top-1/2
                  h-4 w-4
                  -translate-y-1/2
                  text-slate-400
                "
                            />

                            <input
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Client, téléphone, référence..."
                                className="
                  h-11 w-full rounded-xl border
                  border-slate-200
                  bg-white
                  pl-10 pr-4
                  text-sm
                  outline-none
                  transition

                  focus:border-slate-400

                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                  dark:placeholder:text-slate-500
                  dark:focus:border-slate-500
                "
                            />
                        </div>

                        {/* PERIOD */}

                        <select
                            value={period}
                            onChange={(e) =>
                                setPeriod(e.target.value)
                            }
                            className="select-input"
                        >
                            <option value="all">
                                Toutes les périodes
                            </option>

                            <option value="today">
                                Aujourd'hui
                            </option>

                            <option value="week">
                                Cette semaine
                            </option>

                            <option value="month">
                                Ce mois
                            </option>
                        </select>

                        {/* SURVEYOR */}

                        <select
                            value={surveyorFilter}
                            onChange={(e) =>
                                setSurveyorFilter(e.target.value)
                            }
                            className="select-input"
                        >
                            <option value="all">
                                Tous les topographes
                            </option>

                            <option value="unassigned">
                                Non attribuées
                            </option>

                            {surveyors.map((surveyor) => (
                                <option
                                    key={surveyor}
                                    value={surveyor}
                                >
                                    {surveyor}
                                </option>
                            ))}
                        </select>

                        {/* INTEREST */}

                        <select
                            value={interestFilter}
                            onChange={(e) =>
                                setInterestFilter(e.target.value)
                            }
                            className="select-input"
                        >
                            <option value="all">
                                Tous les intérêts
                            </option>

                            <option value="Très intéressé">
                                Très intéressé
                            </option>

                            <option value="Intéressé">
                                Intéressé
                            </option>

                            <option value="Peu intéressé">
                                Peu intéressé
                            </option>

                            <option value="Pas intéressé">
                                Pas intéressé
                            </option>
                        </select>

                        {/* STATUS */}

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="select-input"
                        >
                            <option value="all">
                                Tous les rapports
                            </option>

                            <option value="Complété">
                                Complétés
                            </option>

                            <option value="À compléter">
                                À compléter
                            </option>
                        </select>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={resetFilters}
                            className="
                inline-flex items-center gap-2
                text-sm font-medium
                text-slate-500
                transition

                hover:text-slate-900

                dark:text-slate-400
                dark:hover:text-white
              "
                        >
                            <RotateCcw className="h-4 w-4" />

                            Réinitialiser
                        </button>
                    </div>
                </div>

                {selectedVisitIds.length > 0 && (
                    <div
                        className="
              mb-4 flex flex-col gap-4
              rounded-2xl border
              border-slate-200
              bg-white
              p-4
              shadow-lg

              dark:border-slate-800
              dark:bg-slate-900

              md:flex-row
              md:items-center
              md:justify-between
            "
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-full
                  bg-slate-900
                  text-white

                  dark:bg-white
                  dark:text-slate-900
                "
                            >
                                <Check className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="font-semibold">
                                    {selectedVisitIds.length} visite(s) sélectionnée(s)
                                </p>

                                <p
                                    className="
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                                >
                                    Attribuez les visites sélectionnées à un topographe.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() =>
                                    setSelectedVisitIds([])
                                }
                                className="
                  rounded-xl border
                  border-slate-200
                  px-4 py-2.5
                  text-sm font-medium
                  transition

                  hover:bg-slate-50

                  dark:border-slate-700
                  dark:text-slate-200
                  dark:hover:bg-slate-800
                "
                            >
                                Désélectionner
                            </button>

                            <button
                                onClick={() =>
                                    setIsAssignModalOpen(true)
                                }
                                className="
                  inline-flex items-center gap-2
                  rounded-xl
                  bg-slate-900
                  px-4 py-2.5
                  text-sm font-medium
                  text-white
                  transition

                  hover:bg-slate-800

                  dark:bg-white
                  dark:text-slate-900
                  dark:hover:bg-slate-200
                "
                            >
                                <UserPlus className="h-4 w-4" />

                                Attribuer à un topographe
                            </button>
                        </div>
                    </div>
                )}

                <div
                    className={`
            overflow-hidden
            rounded-2xl border
            border-slate-200
            bg-white
            shadow-sm
            transition-all
            duration-300

            dark:border-slate-800
            dark:bg-slate-900

            ${openedVisit
                            ? "xl:grid xl:grid-cols-[minmax(520px,42%)_minmax(0,58%)]"
                            : ""
                        }
          `}
                >
                    <div
                        className={`
              min-w-0
              transition-all
              duration-300

              ${openedVisit
                                ? "xl:border-r xl:border-slate-200 xl:dark:border-slate-800"
                                : ""
                            }
            `}
                    >
                        {/* LIST HEADER */}

                        <div
                            className="
                flex items-center justify-between
                border-b
                border-slate-200
                p-5

                dark:border-slate-800
              "
                        >
                            <div>
                                <h2 className="font-semibold">
                                    Liste des visites
                                </h2>

                                <p
                                    className="
                    mt-1 text-xs
                    text-slate-500
                    dark:text-slate-400
                  "
                                >
                                    {filteredVisits.length} résultat(s)
                                </p>
                            </div>

                            <Users
                                className="
                  h-5 w-5
                  text-slate-400
                "
                            />
                        </div>

                        {/* TABLE */}

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-225">
                                <thead>
                                    <tr
                                        className="
                      border-b
                      border-slate-200
                      bg-slate-50

                      dark:border-slate-800
                      dark:bg-slate-950/50
                    "
                                    >
                                        <th className="w-12 px-5 py-4 text-left">
                                            <input
                                                type="checkbox"
                                                checked={allFilteredSelected}
                                                ref={(input) => {
                                                    if (input) {
                                                        input.indeterminate =
                                                            someFilteredSelected &&
                                                            !allFilteredSelected;
                                                    }
                                                }}
                                                onChange={toggleSelectAll}
                                                className="
                          h-4 w-4
                          cursor-pointer
                          rounded
                          border-slate-300

                          dark:border-slate-600
                        "
                                            />
                                        </th>

                                        <TableHeader>Client</TableHeader>

                                        <TableHeader>Visite</TableHeader>

                                        <TableHeader>Commercial</TableHeader>

                                        <TableHeader>Topographe</TableHeader>

                                        <TableHeader>Intérêt</TableHeader>

                                        <TableHeader>Rapport</TableHeader>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredVisits.map((visit: Visit) => {
                                        const isOpened =
                                            visit.id === openedVisitId;

                                        const isSelected =
                                            selectedVisitIds.includes(visit.id);

                                        return (
                                            <tr
                                                key={visit.id}
                                                onClick={() =>
                                                    handleOpenVisit(visit)
                                                }
                                                className={`
                          cursor-pointer
                          border-b
                          border-slate-100
                          transition

                          dark:border-slate-800

                          ${isOpened
                                                        ? `
                                bg-slate-100
                                dark:bg-slate-800
                              `
                                                        : `
                                hover:bg-slate-50
                                dark:hover:bg-slate-800/60
                              `
                                                    }
                        `}
                                            >
                                                {/* CHECKBOX */}

                                                <td
                                                    className="px-5 py-4"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            toggleVisitSelection(
                                                                visit.id
                                                            )
                                                        }
                                                        className="
                              h-4 w-4
                              cursor-pointer
                              rounded
                              border-slate-300

                              dark:border-slate-600
                            "
                                                    />
                                                </td>

                                                {/* CLIENT */}

                                                <td className="px-5 py-4">
                                                    <div>
                                                        <p className="font-medium">
                                                            {visit?.prospects?.full_name}
                                                        </p>

                                                        <p
                                                            className="
                                mt-1 text-xs
                                text-slate-500
                                dark:text-slate-400
                              "
                                                        >
                                                            {visit?.prospects?.phone}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* DATE */}

                                                <td className="px-5 py-4">
                                                    <div
                                                        className="
                              flex items-center gap-2
                              text-sm
                            "
                                                    >
                                                        <CalendarDays
                                                            className="
                                h-4 w-4
                                text-slate-400
                              "
                                                        />

                                                        <div>
                                                            <p>
                                                                {
                                                                    visit.visit_date
                                                                }
                                                            </p>

                                                            <p
                                                                className="
                                  text-xs
                                  text-slate-500
                                  dark:text-slate-400
                                "
                                                            >
                                                                {visit.start_time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* COMMERCIAL */}

                                                <td className="px-5 py-4">
                                                    <span className="text-sm">
                                                        {visit?.profiles?.full_name}
                                                    </span>
                                                </td>

                                                {/* SURVEYOR */}

                                                <td className="px-5 py-4">
                                                    {visit.topographe ? (
                                                        <div
                                                            className="
                                inline-flex items-center gap-2
                                text-sm
                              "
                                                        >
                                                            <div
                                                                className="
                                  flex h-7 w-7 items-center justify-center
                                  rounded-full
                                  bg-slate-100
                                  text-xs font-semibold

                                  dark:bg-slate-800
                                "
                                                            >
                                                                {visit.topographe
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>

                                                            {visit.topographe}
                                                        </div>
                                                    ) : (
                                                        <span
                                                            className="
                                rounded-full
                                bg-orange-50
                                px-2.5 py-1
                                text-xs
                                text-orange-600

                                dark:bg-orange-950/40
                                dark:text-orange-400
                              "
                                                        >
                                                            assigné
                                                        </span>
                                                    )}
                                                </td>

                                                {/* INTEREST */}

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`
                              inline-flex
                              rounded-full border
                              px-2.5 py-1
                              text-xs font-medium
                              ${getInterestClass(
                                                            visit.interest_level
                                                        )}
                            `}
                                                    >
                                                        {visit.interest_level || '-'}
                                                    </span>
                                                </td>

                                                {/* REPORT */}

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`
                              inline-flex items-center gap-1.5
                              text-xs font-medium

                              ${visit.status ===
                                                                "completed"
                                                                ? `
                                    text-emerald-600
                                    dark:text-emerald-400
                                  `
                                                                : `
                                    text-orange-600
                                    dark:text-orange-400
                                  `
                                                            }
                            `}
                                                    >
                                                        {visit.status ===
                                                            "completed" ? (
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        ) : (
                                                            <FileText className="h-4 w-4" />
                                                        )}

                                                        {visit.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* EMPTY STATE */}

                            {filteredVisits.length === 0 && (
                                <div className="py-24 text-center">
                                    <FileText
                                        className="
                      mx-auto h-12 w-12
                      text-slate-300
                      dark:text-slate-700
                    "
                                    />

                                    <p className="mt-4 font-medium">
                                        Aucune visite confirmées
                                    </p>

                                    <p
                                        className="
                      mt-1 text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                                    >
                                        Essayez de modifier vos filtres.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {openedVisit && (
                        <div
                            className="
                min-w-0
                animate-in
                fade-in
                slide-in-from-right-4
                duration-300
                border-2 border-green-800
              "
                        >
                            {/* REPORT HEADER */}

                            <div
                                className="
                  flex flex-col gap-4
                  border-b
                  border-slate-200
                  p-5

                  dark:border-slate-800

                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
                            >
                                <div>
                                    <div
                                        className="
                      mb-2 flex items-center gap-2
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                                    >
                                        <span>Visites</span>

                                        <ChevronRight className="h-3.5 w-3.5" />

                                        <span>
                                            {openedVisit?.prospects?.full_name}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <h2
                                            className="
                        text-xl font-bold
                        text-slate-900
                        dark:text-white
                      "
                                        >
                                            Rapport de visite
                                        </h2>

                                        <span
                                            className="
                        rounded-md
                        bg-slate-100
                        px-2 py-1
                        text-xs
                        text-slate-600

                        dark:bg-slate-800
                        dark:text-slate-300
                      "
                                        >
                                            {openedVisit?.prospects?.full_name}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    {/* PRINT */}

                                    <button
                                        //onClick={handlePrintReport}
                                        className="
                      inline-flex items-center gap-2
                      rounded-xl border
                      border-slate-200
                      px-3 py-2.5
                      text-sm font-medium
                      transition

                      hover:bg-slate-50

                      dark:border-slate-700
                      dark:text-slate-200
                      dark:hover:bg-slate-800
                    "
                                    >
                                        <Printer className="h-4 w-4" />

                                        <span className="hidden sm:inline">
                                            Imprimer
                                        </span>
                                    </button>

                                    {/* EDIT */}

                                    {!isEditing && (
                                        <button
                                            onClick={handleStartEdit}
                                            className="
                        inline-flex items-center gap-2
                        rounded-xl
                        bg-slate-900
                        px-4 py-2.5
                        text-sm font-medium
                        text-white
                        transition

                        hover:bg-slate-800

                        dark:bg-white
                        dark:text-slate-900
                        dark:hover:bg-slate-200
                      "
                                        >
                                            <Edit3 className="h-4 w-4" />

                                            Modifier
                                        </button>
                                    )}

                                    {/* CLOSE */}

                                    <button
                                        onClick={handleCloseReport}
                                        className="
                      flex h-10 w-10 items-center justify-center
                      rounded-xl
                      text-slate-500
                      transition

                      hover:bg-slate-100
                      hover:text-slate-900

                      dark:text-slate-400
                      dark:hover:bg-slate-800
                      dark:hover:text-white
                    "
                                        title="Fermer le rapport"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* REPORT CONTENT */}

                            <div className="p-5 md:p-6">
                                {/* CLIENT INFO */}

                                <section>
                                    <div className="mb-4">
                                        <h3 className="font-semibold">
                                            Informations de la visite
                                        </h3>

                                        <p
                                            className="
                        mt-1 text-sm
                        text-slate-500
                        dark:text-slate-400
                      "
                                        >
                                            Informations générales du client et de la visite.
                                        </p>
                                    </div>

                                    <div
                                        className="
                      grid gap-3
                      sm:grid-cols-2
                    "
                                    >
                                        <InfoCard
                                            label="Client"
                                            value={openedVisit?.prospects?.full_name}
                                            icon={<User className="h-4 w-4" />}
                                        />

                                        <InfoCard
                                            label="Téléphone"
                                            value={openedVisit?.prospects?.phone}
                                            icon={<Phone className="h-4 w-4" />}
                                        />

                                        <InfoCard
                                            label="Date et heure"
                                            value={`${openedVisit.visit_date
                                                } à ${openedVisit.start_time}`}
                                            icon={
                                                <CalendarDays className="h-4 w-4" />
                                            }
                                        />

                                        <InfoCard
                                            label="Localisation prévue"
                                            value={openedVisit?.sites?.nom_titre}
                                            icon={<MapPin className="h-4 w-4" />}
                                        />

                                        <InfoCard
                                            label="Commercial"
                                            value={openedVisit?.profiles?.full_name}
                                            icon={<Users className="h-4 w-4" />}
                                        />

                                        <InfoCard
                                            label="Topographe"
                                            value={
                                                openedVisit.topographe ??
                                                "Non attribué"
                                            }
                                            icon={<User className="h-4 w-4" />}
                                        />
                                    </div>
                                </section>

                                <div
                                    className="
                    my-8 border-t
                    border-slate-200
                    dark:border-slate-800
                  "
                                />

                                {/* REPORT */}

                                <section>
                                    <div
                                        className="
                      mb-6 flex items-start justify-between gap-4
                    "
                                    >
                                        <div>
                                            <h3 className="font-semibold">
                                                Rapport du topographe
                                            </h3>

                                            <p
                                                className="
                          mt-1 text-sm
                          text-slate-500
                          dark:text-slate-400
                        "
                                            >
                                                {isEditing
                                                    ? "Vous êtes actuellement en mode modification."
                                                    : "Consultez les informations renseignées par le topographe."}
                                            </p>
                                        </div>

                                        {!isEditing && (
                                            <span
                                                className={`
                          shrink-0
                          rounded-full border
                          px-3 py-1.5
                          text-xs font-medium

                          ${openedVisit.status ===
                                                        "completed"
                                                        ? `
                                border-emerald-200
                                bg-emerald-50
                                text-emerald-700

                                dark:border-emerald-900/60
                                dark:bg-emerald-950/40
                                dark:text-emerald-400
                              `
                                                        : `
                                border-orange-200
                                bg-orange-50
                                text-orange-700

                                dark:border-orange-900/60
                                dark:bg-orange-950/40
                                dark:text-orange-400
                              `
                                                    }
                        `}
                                            >
                                                {openedVisit.status}
                                            </span>
                                        )}
                                    </div>

                                    <div
                                        className="
                      grid gap-5
                      md:grid-cols-2
                    "
                                    >
                                        {/* SITE */}

                                        <FormField label="Site">
                                            {isEditing ? (
                                                <input
                                                    value={draft?.sites.nom_titre}
                                                    onChange={(e) =>
                                                        setDraft((current) =>
                                                            current
                                                                ? {
                                                                    ...current,
                                                                    site: e.target.value,
                                                                }
                                                                : current
                                                        )
                                                    }
                                                    placeholder="Nom ou emplacement du site"
                                                    className="form-input"
                                                />
                                            ) : (
                                                <ReadValue
                                                    value={
                                                        openedVisit.sites.nom_titre ||
                                                        "Non renseigné"
                                                    }
                                                />
                                            )}
                                        </FormField>

                                        {/* AREA */}

                                        <FormField label="Superficie intéressée">
                                            {isEditing ? (
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={
                                                            draft?.interested_area ?? ""
                                                        }
                                                        onChange={(e) =>
                                                            setDraft((current) =>
                                                                current
                                                                    ? {
                                                                        ...current,
                                                                        interested_area:
                                                                            e.target.value === ""
                                                                                ? ""
                                                                                : (
                                                                                    e.target.value
                                                                                ),
                                                                    }
                                                                    : current
                                                            )
                                                        }
                                                        placeholder="Ex: 500"
                                                        className="form-input pr-12"
                                                    />

                                                    <span
                                                        className="
                              pointer-events-none
                              absolute right-4 top-1/2
                              -translate-y-1/2
                              text-sm
                              text-slate-500
                              dark:text-slate-400
                            "
                                                    >
                                                        m²
                                                    </span>
                                                </div>
                                            ) : (
                                                <ReadValue
                                                    value={
                                                        openedVisit.interested_area
                                                            ? `${openedVisit.interested_area} m²`
                                                            : "Non renseignée"
                                                    }
                                                />
                                            )}
                                        </FormField>

                                        {/* INTEREST */}

                                        <FormField label="Niveau d'intérêt">
                                            {isEditing ? (
                                                <select
                                                    value={
                                                        draft?.interest_level ??
                                                        "Intéressé"
                                                    }
                                                    onChange={(e) =>
                                                        setDraft((current) =>
                                                            current
                                                                ? {
                                                                    ...current,
                                                                    interest_level:
                                                                        e.target
                                                                            .value as InterestLevel,
                                                                }
                                                                : current
                                                        )
                                                    }
                                                    className="form-input"
                                                >
                                                    <option value="Très intéressé">
                                                        Très intéressé
                                                    </option>

                                                    <option value="Intéressé">
                                                        Intéressé
                                                    </option>

                                                    <option value="Peu intéressé">
                                                        Peu intéressé
                                                    </option>

                                                    <option value="Pas intéressé">
                                                        Pas intéressé
                                                    </option>
                                                </select>
                                            ) : (
                                                <div className="flex min-h-11 items-center">
                                                    <span
                                                        className={`
                              inline-flex
                              rounded-full border
                              px-3 py-1.5
                              text-sm font-medium
                              ${getInterestClass(
                                                            openedVisit.interest_level
                                                        )}
                            `}
                                                    >
                                                        {openedVisit.interest_level}
                                                    </span>
                                                </div>
                                            )}
                                        </FormField>

                                        {/* PRICE */}

                                        <FormField label="Prix souhaité">
                                            {isEditing ? (
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={
                                                            draft?.desired_price ?? ""
                                                        }
                                                        onChange={(e) =>
                                                            setDraft((current) =>
                                                                current
                                                                    ? {
                                                                        ...current,
                                                                        desired_price:
                                                                            e.target.value === ""
                                                                                ? ""
                                                                                : (
                                                                                    e.target.value
                                                                                ),
                                                                    }
                                                                    : current
                                                            )
                                                        }
                                                        placeholder="Ex: 25000000"
                                                        className="form-input pr-16"
                                                    />

                                                    <span
                                                        className="
                              pointer-events-none
                              absolute right-4 top-1/2
                              -translate-y-1/2
                              text-sm
                              text-slate-500
                              dark:text-slate-400
                            "
                                                    >
                                                        FCFA
                                                    </span>
                                                </div>
                                            ) : (
                                                <ReadValue
                                                    value={formatCurrency(
                                                        Number(openedVisit.desired_price)
                                                    )}
                                                />
                                            )}
                                        </FormField>

                                        {/* OBSERVATION */}

                                        <div className="md:col-span-2">
                                            <FormField label="Observations">
                                                {isEditing ? (
                                                    <textarea
                                                        rows={7}
                                                        value={
                                                            draft?.observation ?? ""
                                                        }
                                                        onChange={(e) =>
                                                            setDraft((current) =>
                                                                current
                                                                    ? {
                                                                        ...current,
                                                                        observation:
                                                                            e.target.value,
                                                                    }
                                                                    : current
                                                            )
                                                        }
                                                        placeholder="Ajoutez vos observations..."
                                                        className="
                              min-h-40
                              w-full
                              resize-none
                              rounded-xl border
                              border-slate-200
                              bg-white
                              px-4 py-3
                              text-sm
                              outline-none
                              transition

                              placeholder:text-slate-400

                              focus:border-slate-400

                              dark:border-slate-700
                              dark:bg-slate-950
                              dark:text-white
                              dark:placeholder:text-slate-600
                            "
                                                    />
                                                ) : (
                                                    <div
                                                        className="
                              min-h-40
                              rounded-xl border
                              border-slate-200
                              bg-slate-50
                              p-4
                              text-sm leading-7
                              text-slate-600

                              dark:border-slate-800
                              dark:bg-slate-950/50
                              dark:text-slate-300
                            "
                                                    >
                                                        {openedVisit.observation ||
                                                            "Aucune observation renseignée."}
                                                    </div>
                                                )}
                                            </FormField>
                                        </div>
                                    </div>

                                    {/* EDIT ACTIONS */}

                                    {isEditing && (
                                        <div
                                            className="
                        mt-8 flex flex-col-reverse gap-3
                        border-t
                        border-slate-200
                        pt-6

                        dark:border-slate-800

                        sm:flex-row
                        sm:justify-end
                      "
                                        >
                                            <button
                                                onClick={handleCancelEdit}
                                                className="
                          rounded-xl border
                          border-slate-200
                          px-5 py-2.5
                          text-sm font-medium
                          transition

                          hover:bg-slate-50

                          dark:border-slate-700
                          dark:text-slate-200
                          dark:hover:bg-slate-800
                        "
                                            >
                                                Annuler
                                            </button>

                                            <button
                                                onClick={handleSaveReport}
                                                disabled={isSavingReport}
                                                className="
        inline-flex items-center justify-center gap-2
        rounded-xl
        bg-slate-900
        px-5 py-2.5
        text-sm font-medium
        text-white
        transition
        hover:bg-slate-800
        disabled:cursor-not-allowed
        disabled:opacity-50
        dark:bg-white
        dark:text-slate-900
        dark:hover:bg-slate-200
    "
                                            >
                                                <Save className="h-4 w-4" />

                                                {isSavingReport
                                                    ? "Enregistrement..."
                                                    : "Enregistrer"}
                                            </button>
                                        </div>
                                    )}
                                </section>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* =============================================
          ASSIGN SURVEYOR MODAL
      ============================================== */}

            {isAssignModalOpen && (
                <div
                    className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-slate-950/50
            p-4
            backdrop-blur-sm
          "
                >
                    <div
                        className="
              w-full max-w-2xl
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-2xl

              dark:border-slate-800
              dark:bg-slate-900
            "
                    >
                        {/* MODAL HEADER */}

                        <div
                            className="
                flex items-center justify-between
                border-b
                border-slate-200
                p-5

                dark:border-slate-800
              "
                        >
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Attribuer les visites
                                </h2>

                                <p
                                    className="
                    mt-1 text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                                >
                                    {selectedVisitIds.length} visite(s) seront attribuées.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setIsAssignModalOpen(false)
                                }
                                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl
                  text-slate-500
                  transition

                  hover:bg-slate-100

                  dark:text-slate-400
                  dark:hover:bg-slate-800
                "
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* MODAL BODY */}

                        <div className="space-y-6 p-5">
                            {/* SURVEYOR SELECT */}

                            <div>
                                <label
                                    className="
                    mb-2 block
                    text-sm font-medium
                  "
                                >
                                    Choisir un topographe
                                </label>

                                <div className="relative">
                                    <select
                                        value={selectedSurveyor}
                                        onChange={(e) =>
                                            setSelectedSurveyor(
                                                e.target.value
                                            )
                                        }
                                        className="form-input appearance-none"
                                    >
                                        <option value="">
                                            Sélectionner un topographe
                                        </option>

                                        {topoData.map((surveyor) => (
                                            <option
                                                key={surveyor.id}
                                                value={surveyor.full_name}
                                            >
                                                {surveyor.full_name}
                                            </option>
                                        ))}
                                    </select>

                                    <ChevronDown
                                        className="
                      pointer-events-none
                      absolute right-4 top-1/2
                      h-4 w-4
                      -translate-y-1/2
                      text-slate-400
                    "
                                    />
                                </div>
                            </div>

                            {/* SELECTED VISITS */}

                            <div>
                                <p
                                    className="
                    mb-3 text-sm font-medium
                  "
                                >
                                    Visites sélectionnées
                                </p>

                                <div
                                    className="
                    max-h-75
                    space-y-2
                    overflow-y-auto
                    rounded-xl
                    border
                    border-slate-200
                    p-2

                    dark:border-slate-800
                  "
                                >
                                    {visitData
                                        .filter((visit: Visit) =>
                                            selectedVisitIds.includes(
                                                visit.id
                                            )
                                        )
                                        .map((visit: Visit) => (
                                            <div
                                                key={visit.id}
                                                className="
                          flex items-center justify-between
                          gap-4
                          rounded-lg
                          bg-slate-50
                          p-3

                          dark:bg-slate-950/50
                        "
                                            >
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {visit?.prospects?.full_name}
                                                    </p>

                                                    <p
                                                        className="
                              mt-1 text-xs
                              text-slate-500
                              dark:text-slate-400
                            "
                                                    >
                                                        {visit?.prospects?.phone} •{" "}
                                                        {
                                                            visit.visit_date
                                                        }
                                                    </p>
                                                </div>

                                                <MapPin
                                                    className="
                            h-4 w-4 shrink-0
                            text-slate-400
                          "
                                                />
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* MODAL FOOTER */}

                        <div
                            className="
                flex flex-col-reverse gap-3
                border-t
                border-slate-200
                p-5

                dark:border-slate-800

                sm:flex-row
                sm:justify-end
              "
                        >
                            <button
                                onClick={() =>
                                    setIsAssignModalOpen(false)
                                }
                                className="
                  rounded-xl border
                  border-slate-200
                  px-5 py-2.5
                  text-sm font-medium

                  dark:border-slate-700
                  dark:text-slate-200
                "
                            >
                                Annuler
                            </button>

                            <button
                                onClick={handleAssignSurveyor}
                                disabled={!selectedSurveyor || isPending}
                                className="
        inline-flex items-center justify-center gap-2
        rounded-xl
        bg-slate-900
        px-5 py-2.5
        text-sm font-medium
        text-white
        transition
        hover:bg-slate-800
        disabled:cursor-not-allowed
        disabled:opacity-40
        dark:bg-white
        dark:text-slate-900
        dark:hover:bg-slate-200
    "
                            >
                                <UserPlus className="h-4 w-4" />

                                {isPending
                                    ? "Attribution en cours..."
                                    : "Confirmer l'attribution"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


function StatCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: number;
    icon: ReactNode;
}) {
    return (
        <div
            className="
        rounded-2xl border
        border-slate-200
        bg-white
        p-5
        shadow-sm

        dark:border-slate-800
        dark:bg-slate-900
      "
        >
            <div className="flex items-center justify-between">
                <div>
                    <p
                        className="
              text-sm
              text-slate-500
              dark:text-slate-400
            "
                    >
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        {value}
                    </p>
                </div>

                <div
                    className="
            rounded-xl
            bg-slate-100
            p-3
            text-slate-700

            dark:bg-slate-800
            dark:text-slate-300
          "
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}

function TableHeader({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <th
            className="
        whitespace-nowrap
        px-5 py-4
        text-left
        text-xs font-semibold
        uppercase tracking-wide
        text-slate-500

        dark:text-slate-400
      "
        >
            {children}
        </th>
    );
}

function InfoCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon?: ReactNode;
}) {
    return (
        <div
            className="
        rounded-xl border
        border-slate-200
        bg-slate-50
        p-4

        dark:border-slate-800
        dark:bg-slate-950/50
      "
        >
            <p
                className="
          mb-2 text-xs font-medium
          uppercase tracking-wide
          text-slate-500
          dark:text-slate-400
        "
            >
                {label}
            </p>

            <div className="flex items-center gap-2">
                {icon && (
                    <span
                        className="
              text-slate-400
              dark:text-slate-500
            "
                    >
                        {icon}
                    </span>
                )}

                <span className="text-sm font-medium">
                    {value}
                </span>
            </div>
        </div>
    );
}

function FormField({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div>
            <label
                className="
          mb-2 block
          text-sm font-medium
          text-slate-700
          dark:text-slate-300
        "
            >
                {label}
            </label>

            {children}
        </div>
    );
}

