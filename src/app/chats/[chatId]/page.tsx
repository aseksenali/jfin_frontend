'use client'

import MessageListView from '@/app/chats/[chatId]/MessageListView'
import ChatInput from '@/app/components/ChatInput'
import { use, useCallback, useEffect, useRef, useState } from 'react'
import useLocalStorage from '@/hooks/useLocalStorage'
import { Chat, ChatListItem } from '@/app/types'
import { v4 as uuidv4 } from 'uuid'
import BackButton from '@/app/components/BackButton'
import { promptRequest } from '@/app/services/chat'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearchParams } from 'next/navigation'

export default function Page({params}: { params: Promise<{ chatId: string }> }) {
    const {chatId} = use(params)
    const searchParams = useSearchParams()
    const fromInput = searchParams.get('from_input') === 'true'
    const [autoScrollToBottom, setAutoScrollToBottom] = useState(true)
    const [isThinking, setIsThinking] = useState(false)
    const [chat, setChat] = useLocalStorage<Chat>(chatId, {
        messages: [],
    })
    const initialized = useRef(!fromInput)

    useEffect(() => {
        if (!initialized.current && chat.messages.length === 1) {
            setIsThinking(true)
            initialized.current = true
            promptRequest({
                prompt: chat.messages[0].text,
                chat_history: chat.messages.map(message => [message.role === 'user' ? 'human' : 'ai', message.text]),
            }).then(r => {
                if (r) {
                    setChat(prevState => ({
                        messages: [...prevState.messages, {
                            id: uuidv4(),
                            role: 'bot',
                            createdDate: Date.now(),
                            text: r.answer,
                        }],
                    }))
                }
                setIsThinking(false)
            })
        }
    }, [chat.messages, setChat])

    const [, setChatItems] = useLocalStorage<ChatListItem[]>('chats', [])
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const scrollToBottom = useCallback(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }
    }, [])

    const scrollToBottomDelayed = useDebounce(scrollToBottom, 1)

    useEffect(() => {
        if (autoScrollToBottom) {
            scrollToBottomDelayed()
        }
    }, [chat, autoScrollToBottom, scrollToBottomDelayed])

    const handleScroll = () => {
        if (messagesContainerRef.current) {
            const {scrollTop, scrollHeight, clientHeight} = messagesContainerRef.current
            const isAtBottom = scrollHeight - scrollTop <= clientHeight + 5
            setAutoScrollToBottom(isAtBottom)
        }
    }

    useEffect(() => {
        const container = messagesContainerRef.current
        if (container) {
            container.addEventListener('scroll', handleScroll)
            return () => container.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const handleSendMessage = useCallback((text: string) => {
        setIsThinking(true)
        setChat(prevState => ({
            messages: [...prevState.messages, {
                id: uuidv4(),
                role: 'user',
                createdDate: Date.now(),
                text: text,
            }],
        }))
        setChatItems(prevState => prevState.map(chatItem => {
            if (chatItem.id === chatId) {
                return {
                    ...chatItem,
                    lastUpdatedDate: Date.now(),
                }
            }
            return chatItem
        }))
        setAutoScrollToBottom(true)
        promptRequest({
            prompt: text,
            chat_history: chat.messages.map(message => [message.role === 'user' ? 'human' : 'ai', message.text]),
        }).then(r => {
            if (r) {
                setChat(prevState => ({
                    messages: [...prevState.messages, {
                        id: uuidv4(),
                        role: 'bot',
                        createdDate: Date.now(),
                        text: r.answer,
                    }],
                }))
            }
            setIsThinking(false)
        })
    }, [chat.messages, chatId, setChat, setChatItems])

    useEffect(() => {

    })
    return (
        <>
            <BackButton/>
            <MessageListView chat={chat} isThinking={isThinking} ref={messagesContainerRef}/>
            <ChatInput disabled={isThinking} onSubmit={handleSendMessage}/>
        </>
    )
}