import React from "react";
import * as Popover from "@/Components/ui/popover";
import { Button, buttonVariants } from "@/Components/ui/button";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/Components/ui/calendar";

interface TimelineFieldProps extends React.HTMLAttributes<HTMLButtonElement> {
    value: DateRange;
    setValue: (value: DateRange | undefined) => void;
}

const TimelineField: React.FC<TimelineFieldProps> = ({
    value,
    setValue,
    ...props
}) => {
    return (
        <Popover.Popover>
            <Popover.PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-between pr-0"
                    {...props}
                >
                    <div className="w-full truncate text-start">
                        {!value || (!value?.from && !value?.to)
                            ? "Date début/fin"
                            : value.from && !value.to
                            ? `De ${format(value.from, "dd/MM/yyy")}`
                            : value.from &&
                              value.to &&
                              `De ${format(value.from, "dd/MM/yyy")} à ${format(
                                  value.to,
                                  "dd/MM/yyy"
                              )}`}
                    </div>
                    <div
                        className={buttonVariants({
                            variant: "ghost",
                            size: "sm",
                        })}
                    >
                        <CalendarIcon className="shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                </Button>
            </Popover.PopoverTrigger>
            <Popover.PopoverContent className="w-auto p-0">
                <Calendar
                    mode="range"
                    showOutsideDays={false}
                    selected={value}
                    onSelect={setValue}
                    defaultMonth={value?.from}
                />
            </Popover.PopoverContent>
        </Popover.Popover>
    );
};

export default TimelineField;
