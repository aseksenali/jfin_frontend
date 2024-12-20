import { getDocuments } from '@/app/services/documents'
import DocumentListClientView from '@/app/edit/DocumentListClientView'

type DocumentListViewProps = object

export const dynamic = 'force-dynamic';

export default async function DocumentListView({}: Readonly<DocumentListViewProps>) {
    const documents = await getDocuments()
    return <DocumentListClientView documentsData={documents}/>
}