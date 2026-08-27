import { Badge } from "../ui/badge";


export function getStatusBadge(status: string) {
    const statusMap: Record<string, React.ReactNode> = {
        Disponible: (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Disponible
            </Badge>
        ),
        Indisponible: (
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                Indisponible
            </Badge>
        ),
        "En cours d’acquisition": (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                En cours d’acquisition
            </Badge>
        ),
        "En vérification": (
            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                En vérification
            </Badge>
        ),
        Réservé: (
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                Réservé
            </Badge>
        ),
        Vendu: (
            <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                Vendu
            </Badge>
        ),
        Suspendu: (
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                Suspendu
            </Badge>
        ),
        Rejeté: (
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                Rejeté
            </Badge>
        ),
    };

    return statusMap[status] ?? <Badge variant="outline">{status}</Badge>;
}


export function getReliabilityBadge(value: number) {
    if (value >= 80) {
        return (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Fiable
            </Badge>
        );
    }

    if (value >= 60) {
        return (
            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                À surveiller
            </Badge>
        );
    }

    return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Risqué
        </Badge>
    );
}