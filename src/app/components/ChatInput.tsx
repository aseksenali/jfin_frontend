'use client'

import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import Link from 'next/link'

type ChatInputProps = {
    disabled?: boolean;
    onSubmit: (value: string) => void;
}

export default function ChatInput({disabled, onSubmit}: Readonly<ChatInputProps>) {
    const [value, setValue] = useState('')
    return (
        <div className={'p-4 w-full absolute bottom-0 flex gap-x-2'}>
            <input className={'w-full border border-black h-10 rounded-2xl px-4'} value={value}
                   placeholder={'Ask a question...'}
                   onChange={e => setValue(e.target.value)}
                   onKeyDown={e => {
                       if (e.key === 'Enter') {
                           onSubmit(e.currentTarget.value)
                           setValue('')
                       }
                   }} disabled={disabled}/>
            <Link href={'/edit'}>
                <button type={'button'}
                        className={'bg-white border border-black rounded-2xl w-10 h-10 flex justify-center items-center hover:bg-gray-100'}>
                    <FaPlus size={'20'}/>
                </button>
            </Link>
        </div>
    )
}