'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    MapPin,
    PenTool,
    Loader2
} from 'lucide-react';

// Types
type Status = 'En attente' | 'En cours' | 'Terminé' | 'En retard';

type Prospect = {
    id: string;
    nom: string;
    email: string;
    telephone: string;
    bornage_planned: Date | null;
    bornage_actual: Date | null;
    bornage_status: Status | null;
    dt_planned: Date | null;
    dt_actual: Date | null;
    dt_status: Status | null;
    pv_planned: Date | null;
    pv_actual: Date | null;
    pv_status: Status | null;
};

// Données fictives pour le développement
const MOCK_PROSPECTS: Prospect[] = [
    {
        id: '1',
        nom: 'Dupont SARL',
        email: 'contact@dupont-sarl.fr',
        telephone: '01 23 45 67 89',
        bornage_planned: new Date(2026, 7, 15),
        bornage_actual: new Date(2026, 7, 14),
        bornage_status: 'Terminé',
        dt_planned: new Date(2026, 8, 10),
        dt_actual: null,
        dt_status: 'En attente',
        pv_planned: new Date(2026, 9, 5),
        pv_actual: null,
        pv_status: 'En attente',
    },
    {
        id: '2',
        nom: 'Martin et Fils',
        email: 'martin@martin-fils.com',
        telephone: '05 55 55 55 55',
        bornage_planned: new Date(2026, 7, 20),
        bornage_actual: null,
        bornage_status: 'En retard',
        dt_planned: new Date(2026, 8, 1),
        dt_actual: null,
        dt_status: 'En attente',
        pv_planned: new Date(2026, 8, 20),
        pv_actual: null,
        pv_status: 'En attente',
    },
    {
        id: '3',
        nom: 'Green Energy',
        email: 'info@green-energy.eu',
        telephone: '04 44 44 44 44',
        bornage_planned: new Date(2026, 7, 10),
        bornage_actual: new Date(2026, 7, 9),
        bornage_status: 'Terminé',
        dt_planned: new Date(2026, 7, 25),
        dt_actual: new Date(2026, 7, 24),
        dt_status: 'Terminé',
        pv_planned: new Date(2026, 8, 15),
        pv_actual: new Date(2026, 8, 14),
        pv_status: 'Terminé',
    },
    {
        id: '4',
        nom: 'Bâtiment Moderne',
        email: 'contact@batiment-moderne.fr',
        telephone: '03 33 33 33 33',
        bornage_planned: new Date(2026, 8, 5),
        bornage_actual: null,
        bornage_status: 'En cours',
        dt_planned: new Date(2026, 8, 20),
        dt_actual: null,
        dt_status: 'En attente',
        pv_planned: new Date(2026, 9, 10),
        pv_actual: null,
        pv_status: 'En attente',
    },
];

// Composant pour le badge avec icône
const StatusBadge = ({ status }: { status: Status | null }) => {
    if (!status) return <Badge variant="outline">Non défini</Badge>;

    const variants: Record<Status, 'default' | 'secondary' | 'destructive' | 'success'> = {
        'En attente': 'secondary',
        'En cours': 'default',
        'Terminé': 'success',
        'En retard': 'destructive',
    };

    const icons = {
        'En attente': <Clock className="mr-1 h-3 w-3" />,
        'En cours': <Loader2 className="mr-1 h-3 w-3 animate-spin" />,
        'Terminé': <CheckCircle2 className="mr-1 h-3 w-3" />,
        'En retard': <AlertCircle className="mr-1 h-3 w-3" />,
    };

    return (
        <Badge className="flex items-center">
            {icons[status]}
            {status}
        </Badge>
    );
};

// Message de suivi
const SuiviMessage = ({ planned, actual, status, docName, icon }: any) => {
    let message = '';
    let color = 'text-muted-foreground';

    if (actual) {
        message = `✅ ${docName} effectué le ${format(actual, 'dd/MM/yyyy', { locale: fr })}`;
        color = 'text-green-600 dark:text-green-400';
    } else if (status === 'En retard') {
        message = `⚠️ ${docName} en retard (prévu le ${format(planned, 'dd/MM/yyyy', { locale: fr })})`;
        color = 'text-red-600 dark:text-red-400';
    } else if (planned) {
        message = `📅 ${docName} prévu le ${format(planned, 'dd/MM/yyyy', { locale: fr })}`;
    } else {
        message = `❌ ${docName} non planifié`;
    }

    return (
        <div className={`flex items-center text-sm ${color}`}>
            {icon}
            <span className="ml-1.5">{message}</span>
        </div>
    );
};

