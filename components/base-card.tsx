

export default function BaseCard({
    icon,
    count,
    title,
}: Readonly<{
    icon: React.ReactNode;
    count: number;
    title: string;
}>) {
    return (
        <div className="flex items-center gap-4 rounded-lg bg-card p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                {icon}
            </div>
            <div>
                <p className="text-2xl font-semibold">{count}</p>
                <p className="text-sm text-muted-foreground">{title}</p>
            </div>
        </div>
    )
}