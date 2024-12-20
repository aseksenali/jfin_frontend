'use client'

import ChatListView from '@/app/chats/ChatListView'
import { use } from 'react'
import ChatInput from '@/app/components/ChatInput'
import { useRouter } from 'next/navigation'
import { ChatListContext } from '@/app/components/ChatListContext'


export default function Home() {
    const {createChat} = use(ChatListContext)
    const router = useRouter();
    return (
        <>
            <ChatListView/>
            <ChatInput onSubmit={value => {
                const id = createChat(value)
                router.push(`chats/${id}?from_input=true`)
            }}/>
        </>
    )
}
