"use client";

import {
    BadgeCheck,
    Bell,
    BriefcaseBusiness,
    Building2,
    CalendarClock,
    CheckCircle2,
    Clock,
    Edit,
    Eye,
    Globe2,
    IdCard,
    KeyRound,
    Laptop,
    Mail,
    MapPin,
    Moon,
    Phone,
    ShieldCheck,
    Sun,
    User,
    Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/ThemeToggles";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { ProfileLoader } from "@/components/Profile";
import { useUserScopeById } from "@/core/hooks/admin/useUsers";
import { useRoleById } from "@/core/hooks/roles/useRole";
import { RolePermission } from "@/core/types/roles/type";
import { getInitials } from "@/components/dialog/UseProfileDropdown";

const currentUser = {
    id: "USR-001",
    fullName: "Michel Dylane",
    email: "michel.dylane@heritage.cm",
    phone: "+237 6 55 88 96 77",
    avatarUrl: "",
    jobTitle: "Responsable système d’information",
    employeeCode: "HER-EMP-001",
    status: "Actif",
    language: "Français",
    timezone: "Africa/Douala",
    lastLogin: "Aujourd’hui à 09:42",
    createdAt: "02 avril 2026",
};

const currentCompany =
{
    id: "COMP-002",
    name: "Heritage SARL",
    legalName: "Heritage SARL",
    type: "SARL",
    email: "hello@heritage-contact.cm",
    phone: "+237 6 80 00 00 00",
    address: "Douala, Cameroun",
    country: "Cameroun",
    city: "Douala",
    currency: "FCFA",
    logoUrl: "",
    status: "Active",
}


const currentTeam = {
    id: "TEAM-001",
    name: "Direction des Systèmes d’Information",
    department: "Système d’information",
    manager: "Mempouza Moaboulou Michel",
    hrManager: "Responsable RH",
    membersCount: 6,
    workMode: "Hybride",
    workingHours: "08:00 - 17:30",
};

const currentRole = {
    id: "ROLE-001",
    name: "SUPER_ADMIN",
    label: "Super Administrateur",
    accessScope: "Global",
    permissions: [
        "Gestion utilisateurs",
        "Gestion rôles & permissions",
        "Accès aux paramètres",
        "Publication des sites",
        "Gestion des entreprises",
        "Lecture des rapports",
    ],
};

const preferences = {
    notifications: true,
    emailNotifications: true,
    weeklyReport: true,
};

const systemInfo = [
    {
        label: "Entreprise actuelle",
        value: currentCompany.name,
    },
    {
        label: "Équipe RH liée",
        value: currentTeam.name,
    },
    {
        label: "Rôle système",
        value: currentRole.label,
    },
    {
        label: "Périmètre d’accès",
        value: currentRole.accessScope,
    },
    {
        label: "Devise par défaut",
        value: currentCompany.currency,
    },
    {
        label: "Fuseau horaire",
        value: currentUser.timezone,
    },
];

function getStatusBadge(status: string) {
    if (status === "Actif" || status === "Active") {
        return (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300">
                {status}
            </Badge>
        );
    }

    return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300">
            {status}
        </Badge>
    );
}

