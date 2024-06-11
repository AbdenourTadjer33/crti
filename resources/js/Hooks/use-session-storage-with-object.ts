import React from 'react'
import { useSessionStorage } from './use-session-storage'

function useSessionStorageWithObject<T>(
    key: string,
    initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
    const [state, setState, clear] = useSessionStorage(key, JSON.stringify(initialValue))
    const item: T = JSON.parse(state)
    const setItem = (value: React.SetStateAction<T>) => {
        if (value instanceof Function) {
            setState((prevState) => JSON.stringify(value(JSON.parse(prevState))))
            return
        }
        setState(JSON.stringify(value))
    }
    return [item, setItem, clear]
}

export { useSessionStorageWithObject as useSessionStorage }