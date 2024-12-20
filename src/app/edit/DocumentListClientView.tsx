'use client'

import { DocumentData } from '@/app/types'
import { useState } from 'react'
import InteractionButtons from '@/app/edit/InteractionButtons'
import { deleteDocument } from '@/app/services/documents'
import { FaTrashCan } from 'react-icons/fa6'

type DocumentListClientViewProps = {
    documentsData: DocumentData[]
}

export type DocumentDataWithLoading = {
    document: DocumentData,
    isLoading: boolean,
    isError: boolean
}

export const dynamic = 'force-dynamic'

export default function DocumentListClientView({documentsData}: Readonly<DocumentListClientViewProps>) {
    const [documents, setDocuments] = useState<DocumentDataWithLoading[]>(documentsData.map(documentData => ({
        document: documentData,
        isLoading: false,
        isError: false,
    })))
    return (
        <div className={'py-10 px-5'}>
            <InteractionButtons documents={documents} setDocuments={setDocuments}/>
            <table className={'w-full'}>
                <thead>
                <tr className={'px-5'}>
                    <th className={'font-bold py-4'}>Document name</th>
                    <th className={'font-bold py-4'}>Creation date</th>
                    <th className={'font-bold py-4'}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {
                    documents.map(({document, isLoading, isError}) => (
                        <tr key={document.name}
                            className={'hover:bg-gray-100 cursor-pointer'}>
                            <td className={'py-4 pl-5'}>{document.name}</td>
                            {isLoading && <td className={'py-4 text-center'}>Loading...</td>}
                            {isError && <td className={'py-4 text-center'}>Error uploading file</td>}
                            {document.creationDate && (
                                <>
                                    <td className={'py-4 text-center'}>
                                        <p>{document.creationDate}</p>
                                    </td>
                                    <td className={'py-4 flex justify-center items-center text-center'}>
                                        <button type={'button'} className={'relative top-0.5'} onClick={async () => {
                                            const response = await deleteDocument(document.name)
                                            if (response.success) {
                                                setDocuments(prevState => prevState.filter(d => d.document.name !== response.fileName))
                                            }
                                        }}>
                                            <FaTrashCan/>
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    )
}