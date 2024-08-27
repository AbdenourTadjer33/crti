import React from "react";

const useUpdateEffect = (callback: React.EffectCallback, deps?: React.DependencyList) => {
    const firstRenderRef = React.useRef(true);

    React.useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }
        return callback();
    }, deps)
}

export { useUpdateEffect };