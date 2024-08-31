import React from "react";
import * as Card from "@/Components/ui/card";
import { Link } from "@inertiajs/react";
import { buttonVariants } from "@/Components/ui/button";
import { cn } from "@/Utils/utils";

interface VersionInCreationProps {
    version: { id: number; reason: string; createdAt: string };
}

const VersionInCreation: React.FC<VersionInCreationProps> = ({ version }) => {
    const displayWarning = React.useMemo(() => {
        // return dayjs().diff(dayjs(version.createdAt), "minute") > 15;
        return true
    }, [version.createdAt]);

    const href = route("project.version.edit", {
        project: route().params.project as string,
        version: version.id,
    });

    if (displayWarning) {
        return (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-yellow-800">
                            Version incomplète
                        </h3>
                        <p className="text-sm text-yellow-700">
                            Vous avez une version en cours que vous n'avez pas
                            encore terminée. Veuillez compléter cette version
                            pour finaliser vos modifications.
                        </p>
                    </div>
                    <Link
                        href={href}
                        className={buttonVariants({
                            variant: "warning",
                        })}
                    >
                        Continue la version
                    </Link>
                </div>
            </div>
        );
    }
    return (
        <Card.Card className="max-w-xl p-4 space-y-2 overflow-hidden">
            <Card.CardTitle className="text-xl">
                Version incomplète
            </Card.CardTitle>
            <Card.CardDescription>{version.reason}</Card.CardDescription>
            <div className="flex justify-end">
                <Link href={href} className={cn(buttonVariants({}))}>
                    Continue la version
                </Link>
            </div>
        </Card.Card>
    );
};

export default VersionInCreation;
