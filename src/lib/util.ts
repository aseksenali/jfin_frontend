import { JSONParsingError } from '@/lib/exceptions/exceptions'

export function getFromLocalStorage<T>(key: string): T {
    try {
        const item = window.localStorage.getItem(key)
        if (!item) return item as T
        return JSON.parse(item) as T
    } catch (error) {
        console.error(error)
        throw new JSONParsingError('Error parsing json for local storage read for key: ' + key)
    }
}

export function saveToLocalStorage<T>(key: string, value: T) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(error);
    }
}