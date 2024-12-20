import { BotMessage } from '@/app/types'
import { FaRobot } from 'react-icons/fa'
import Markdown from 'marked-react'
import styles from './bot-message.module.scss'

type BotMessageViewProps = {
    message: BotMessage
}

export default function BotMessageView({message}: Readonly<BotMessageViewProps>) {
    return (
        <div className={'flex justify-start items-end gap-x-2 w-full p-5'}>
            <FaRobot size={'25'}/>
            <div className={`p-5 w-2/3 border rounded-2xl bg-gray-100 ${styles.message}`}>
                <Markdown>
                    {message.text}
                </Markdown>
            </div>
        </div>
    )
}