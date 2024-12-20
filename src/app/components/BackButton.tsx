'use client'

import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'

export default function BackButton() {
    const router = useRouter()

    return (
        <button type={'button'}
                className={'rounded-full bg-white p-3 absolute top-[-50px] left-2 hover:bg-gray-100 drop-shadow-md'}
                onClick={() => router.back()}>
            <FaArrowLeft/>
        </button>
    )
}