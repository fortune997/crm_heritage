export type HeritageUser = {
    id: string;
    full_name: string;
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    professional_email: string;
    phone: string;
    avatar_url: string | null;
    status: "active" | "inactive";
    last_login_at: string | null;
    last_seen_at: string | null;
    email_verified: boolean;
    must_change_password: boolean;
    language: string;
    theme: "light" | "dark" | "system";
    timezone: string;
    created_by: string | null;
    invited_by: string | null;
    invited_at: string | null;
    accepted_invitation_at: string | null;
    created_at: string;
    updated_at: string;
    department: string;
    fcm_token: string | null;
    type_commercial: string
};