export default function DashboardPage() {
    const [prospects, setProspects] = useState<Prospect[]>([]);
    const [loading, setLoading] = useState(true);

    // Simulation de chargement et de mise à jour
    useEffect(() => {
        // Simuler un appel API
        const timer = setTimeout(() => {
            setProspects(MOCK_PROSPECTS);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            {/* En-tête */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Suivi des documents clients</h1>
                <p className="text-muted-foreground">
                    Tableau de bord en temps réel pour les topographes – mises à jour automatiques
                </p>
            </div>

            {/* Carte résumé (statistiques rapides) */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total clients</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{prospects.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Documents en retard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">
                            {prospects.filter(p =>
                                p.bornage_status === 'En retard' ||
                                p.dt_status === 'En retard' ||
                                p.pv_status === 'En retard'
                            ).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Dossiers complets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {prospects.filter(p =>
                                p.bornage_status === 'Terminé' &&
                                p.dt_status === 'Terminé' &&
                                p.pv_status === 'Terminé'
                            ).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tableau principal */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[180px]">Client</TableHead>
                                    <TableHead className="min-w-[200px]">Bornage</TableHead>
                                    <TableHead className="min-w-[200px]">Dossier Technique</TableHead>
                                    <TableHead className="min-w-[200px]">PV Signature</TableHead>
                                    <TableHead className="min-w-[280px]">Suivi détaillé</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {prospects.map((p) => (
                                    <TableRow key={p.id} className="hover:bg-muted/50">
                                        <TableCell>
                                            <div className="font-medium">{p.nom}</div>
                                            <div className="text-sm text-muted-foreground">{p.email}</div>
                                            <div className="text-sm text-muted-foreground">{p.telephone}</div>
                                        </TableCell>

                                        {/* Bornage */}
                                        <TableCell>
                                            <div className="space-y-2">
                                                <div className="flex flex-col text-sm">
                                                    <span className="text-muted-foreground">Planifié :</span>
                                                    <span>{p.bornage_planned ? format(p.bornage_planned, 'dd/MM/yyyy', { locale: fr }) : '—'}</span>
                                                </div>
                                                <div className="flex flex-col text-sm">
                                                    <span className="text-muted-foreground">Réalisé :</span>
                                                    <span>{p.bornage_actual ? format(p.bornage_actual, 'dd/MM/yyyy', { locale: fr }) : '—'}</span>
                                                </div>
                                                <StatusBadge status={p.bornage_status} />
                                            </div>
                                        </TableCell>

                                        {/* DT */}
                                        <TableCell>
                                            <div className="space-y-2">
                                                <div className="flex flex-col text-sm">
                                                    <span className="text-muted-foreground">Planifié :</span>
                                                    <span>{p.dt_planned ? format(p.dt_planned, 'dd/MM/yyyy', { locale: fr }) : '—'}</span>
                                                </div>
                                                <div className="flex flex-col text-sm">
                                                    <span className="text-muted-foreground">Réalisé :</span>
                                                    <span>{p.dt_actual ? format(p.dt_actual, 'dd/MM/yyyy', { locale: fr }) : '—'}</span>
                                                </div>
                                                <StatusBadge status={p.dt_status} />
                                            </div>
                                        </TableCell>

                                        {/* PV */}
                                        <TableCell>
                                            <div className="space-y-2">
                                                <div className="flex flex-col text-sm">
                                                    <span className="text-muted-foreground">Planifié :</span>
                                                    <span>{p.pv_planned ? format(p.pv_planned, 'dd/MM/yyyy', { locale: fr }) : '—'}</span>
                                                </div>
                                                <div className="flex flex-col text-sm">
                                                    <span className="text-muted-foreground">Réalisé :</span>
                                                    <span>{p.pv_actual ? format(p.pv_actual, 'dd/MM/yyyy', { locale: fr }) : '—'}</span>
                                                </div>
                                                <StatusBadge status={p.pv_status} />
                                            </div>
                                        </TableCell>

                                        {/* Suivi détaillé */}
                                        <TableCell>
                                            <div className="space-y-2">
                                                <SuiviMessage
                                                    planned={p.bornage_planned}
                                                    actual={p.bornage_actual}
                                                    status={p.bornage_status}
                                                    docName="Bornage"
                                                    icon={<MapPin className="h-4 w-4" />}
                                                />
                                                <SuiviMessage
                                                    planned={p.dt_planned}
                                                    actual={p.dt_actual}
                                                    status={p.dt_status}
                                                    docName="DT"
                                                    icon={<FileText className="h-4 w-4" />}
                                                />
                                                <SuiviMessage
                                                    planned={p.pv_planned}
                                                    actual={p.pv_actual}
                                                    status={p.pv_status}
                                                    docName="PV"
                                                    icon={<PenTool className="h-4 w-4" />}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}