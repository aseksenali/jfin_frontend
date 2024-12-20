'use client'

import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import { resetSources, uploadFile } from '@/app/services/documents'
import { DocumentDataWithLoading } from '@/app/edit/DocumentListClientView'

type InteractionButtonsProps = {
    documents: DocumentDataWithLoading[],
    setDocuments: Dispatch<SetStateAction<DocumentDataWithLoading[]>>
}

export default function InteractionButtons({documents, setDocuments}: Readonly<InteractionButtonsProps>) {
    const hasLoading = documents.some(({isLoading}) => isLoading)

    const inputFile = useRef<HTMLInputElement | null>(null)
    const onButtonClick = () => {
        inputFile.current?.click()
    }
    const [isResetPending, setIsResetPending] = useState(false)

    const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files?.length) return

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData()
            const file = files.item(i)
            if (!file) continue
            setDocuments(prevState => {
                return [
                    ...prevState,
                    {
                        document: {
                            name: file.name,
                        },
                        isLoading: true,
                        isError: false,
                    },
                ]
            })
            formData.append('document', file)
            try {
                const {fileName, creationDate} = await uploadFile(formData)
                console.log('File uploaded successfully')
                setDocuments(prevState => prevState.map(value => ({
                    document: {
                        name: value.document.name,
                        creationDate: creationDate,
                    },
                    isLoading: value.document.name === fileName ? false : value.isLoading,
                    isError: false,
                })))
            } catch (error) {
                console.error('Error uploading file:', error)
                setDocuments(prevState => prevState.map(value => ({
                    document: {
                        name: value.document.name,
                    },
                    isLoading: value.document.name === file.name ? false : value.isLoading,
                    isError: true,
                })))
            }
        }
    }

    const onResetSources = async () => {
        setIsResetPending(true)
        const {success} = await resetSources()
        if (success) {
            setDocuments([])
        }
        setIsResetPending(false)
    }

    return (
        <div className={'flex justify-end pb-4 gap-x-4'}>
            <input type={'file'} ref={inputFile} className={'hidden'} accept={'application/pdf'}
                   onChange={onFileChange} multiple/>
            <button type={'button'} className={'py-2 px-4 border border-black hover:bg-gray-100 rounded-xl '}
                    disabled={hasLoading || isResetPending}
                    onClick={onButtonClick}>
                {hasLoading ? (
                    <div className={'flex justify-center items-center'}>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg"
                             fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                    </div>
                ) : <span>Add document</span>}
            </button>
            <button type={'button'} className={'py-2 px-4 border border-black hover:bg-gray-100 rounded-xl'}
                    disabled={hasLoading || isResetPending}
                    onClick={onResetSources}>
                Clear sources
            </button>
        </div>
    )
}