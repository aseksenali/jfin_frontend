import { UserMessage } from '@/app/types'
import { FaRegUserCircle } from "react-icons/fa";


type UserMessageProps = {
    message: UserMessage
}

export default function UserMessageView({message}: Readonly<UserMessageProps>) {
    return (
        <div className={'flex justify-end items-end gap-x-2 w-full p-5'}>
            <div className={'p-5 w-1/2 border rounded-2xl bg-gray-100'}>
                {message.text}
            </div>
            <FaRegUserCircle size={'25'} />
        </div>
    )
}