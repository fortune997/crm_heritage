import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    "https://etmatyqawktbyaezzcks.supabase.co",
    "sb_publishable_l_VCQcY9gVzG4xlx4Tvelg_cn5bQLhd"
)



export default supabase;