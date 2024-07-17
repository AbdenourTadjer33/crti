import React, { useEffect } from "react";

const useUpdateEffect = (callback: React.EffectCallback, deps?: React.DependencyList) => {
    const firstRenderRef = React.useRef(true);

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }
        return callback();
    }, deps)
}

export { useUpdateEffect };