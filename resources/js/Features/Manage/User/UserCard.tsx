import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { Button, buttonVariants } from "@/Components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Indicator } from "@/Components/ui/indicator";
import { Text } from "@/Components/ui/paragraph";
import { getInitials } from "@/Utils/helper";
import { Link } from "@inertiajs/react";
import { UUID } from "crypto";

type Division = {
    id?: string;
    name: string;
    abbr: string
    description?: string;
};

type UserDivision = {
    grade: string;
    addedAt: string;
};

type UserCard = {
    uuid: UUID;
    name: string;
    email: string;
    isEmailVerified: boolean;
    status: boolean;
    dob?: number;
    sex?: number;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    divisions: (Division & UserDivision)[];
};

interface UserCardProps {
    user: UserCard;
}
export const UserCard: React.FC<UserCardProps> = ({ user }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row gap-5 items-center" >
                <Avatar>
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <CardTitle>
                    {user.name}<br/>
                    <Text className="flex items-center gap-1">
                        <Indicator color={user.isEmailVerified} />
                        {user.email}
                    </Text>
                </CardTitle>
            </CardHeader>
            {user.divisions.map((division) => (
                <CardContent key={division.id} className=" lg:flex space-x-2">
                        <Text className=" font-medium">{division.grade}</Text>
                        <Text>{division.name} <span className=" font-medium">{division.abbr}</span></Text>
                </CardContent>
            ))}
            <CardFooter className="justify-end gap-2">
                <Link
                    href={route("manage.user.edit", {
                        user: route().params.user as string,
                    })}
                    className={buttonVariants({
                        variant: "secondary",
                    })}
                >
                    Modifier
                </Link>
                <Button>Bloquer</Button>
                <Button variant="destructive">Supprimer</Button>
            </CardFooter>
        </Card>
    );
};
