import { RefObject, useEffect, useRef } from 'react';

type EventHandler<K extends keyof WindowEventMap> = (event: WindowEventMap[K]) => void;

export function useEventListener<T extends HTMLElement = HTMLDivElement, K extends keyof WindowEventMap = keyof WindowEventMap>(
    eventName: K,
    handler: EventHandler<K>,
    element?: RefObject<T>
) {
    // Create a ref that stores handler
    const savedHandler = useRef<EventHandler<K>>();

    useEffect(() => {
        // Define the listening target
        const targetElement: T | Window = element?.current || window;
        if (!(targetElement && targetElement.addEventListener)) {
            return;
        }

        // Update saved handler if necessary
        savedHandler.current = handler;

        // Create event listener that calls handler function stored in ref
        const eventListener = (event: Event) => {
            // Cast event to the specific event type
            savedHandler.current?.(event as WindowEventMap[K]);
        };

        targetElement.addEventListener(eventName, eventListener);

        // Remove event listener on cleanup
        return () => {
            targetElement.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element, handler]);
}