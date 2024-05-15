import React from "react";
import { cn } from "@/Utils/utils";
import { capitalize } from "@/Utils/helper";

export type Step = {
    label: string;
    form: React.ReactNode;
    isError?: boolean;
};

interface StepperOptions {
    steps: Step[];
    state?: {
        initial: number;
    };
}

interface StepperHook {
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    canGoNext: boolean;
    canGoPrev: boolean;
    next: () => void;
    prev: () => void;
    goTo: (to: number) => void;
    steps: Step[];
}

const useStepper = (options: StepperOptions): StepperHook => {
    const finalSteps = React.useMemo(() => options.steps, [options.steps]);
    const [step, setStep] = React.useState<number>(
        options?.state?.initial ?? 0
    );

    const stepsCount = finalSteps.length - 1;

    const canGoNext: boolean = step < stepsCount;

    const canGoPrev: boolean = step > 0;

    const next = () => setStep((_step) => (canGoNext ? _step + 1 : _step));

    const prev = () => setStep((_step) => (canGoPrev ? _step - 1 : _step));

    const goTo = (to: number) =>
        setStep((_step) => (to >= 0 && to <= stepsCount ? to : _step));

    return {
        currentStep: step,
        setCurrentStep: setStep,
        canGoNext,
        canGoPrev,
        next,
        prev,
        goTo,
        steps: finalSteps,
    };
};

const Stepper = ({ stepper }: { stepper: StepperHook }) => {
    return (
        <React.Fragment>
            <ol
                className={cn(
                    "items-center justify-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0"
                )}
                aria-label="stepper"
            >
                {stepper.steps.map((step, idx) => (
                    <li
                        key={idx}
                        data-active={stepper.currentStep === idx}
                        data-error={step.isError}
                        className={cn(
                            "flex items-center data-[active=true]:text-primary-600 data-[active=true]:dark:text-primary-500 data-[error=true]:text-red-600 data-[error=true]:dark:text-red-500 text-gray-600 dark:text-gray-500 space-x-2.5 rtl:space-x-reverse"
                        )}
                        onClick={() => stepper.goTo(idx)}
                    >
                        <span className="flex items-center justify-center w-6 h-6 text-sm md:w-8 md:h-8 border border-current rounded-full shrink-0">
                            {idx + 1}
                        </span>

                        <h4 className={cn("text-sm md:text-base font-medium")}>
                            {capitalize(step.label)}
                        </h4>
                    </li>
                ))}
            </ol>

            {stepper.steps.map((step, idx) => (
                <React.Fragment key={idx}>
                    {stepper.currentStep === idx ? step.form : null}
                </React.Fragment>
            ))}
        </React.Fragment>
    );
};

export { useStepper, Stepper };
