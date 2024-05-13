import { cn } from "@/Utils/utils";
import React, { useState } from "react";
import { TiTick } from "react-icons/ti";
import { Heading } from "./ui/heading";
import { capitalize } from "@/Utils/helper";
import { Text } from "./ui/paragraph";

export type StepsData = (
    | { label: string; description?: string; form?: () => {} }
    | string
)[];

function Stepper({
    stepper,
    className,
    ...props
}: React.HTMLAttributes<HTMLOListElement> & {
    stepper: { steps: StepsData; currentStep: number };
}) {
    return (
        <ol
            className={cn(
                "items-center justify-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0",
                className
            )}
            {...props}
        >
            {stepper.steps.map((step, idx) => {
                return (
                    <Step
                        key={idx}
                        idx={idx + 1}
                        label={typeof step === "string" ? step : step?.label}
                        description={
                            typeof step === "string"
                                ? undefined
                                : step?.description
                        }
                        isActive={idx === stepper.currentStep}
                        isError={false}
                        isValid={false}
                    />
                );
            })}
        </ol>
    );
}

function Step({
    idx,
    label,
    description,
    isActive,
    isError,
    isValid,
    className,
    ...props
}: React.HTMLAttributes<HTMLLIElement> & {
    idx: number;
    label: string;
    description?: string;
    isActive: boolean;
    isError?: boolean;
    isValid?: boolean;
}) {
    return (
        <li
            className={cn(
                "flex items-center data-[active=true]:text-primary-600 data-[active=true]:dark:text-primary-500  text-gray-600 dark:text-gray-500 space-x-2.5 rtl:space-x-reverse"
            )}
            data-active={isActive}
            {...props}
        >
            <span
                className="flex items-center justify-center w-6 h-6 text-sm md:w-8 md:h-8 border data-[active=true]:border-primary-600 data-[active=true]:dark:border-primary-500 data-[active=true]:dark:text-primary-500 border-gray-600 dark:border-gray-400 rounded-full shrink-0"
                data-active={isActive}
            >
                {idx}
            </span>
            <span>
                <Heading
                    level={5}
                    className="text-sm md:text-base font-medium leading-tight"
                >
                    {capitalize(label)}
                </Heading>
                {description && (
                    <Text className="text-sm md:text-base font-medium leading-tight">
                        {capitalize(description)}
                    </Text>
                )}
            </span>
        </li>
    );
}

function FormStepper({ formStepper }) {
    return formStepper.map((renderForm, idx) => (
        <React.Fragment key={idx}>
            {idx === step ? renderForm() : null}
        </React.Fragment>
    ));
}

const useStepper = (_steps: StepsData, _current?: number) => {
    const finalSteps = React.useMemo(() => _steps, [_steps]);
    const [step, setStep] = React.useState<number>(_current ?? 0);

    return {
        stepper: { steps: finalSteps, currentStep: step },
        // formStepper: finalSteps.map((step) =>
        // typeof step !== "string" ? step.form : null
        // ),
        formStepper: finalSteps.map((step) => step.form),
        step: step,
        setStep: setStep,
        next: () => setStep((prev) => prev + 1),
        prev: () => setStep((prev) => prev - 1),
        goTo: (to: number) => setStep(to),
        canGoNext: step !== finalSteps.length - 1,
        canGoPrev: step !== 0,
    };
};

export { useStepper, Stepper, FormStepper, Step };
