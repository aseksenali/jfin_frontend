'use server'

import { DocumentData } from '@/app/types'
import { revalidatePath } from 'next/cache'


export async function getDocuments() {
    const response = await fetch(`http://localhost:5110/api/documents`, {cache: 'no-store'})
    if (response.ok) {
        const body = await response.text()
        const data = JSON.parse(body) as { name: string, creation_date: string }[]
        console.log(`Got ${data.length} documents`)
        return data.map(value => ({
            creationDate: value.creation_date,
            name: value.name,
        }) as DocumentData)
    } else {
        console.error(response.status, response.statusText)
        return []
    }
}

export async function uploadFile(formData: FormData) {
    const response = await fetch(`http://localhost:5110/api/documents`, {
        method: 'POST',
        body: formData,
    })
    if (response.ok) {
        revalidatePath('/edit')
        const data = await response.json()
        return {success: true, fileName: data['file_name'], creationDate: data['creation_date']}
    } else {
        console.error(response.status, response.statusText)
        return {success: false}
    }
}

export async function deleteDocument(fileName: string) {
    console.log("Deleting documents")
    const response = await fetch(`http://localhost:5110/api/documents/${fileName}`, {
        method: 'DELETE',
    })
    if (response.ok) {
        revalidatePath('/edit', 'page')
        const data = await response.json()
        return {success: true, fileName: data['file_name']}
    } else {
        console.error(response.status, response.statusText)
        return {success: false}
    }
}

export async function resetSources() {
    const response = await fetch(`http://localhost:5110/api/sources`, {
        method: 'DELETE'
    })
    if (response.ok) {
        revalidatePath('/edit')
        return {success: true}
    } else {
        console.error(response.status, response.statusText)
        return {success: false}
    }
}