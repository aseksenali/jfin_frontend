import { ChatListItem } from '@/app/types'
import { createContext } from 'react'

type ChatListContextType = {
    chats: ChatListItem[],
    createChat: (text: string) => string,
    onDelete: (id: string) => void
}

export const ChatListContext = createContext<ChatListContextType>({
    chats: [],
    createChat: () => {return ''},
    onDelete: () => {
    },
})
