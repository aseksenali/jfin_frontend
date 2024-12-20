'use client'

import { ChatListItem } from '@/app/types'
import Link from 'next/link'
import { Checkbox } from '@nextui-org/react'

type ChatCardViewProps = {
    chat: ChatListItem
    onDelete: () => void
    selected: boolean
    onSelectionChange: (value: boolean) => void
}

export default function ChatCard({chat, selected, onSelectionChange}: Readonly<ChatCardViewProps>) {
    const timeString = new Date(chat.lastUpdatedDate).toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit',
    })
    return (
        <div className={'flex justify-between px-10 items-center hover:bg-gray-100'}>
            <Checkbox isSelected={selected} onValueChange={onSelectionChange}/>
            <Link className={'w-full h-10 flex items-center'} href={`chats/${chat.id}`}>
                <div className={'w-24'}>
                    {timeString}
                </div>
                {chat.name}
            </Link>
        </div>
    )
}
