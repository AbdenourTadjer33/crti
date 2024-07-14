import { Button, buttonVariants } from "@/Components/ui/button";
import * as Popover from "@/Components/ui/popover";
import { cn } from "@/Utils/utils";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import {
    CaptionProps,
    DayPicker,
    useDayPicker,
    useNavigation,
} from "react-day-picker";

type ClassNames = {
    popover_trigger?: string;
    popover_content?: string;
};

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
    value?: any;
    onValueChange?: any;
    labels?: {
        trigger?: ((value: any) => React.ReactNode) | React.ReactNode;
    };
    classNames?: ClassNames;
};

const Calendar: React.FC<
    React.ComponentProps<typeof DayPicker> & {
        value?: any;
        onValueChange?: any;
    }
> = ({
    className,
    classNames,
    showOutsideDays = true,
    value,
    onValueChange,
    ...props
}) => {
    return (
        <DayPicker
            selected={value}
            // @ts-expect-error
            onSelect={onValueChange}
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                    "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-gray-400",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100/50 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected].day-outside)]:bg-gray-800/50 dark:[&:has([aria-selected])]:bg-gray-800",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100 cursor-pointer user-select:none"
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-primary-600 text-primary-50 hover:bg-primary-600 hover:text-primary-50 focus:bg-primary-600 focus:text-primary-50 dark:bg-primary-50 dark:text-primary-600 dark:hover:bg-primary-50 dark:hover:text-primary-600 dark:focus:bg-primary-50 dark:focus:text-primary-600",
                day_today:
                    "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50",
                day_outside:
                    "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-100/50 aria-selected:text-gray-500 aria-selected:opacity-30 dark:text-gray-400 dark:aria-selected:bg-gray-800/50 dark:aria-selected:text-gray-400",
                day_disabled: "text-gray-500 opacity-50 dark:text-gray-400",
                day_range_middle:
                    "aria-selected:bg-gray-100 aria-selected:text-gray-900 dark:aria-selected:bg-gray-800 dark:aria-selected:text-gray-50",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                Caption: (props) => <CustomCalendarCaption {...props} />,
            }}
            {...props}
        />
    );
};

function CustomCalendarCaption({ displayMonth }: CaptionProps) {
    const { nextMonth, previousMonth, goToMonth } = useNavigation();
    const { classNames } = useDayPicker();
    const [isYearSelect, setIsYearSelect] = React.useState<boolean>(false);
    return (
        <div className="flex items-center justify-between">
            <Button
                type="button"
                variant="ghost"
                onClick={() => previousMonth && goToMonth(previousMonth)}
            >
                <ChevronLeft className="w-4 h-4" />
            </Button>

            <Popover.Popover>
                <Popover.PopoverTrigger asChild>
                    <Button type="button" variant="ghost">
                        {format(displayMonth, "MMM yyy")}
                    </Button>
                </Popover.PopoverTrigger>
                <Popover.PopoverContent className="p-2 min-w-[210px] max-w-[240px] max-h-[210px] overflow-auto flex flex-col items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsYearSelect(!isYearSelect)}
                    >
                        {isYearSelect
                            ? format(displayMonth, "MMM")
                            : format(displayMonth, "yyy")}
                    </Button>

                    <div className="grid grid-cols-4 gap-1">
                        {isYearSelect
                            ? Array.from(
                                  {
                                      length:
                                          Number(format(new Date(), "yyy")) -
                                          1899,
                                  },
                                  (_, index) =>
                                      Number(format(new Date(), "yyy")) - index
                              ).map((year) => (
                                  <Button
                                      key={year}
                                      type="button"
                                      variant="ghost"
                                      onClick={() =>
                                          goToMonth(
                                              new Date(
                                                  displayMonth.setFullYear(year)
                                              )
                                          )
                                      }
                                      className={
                                          year === displayMonth.getFullYear()
                                              ? classNames.day_selected
                                              : ""
                                      }
                                  >
                                      {year}
                                  </Button>
                              ))
                            : Array.from(
                                  { length: 12 },
                                  (_, index) => index
                              ).map((monthId) => (
                                  <Button
                                      key={monthId}
                                      type="button"
                                      variant="ghost"
                                      onClick={() =>
                                          goToMonth(
                                              new Date(
                                                  displayMonth.setMonth(monthId)
                                              )
                                          )
                                      }
                                      className={
                                          monthId === displayMonth.getMonth()
                                              ? classNames.day_selected
                                              : ""
                                      }
                                  >
                                      {format(
                                          new Date().setMonth(monthId),
                                          "MMM"
                                      )}
                                  </Button>
                              ))}
                    </div>
                </Popover.PopoverContent>
            </Popover.Popover>

            <Button
                type="button"
                variant="ghost"
                onClick={() => nextMonth && goToMonth(nextMonth)}
            >
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    );
}

const CalendarField: React.FC<CalendarProps> = ({ labels, ...props }) => {
    const Label = () => {
        if (typeof labels?.trigger === "function") {
            return labels.trigger(props.value);
        }
        return labels?.trigger;
    };
    return (
        <Popover.Popover>
            <Popover.PopoverTrigger
                className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full justify-between gap-4",
                    props.className,
                    props.classNames?.popover_trigger
                )}
            >
                <Label />
                <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Popover.PopoverTrigger>
            <Popover.PopoverContent
                className={cn("w-auto p-0", props.classNames?.popover_content)}
            >
                <Calendar {...props} />
            </Popover.PopoverContent>
        </Popover.Popover>
    );
};

export { type CalendarProps, CalendarField };
