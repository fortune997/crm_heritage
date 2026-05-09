
type AuthHeaderProps = {
    title: string;
    description: string
}

const AuthHeader = ({ title, description }: AuthHeaderProps) => {
    return (
        <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
                {title}
            </h1>

            <p className="mt-4 text-base text-muted-foreground">
                {description}
            </p>
        </div>
    )
}

export default AuthHeader