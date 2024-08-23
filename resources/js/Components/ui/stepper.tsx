import React from "react";
import { cn } from "@/Utils/utils";
import { Check, X } from "lucide-react";

type BaseStep = {
    title: string;
    description?: string;
    content?:
        | React.ReactNode
        | ((props: StepperContentProps) => React.ReactNode);
};

interface Step extends BaseStep {
    id: number;
}

type StepperContentProps = {
    markStepAsError: () => void;
    markStepAsSuccess: () => void;
    clearStepError: () => void;
    next: () => void;
    prev: () => void;
    canGoNext: boolean;
    canGoPrev: boolean;
};

interface StepperOptions {
    steps: BaseStep[];
    state?: {
        initial?: number;
        errors?: StepperHook["errors"];
        success?: StepperHook["success"];
    };
}

interface StepperHook {
    steps: Step[];
    currentStep: number;
    canGoNext: boolean;
    canGoPrev: boolean;
    errors: Record<number, true>;
    success: Record<number, true>;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    next: () => void;
    prev: () => void;
    goTo: (to: number) => void;
    setIsError: (step: number) => void;
    clearError: (step: number) => void;
    setIsSuccess: (step: number) => void;
    unsuccessStep: (step: number) => void;
    setErrors: React.Dispatch<React.SetStateAction<Record<number, true>>>;
    setSuccess: React.Dispatch<React.SetStateAction<Record<number, true>>>;
}

interface StepItemProps {
    id: Step["id"];
    title: Step["title"];
    description?: Step["description"];
    isActive?: boolean;
    isError?: boolean;
    isSuccess?: boolean;
    /**
     * Set to false to not show the title & description
     *
     * @defaultValue true
     */
    showDetails?: boolean;
}

interface StepperWrapperProps extends React.HTMLAttributes<HTMLUListElement> {}

function useStepper({ steps, state }: StepperOptions): StepperHook {
    const finalSteps = React.useMemo<Step[]>(
        () =>
            steps.map((step, idx) => ({
                id: idx + 1,
                title: step.title,
                description: step.description,
                content: step.content,
            })),
        [steps]
    );

    const [errors, setErrors] = React.useState(state?.errors ?? {});
    const [success, setSuccess] = React.useState(state?.success ?? {});
    const [currentStep, setCurrentStep] = React.useState(state?.initial ?? 1);

    const stepsCount = finalSteps.length;

    const canGoNext: boolean = currentStep < stepsCount;

    const canGoPrev: boolean = currentStep > 1;

    const goTo = (to: number) =>
        setCurrentStep((_step) => (to >= 1 && to <= stepsCount ? to : _step));

    const next = () => canGoNext && goTo(currentStep + 1);

    const prev = () => canGoPrev && goTo(currentStep - 1);

    const setIsError = (step: number) =>
        setErrors((errors) => ({ ...errors, [step]: true }));

    const clearError = (step: number) =>
        setErrors((errors) => {
            delete errors[step];
            return { ...errors };
        });

    const setIsSuccess = (step: number) =>
        setSuccess((success) => ({ ...success, [step]: true }));

    const unsuccessStep = (step: number) =>
        setSuccess((success) => {
            delete success[step];
            return { ...success };
        });

    React.useEffect(() => {
        const updatedSuccess = { ...success };
        Object.keys(updatedSuccess).forEach((step) => {
            if (Number(step) >= currentStep) {
                delete updatedSuccess[Number(step)];
            }
        });
        setSuccess(updatedSuccess);
    }, [currentStep]);

    return {
        steps: finalSteps,
        currentStep,
        canGoNext,
        canGoPrev,
        errors,
        success,
        setCurrentStep,
        next,
        prev,
        goTo,
        setIsError,
        clearError,
        setIsSuccess,
        unsuccessStep,
        setErrors,
        setSuccess,
    };
}

const StepperWrapper: React.FC<StepperWrapperProps> = ({
    className,
    ...props
}) => {
    return (
        <ul
            className={cn(
                "relative flex flex-col md:flex-row gap-2",
                className
            )}
            {...props}
        />
    );
};

const StepItem: React.FC<StepItemProps> = ({
    id,
    title,
    description,
    isActive,
    isError,
    isSuccess,
    showDetails = true,
}) => {
    const state = React.useMemo<string | undefined>(() => {
        if (isActive && !isError) return "active";
        if (isSuccess && !isError) return "success";
        if (isError) return "error";
    }, [isActive, isError, isSuccess]);

    return (
        <li className="md:shrink md:basis-0 flex-1 group flex gap-x-2 md:block">
            <div className="min-w-7 min-h-7 flex flex-col items-center md:w-full md:inline-flex md:flex-wrap md:flex-row text-xs align-middle">
                <span
                    className={cn(
                        "size-7 flex justify-center items-center shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full",
                        "data-[state=active]:bg-primary-600 data-[state=active]:text-white",
                        "data-[state=success]:bg-primary-600 data-[state=success]:text-white",
                        "data-[state=error]:bg-red-600 data-[state=error]:text-white"
                    )}
                    data-state={state}
                >
                    {state === "success" ? (
                        <Check className="h-4 w-4" />
                    ) : state === "error" ? (
                        <X className="h-4 w-4" />
                    ) : (
                        id
                    )}
                </span>
                <div
                    className={cn(
                        "mt-2 w-px h-full md:mt-0 md:ms-2 md:w-full md:h-px md:flex-1 group-last:hidden",
                        "bg-gray-200 data-[state=success]:bg-primary-600"
                    )}
                    data-state={state}
                />
            </div>
            {showDetails && (
                <div className="grow md:grow-0 md:mt-3 pb-5">
                    <span className="block text-sm font-medium text-gray-800">
                        {title}
                    </span>
                    {description && (
                        <p className="text-sm text-gray-500">{description}</p>
                    )}
                </div>
            )}
        </li>
    );
};

export type {
    BaseStep,
    Step,
    StepperContentProps,
    StepperOptions,
    StepperHook,
    StepItemProps,
};

export { useStepper, StepperWrapper, StepItem };
