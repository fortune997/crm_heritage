import React from 'react'
import { AppLogo } from './AppLogo'

const LeftSideAuth = () => {
    return (
        <section className="hidden bg-gradient-to-br from-[#0F482A] via-[#0F6739] to-[#082B18] p-10 text-white lg:flex lg:flex-col lg:justify-between">


            <div className='w-full'>
                <AppLogo className=" bg-white/95 p-2 rounded-xl  shadow-sm" />
            </div>

            <div className="max-w-xl">
                <p className="mb-4 text-sm font-medium  tracking-[0.3em] text-white/80">
                    CRM Heritage
                </p>

                <h1 className="text-3xl font-bold leading-tight">
                    Gérez vos prospects, vos biens et vos activités commerciales avec
                    efficacité.
                </h1>

                <p className="mt-6 text-base leading-5 text-white/85">
                    Une interface simple, moderne et sécurisée pour permettre à chaque
                    utilisateur d'accéder à son espace selon son rôle et ses
                    autorisations.
                </p>
            </div>

            <p className="text-xs text-white/70">
                © {new Date().getFullYear()} Heritage. Tous droits réservés.
            </p>
        </section>
    )
}

export default LeftSideAuth