export default function GeneralSettingsPage() {
    const { profile, loading } = useAuth();

    const { data: user, isLoading } = useUserScopeById(profile?.id);
    const { data: roles } = useRoleById(user?.roles?.id);
    const [showAllPermissions, setShowAllPermissions] = useState(false);

    const displayedPermissions = showAllPermissions
        ? roles
        : roles?.slice(0, 10);

    if (loading) {
        return <ProfileLoader />;
    }

    if (!profile) {
        return null;
    }

    if (isLoading) {
        return <ProfileLoader />;
    }



    const initials = currentUser.fullName
        .split(" ")
        .map((name) => name[0])
        .join("");

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                    <Badge variant="outline" className="rounded-full">
                        Paramètres généraux
                    </Badge>

                    <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                        Informations générales
                    </h1>

                    <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                        Consultez les informations de votre profil, votre entreprise, votre
                        équipe RH, votre rôle et vos préférences d’utilisation dans le CRM
                        Heritage.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <ThemeToggle />

                    <Button variant="outline">
                        <Link href="/dashboard/settings/security">
                            <KeyRound className="mr-2 h-4 w-4" />
                            Sécurité
                        </Link>
                    </Button>

                    <Button>
                        <Link href="/dashboard/settings/profile/edit">
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier mon profil
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Important note 
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40">
                <CardContent className="flex gap-3 p-5">
                    <Users className="mt-0.5 h-5 w-5 text-blue-700 dark:text-blue-300" />

                    <div>
                        <h3 className="font-semibold text-blue-950 dark:text-blue-100">
                            Données synchronisées avec le module RH / Teams
                        </h3>
                        <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
                            Les informations liées à l’équipe, au poste, au manager, au statut
                            employé et au rattachement entreprise doivent venir du module
                            Teams géré par les RH. L’utilisateur peut modifier ses informations
                            personnelles, mais pas son rôle, son équipe ou son entreprise.
                        </p>
                    </div>
                </CardContent>
            </Card>*/}

            {/* Main grid */}
            <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
                <div className="space-y-6">
                    {/* User profile */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Profil utilisateur</CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Informations personnelles et professionnelles de l’utilisateur
                                    connecté.
                                </p>
                            </div>

                            {getStatusBadge(user?.profiles?.status)}
                        </CardHeader>

                        <CardContent>
                            <div className="flex flex-col gap-6 md:flex-row md:items-start">
                                <Avatar className="h-24 w-24 rounded-2xl">
                                    <AvatarImage
                                        src={user?.profiles?.avatarUrl}
                                        alt={user?.profile?.full_name ?? "Utilisateur"}
                                    />
                                    <AvatarFallback className="rounded-2xl text-xl font-bold">
                                        {getInitials(user?.profiles?.full_name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 space-y-5">
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            {user?.profiles?.full_name}
                                        </h2>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {user?.roles?.name}
                                        </p>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <InfoItem
                                            icon={Mail}
                                            label="Email professionnel"
                                            value={user?.profiles?.professional_email}
                                        />

                                        <InfoItem
                                            icon={Phone}
                                            label="Téléphone"
                                            value={user?.profiles?.phone}
                                        />

                                        <InfoItem
                                            icon={IdCard}
                                            label="Matricule employé"
                                            value={currentUser.employeeCode}
                                        />

                                        <InfoItem
                                            icon={Clock}
                                            label="Dernière connexion"
                                            value={user?.profiles?.last_login_at}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Company */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Entreprise rattachée</CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Entreprise dans laquelle l’utilisateur travaille actuellement.
                                </p>
                            </div>

                            {getStatusBadge(currentCompany.status)}
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                                    <Building2 className="h-8 w-8 text-muted-foreground" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold">{currentCompany.name}</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {currentCompany.legalName}
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <Badge variant="secondary">{currentCompany.type}</Badge>
                                        <Badge variant="outline">{currentCompany.country}</Badge>
                                        <Badge variant="outline">{currentCompany.currency}</Badge>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid gap-4 md:grid-cols-2">
                                <InfoItem
                                    icon={Mail}
                                    label="Email entreprise"
                                    value={currentCompany.email}
                                />

                                <InfoItem
                                    icon={Phone}
                                    label="Téléphone entreprise"
                                    value={currentCompany.phone}
                                />

                                <InfoItem
                                    icon={MapPin}
                                    label="Adresse"
                                    value={currentCompany.address}
                                />

                                <InfoItem
                                    icon={Globe2}
                                    label="Ville / Pays"
                                    value={`${currentCompany.city}, ${currentCompany.country}`}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Team */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Équipe / Département SI</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Ces informations sont administrées par les RH.</p>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div className="grid gap-4 md:grid-cols-3">
                                <SummaryBox
                                    icon={Users}
                                    label="Équipe"
                                    value={currentTeam.name}
                                />

                                <SummaryBox
                                    icon={BriefcaseBusiness}
                                    label="Département"
                                    value={currentTeam.department}
                                />

                                <SummaryBox
                                    icon={BadgeCheck}
                                    label="Membres"
                                    value={`${currentTeam.membersCount} membres`}
                                />
                            </div>

                            <Separator />

                            <div className="grid gap-4 md:grid-cols-2">
                                <InfoItem
                                    icon={User}
                                    label="Manager direct"
                                    value={currentTeam.manager}
                                />

                                <InfoItem
                                    icon={ShieldCheck}
                                    label="Référent RH"
                                    value={currentTeam.hrManager}
                                />

                                <InfoItem
                                    icon={Globe2}
                                    label="Mode de travail"
                                    value={currentTeam.workMode}
                                />

                                <InfoItem
                                    icon={CalendarClock}
                                    label="Horaires de travail"
                                    value={currentTeam.workingHours}
                                />
                            </div>


                        </CardContent>
                    </Card>

                    {/* Role and permissions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Rôle et permissions</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Informations liées au contrôle d’accès du CRM.
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div className="grid gap-4 md:grid-cols-3">
                                <SummaryBox
                                    icon={ShieldCheck}
                                    label="Rôle"
                                    value={currentRole.label}
                                />

                                <SummaryBox
                                    icon={Globe2}
                                    label="Périmètre"
                                    value={currentRole.accessScope}
                                />

                                <SummaryBox
                                    icon={KeyRound}
                                    label="Permissions"
                                    value={`${roles?.length} accès`}
                                />
                            </div>

                            <Separator />

                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="font-semibold">
                                        Permissions principales
                                    </h3>

                                    {roles && roles.length > 10 && (
                                        <span className="text-xs text-muted-foreground">
                                            {roles.length} permissions
                                        </span>
                                    )}
                                </div>

                                <div className="grid gap-3 md:grid-cols-2">
                                    {displayedPermissions?.map(
                                        (permission: RolePermission) => (
                                            <div
                                                key={permission.id}
                                                className="flex items-center gap-3 rounded-xl border p-3"
                                            >
                                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />

                                                <span className="text-sm">
                                                    {permission.permissions.label}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>

                                {roles && roles.length > 10 && (
                                    <div className="mt-4 flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowAllPermissions((prev) => !prev)
                                            }
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            {showAllPermissions
                                                ? "Voir moins"
                                                : `Voir plus (${roles.length - 10})`}
                                        </button>
                                    </div>
                                )}
                            </div>


                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                    {/* Theme preferences */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Apparence</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <ThemeOption
                                icon={Sun}
                                title="Mode clair"
                                description="Interface claire pour un environnement lumineux."
                                themeValue="light"
                            />

                            <ThemeOption
                                icon={Moon}
                                title="Mode sombre"
                                description="Interface sombre pour réduire la fatigue visuelle."
                                themeValue="dark"
                            />

                            <ThemeOption
                                icon={Laptop}
                                title="Système"
                                description="Suit automatiquement le thème de l’appareil."
                                themeValue="system"
                            />
                            <ThemeToggle />
                        </CardContent>
                    </Card>

                    {/* System summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Résumé système</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {systemInfo.map((item) => (
                                <InfoRow
                                    key={item.label}
                                    label={item.label}
                                    value={item.value}
                                />
                            ))}
                        </CardContent>
                    </Card>

                    {/* Preferences */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Préférences</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <PreferenceItem
                                icon={Bell}
                                label="Notifications CRM"
                                description="Recevoir les alertes internes."
                                checked={preferences.notifications}
                            />

                            <PreferenceItem
                                icon={Mail}
                                label="Notifications email"
                                description="Recevoir les notifications par email."
                                checked={preferences.emailNotifications}
                            />

                            <PreferenceItem
                                icon={Globe2}
                                label="Rapport hebdomadaire"
                                description="Recevoir un résumé chaque semaine."
                                checked={preferences.weeklyReport}
                            />
                        </CardContent>
                    </Card>

                    {/* Account */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Compte</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start">
                                <Link href="/dashboard/settings/profile/edit">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Modifier mon profil
                                </Link>
                            </Button>

                            <Button variant="outline" className="w-full justify-start">
                                <Link href="/dashboard/settings/security">
                                    <KeyRound className="mr-2 h-4 w-4" />
                                    Mot de passe & sécurité
                                </Link>
                            </Button>

                            <Button variant="outline" className="w-full justify-start">
                                <Link href="/dashboard/settings/notifications">
                                    <Bell className="mr-2 h-4 w-4" />
                                    Notifications
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Data ownership */}

                </aside>
            </div>
        </div>
    );
}



function ThemeOption({
    icon: Icon,
    title,
    description,
    themeValue,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    themeValue: "light" | "dark" | "system";
}) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isActive = mounted && theme === themeValue;

    return (
        <button
            type="button"
            onClick={() => setTheme(themeValue)}
            className={[
                "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition",
                "hover:bg-muted/60",
                isActive
                    ? "border-primary bg-primary/10 text-foreground"
                    : "bg-background",
            ].join(" ")}
        >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <Icon className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{title}</p>

                    {isActive && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                </div>

                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            </div>
        </button>
    );
}

function InfoItem({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
}) {
    return (
        <div className="flex gap-3 rounded-2xl border bg-background p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <Icon className="h-5 w-5 text-muted-foreground" />
            </div>

            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 font-medium">{value}</p>
            </div>
        </div>
    );
}

function SummaryBox({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-2xl border bg-background p-4">
            <Icon className="mb-3 h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 font-semibold">{value}</p>
        </div>
    );
}

function InfoRow({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="flex items-start justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="max-w-[60%] text-right text-sm font-medium">{value}</p>
        </div>
    );
}

function PreferenceItem({
    icon: Icon,
    label,
    description,
    checked,
}: {
    icon: React.ElementType;
    label: string;
    description: string;
    checked: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-2xl border p-4">
            <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                </div>

                <div>
                    <p className="font-medium">{label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                </div>
            </div>

            <Switch checked={checked} />
        </div>
    );
}