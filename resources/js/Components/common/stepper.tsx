import React from "react";
import { StepperWrapper, StepItem, StepperHook } from "@/Components/ui/stepper";

interface StepperProps {
    stepper: StepperHook;
}

const Stepper: React.FC<StepperProps> = ({ stepper }) => {
    const {
        steps,
        currentStep,
        canGoNext,
        canGoPrev,
        errors,
        success,
        next,
        prev,
        setIsError,
        setIsSuccess,
        clearError,
        goTo,
    } = stepper;

    React.useEffect(() => {
        window.goTo = goTo;
    }, []);

    return (
        <>
            <StepperWrapper>
                {steps.map((step) => (
                    <StepItem
                        key={step.id}
                        id={step.id}
                        title={step.title}
                        description={step.description}
                        isActive={step.id === currentStep}
                        isSuccess={success[step.id]}
                        isError={errors[step.id]}
                    />
                ))}
            </StepperWrapper>

            {steps.map((step, idx) => (
                <React.Fragment key={idx}>
                    {currentStep === step.id && (
                        <>
                            {typeof step.content === "function"
                                ? step.content({
                                      next,
                                      prev,
                                      markStepAsError: () =>
                                          setIsError(step.id),
                                      markStepAsSuccess: () =>
                                          setIsSuccess(step.id),
                                      clearStepError: () => clearError(step.id),
                                      canGoNext,
                                      canGoPrev,
                                  })
                                : step.content}
                        </>
                    )}
                </React.Fragment>
            ))}
        </>
    );
};

export default Stepper;
