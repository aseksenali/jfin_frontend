import { useEffect, useMemo } from 'react'
import { debounce } from 'lodash'

export function useDebounce<T extends unknown[]>(func: (...args: T) => void, wait: number) {
    const debouncedFunction = useMemo(() => debounce(func, wait), [func, wait])

    useEffect(() => {
        return () => {
            debouncedFunction.cancel()
        }
    }, [debouncedFunction])
    return debouncedFunction
}