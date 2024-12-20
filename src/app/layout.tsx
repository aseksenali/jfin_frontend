'use client'

import { Roboto } from 'next/font/google'
import './globals.css'
import React, { useCallback, useState } from 'react'
import { ChatContext } from './components/ChatContext'
import useLocalStorage from '@/hooks/useLocalStorage'
import { Chat, ChatListItem } from '@/app/types'
import { v4 as uuidv4 } from 'uuid'
import { saveToLocalStorage } from '@/lib/util'
import { ChatListContext } from './components/ChatListContext'

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
})

function createNewChatItem(id: string, text: string): ChatListItem {
    return {
        id,
        name: text,
        lastUpdatedDate: Date.now(),
    }
}

function createNewChat(text: string): Chat {
    return {
        messages: [
            {
                id: uuidv4(),
                text,
                createdDate: Date.now(),
                role: 'user',
            },
        ],
    }
}


export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    const [isStreaming, setIsStreaming] = useState(false)
    const [chatItems, setChatItems] = useLocalStorage<ChatListItem[]>('chats', [])
    const createChat = useCallback((text: string) => {
        const id = uuidv4()
        const chatItem = createNewChatItem(id, text)
        const chat = createNewChat(text)
        setChatItems(prevState => [...prevState, chatItem])
        saveToLocalStorage(id, chat)
        return id
    }, [setChatItems])
    return (
        <html lang="de" className={roboto.className}>
        <head>
            <title>Chatbot</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body className={'bg-[#F6F4EB] text-[#202124] leading-6'}>
        <div className={'w-dvw h-dvh flex justify-center items-center'}>
            <div className={'bg-white rounded-3xl w-1/2 h-4/5 shadow-md relative'}>
                <ChatContext.Provider value={{isStreaming, setIsStreaming}}>
                    <ChatListContext.Provider value={{
                        chats: chatItems,
                        createChat,
                        onDelete: id => {
                            setChatItems(prevState => prevState.filter(chatItem => chatItem.id !== id))
                        },
                    }}>
                        {children}
                    </ChatListContext.Provider>
                </ChatContext.Provider>
            </div>
        </div>
        </body>
        </html>
    )
}
