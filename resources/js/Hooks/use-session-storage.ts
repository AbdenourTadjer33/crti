import React from 'react'

export function useSessionStorage(
    key: string,
    initialValue: string = ''
): [string, React.Dispatch<React.SetStateAction<string>>, () => void] {
    const [item, setValue] = React.useState(() => {
        const value = sessionStorage.getItem(key) || initialValue
        sessionStorage.setItem(key, value)
        return value
    })

    const setItem = (action: React.SetStateAction<string>) => {
        if (action instanceof Function) {
            return setValue((prevState) => {
                const value = action(prevState)
                sessionStorage.setItem(key, value)
                return value
            })
        }
        setValue(action)
        sessionStorage.setItem(key, action)
    }

    const clear = () => {
        sessionStorage.removeItem(key)
    }

    return [item, setItem, clear]
}