'use client'

import { Chat } from '@/app/types'
import UserMessageView from '@/app/chats/[chatId]/UserMessageView'
import BotMessageView from '@/app/chats/[chatId]/BotMessageView'
import { Ref } from 'react'

type MessageListProps = {
    chat: Chat
    isThinking: boolean
    ref: Ref<HTMLDivElement>
}


export default function MessageListView({chat, isThinking, ref}: Readonly<MessageListProps>) {
    return (
        <div className={'flex flex-col w-full overflow-y-auto h-[calc(100%-5rem)]'} ref={ref}>
            {
                chat.messages.map(message => {
                    switch (message.role) {
                        case 'user':
                            return <UserMessageView key={message.id} message={message}/>
                        case 'bot':
                            return <BotMessageView key={message.id} message={message}/>
                    }
                })
            }
            {
                isThinking && <BotMessageView
                    message={{text: 'Thinking...', role: 'bot', id: '', createdDate: Date.now(), sources: []}}/>
            }
        </div>
    )
}