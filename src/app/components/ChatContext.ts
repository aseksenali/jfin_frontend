import { createContext, Dispatch, SetStateAction } from 'react'

export type ChatContextType = {
    isStreaming: boolean;
    setIsStreaming: Dispatch<SetStateAction<boolean>>
}

export const ChatContext = createContext<ChatContextType>({
    isStreaming: false,
    setIsStreaming: () => {}
})