import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardSubTitle, CardTitle } from "@/Components/ui/card";
import { Button, buttonVariants } from "@/Components/ui/button";
import { Avatar } from "@/Components/ui/avatar";
import { Link } from "@inertiajs/react";
import { Board } from "@/types";
import { Text } from "@/Components/ui/paragraph";
import { Indicator } from "@/Components/ui/indicator";



interface BoardPresidentCardProps {
    board: Board;
}


export const BoardPresidentCard: React.FC<BoardPresidentCardProps> = ({ board }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {board.name}
                </CardTitle>
            <CardSubTitle>
                <Text className="text-sm">
                    {board.president.name} <span className=" text-xs text-gray-500 ">président</span>
                </Text>
            </CardSubTitle>

            </CardHeader>
                <CardContent>
                {board.users && board.users.length > 0 ? (
                    <div>
                        {board.users.map((user, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Text className="text-sm">{user.name}</Text>
                                {user.isFavorable === true && (
                                    <>
                                        <Indicator color="green" />
                                        <Text className="text-sm">favorable</Text>
                                    </>
                                )}
                                {user.isFavorable === false && (
                                    <>
                                        <Indicator color="red" />
                                        <Text className="text-sm">non-favorable</Text>
                                    </>
                                )}
                                {user.isFavorable === null && (
                                    <>
                                        <Text className="text-sm text-gray-500">En attente</Text>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <Text>No users available.</Text>
                )}
                </CardContent>
            <CardFooter className="justify-end gap-2">
                <Text>
                    <span className="text-sm">Projet en commissions</span> {" " + board.project.name}
                </Text>
            </CardFooter>
        </Card>
    );
};
