import React, { useEffect } from "react";

const useDeleyedPending = (isPending: boolean, delay: number = 200) => {
    const [delayPassed, setDelayPassed] = React.useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isPending) {
            timer = setTimeout(() => {
                setDelayPassed(true);
            }, delay);
        } else {
            setDelayPassed(false);
        }

        return () => clearTimeout(timer);
    }, [isPending, delay]);

    return delayPassed;
}

export { useDeleyedPending };