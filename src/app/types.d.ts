export type MessageMetadata = {
    id: string,
    createdDate: number
}

export type UserMessage = {
    role: 'user'
    text: string,
} & MessageMetadata

export type BotMessage = {
    role: 'bot',
    text: string,
    sources?: Source[]
} & MessageMetadata

export type Message = UserMessage | BotMessage

export type Chat = {
    messages: Message[],
}

export type Source = {
    fileName: string,
    content: string,
}

export type ChatListItem = {
    id: string,
    name: string,
    lastUpdatedDate: number,
}

export type DocumentData = {
    name: string,
    creationDate?: string,
}