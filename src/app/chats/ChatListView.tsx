'use client'

import { ChatListItem } from '@/app/types'
import ChatCard from '@/app/components/CardCardView'
import { use, useEffect, useState } from 'react'
import { FaTrashCan } from 'react-icons/fa6'
import { Checkbox } from '@nextui-org/react'
import { ChatListContext } from '@/app/components/ChatListContext'

function groupChats(chats: ChatListItem[]) {
    const groups: Record<string, ChatListItem[]> = {}
    chats.sort((a, b) => {
        return b.lastUpdatedDate - a.lastUpdatedDate
    }).forEach(chat => {
        const date = new Date(chat.lastUpdatedDate).toDateString()
        groups[date] ??= []
        groups[date].push(chat)
    })
    return groups
}

export const dynamic = 'force-dynamic'

export default function ChatListView() {
    const {chats, onDelete} = use(ChatListContext)
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
    }, [])
    const [selectedChats, setSelectedChats] = useState<string[]>([])
    const groupedChats = groupChats(chats)
    if (!isClient) {
        return null
    }
    return (
        <>
            {
                !!chats.length && <div
                    className={'w-full flex justify-between rounded-full absolute top-[-50px] items-center pl-[3.75rem] pr-3'}>
                    <div>
                        <Checkbox isSelected={chats.every(chat => selectedChats.some(id => chat.id === id))}
                                  onValueChange={value => {
                                      if (value) {
                                          setSelectedChats(chats.map(chat => chat.id))
                                      } else {
                                          setSelectedChats([])
                                      }
                                  }}/>
                        {!!selectedChats.length && <span>{selectedChats.length} selected</span>}
                        {!selectedChats.length && <span>Select all</span>}
                    </div>
                    <button type={'button'} className={'p-3 rounded-2xl bg-white hover:bg-gray-100 drop-shadow-md'}
                            onClick={() => {
                                selectedChats.forEach(onDelete)
                                setSelectedChats([])
                            }}>
                        <FaTrashCan/>
                    </button>
                </div>
            }
            <div className={'h-[calc(100%-2.5rem)] p-5 overflow-y-auto'}>
                {
                    Object.entries(groupedChats).map(([date, chats]) => {
                        return (
                            <div key={date}>
                                <span className={'font-bold text-xl px-10'}>{date}</span>
                                {
                                    chats.map(chat => {
                                        return (
                                            <ChatCard key={chat.id} chat={chat} onDelete={() => onDelete(chat.id)}
                                                      selected={selectedChats.some(id => chat.id === id)}
                                                      onSelectionChange={value => {
                                                          if (value) {
                                                              setSelectedChats(prevState => [...prevState, chat.id])
                                                          } else {
                                                              setSelectedChats(prevState => prevState.filter(id => id !== chat.id))
                                                          }
                                                      }}/>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}