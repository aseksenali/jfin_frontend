'use server'

type PromptRequest = {
    prompt: string,
    chat_history: ["human" | "ai", string][],
}

type Source = {
    sourceEnglish: string,
    pageContent: string,
}

type PromptResponse = {
    answer: string,
    sources: Source[],
}

export async function promptRequest(request: PromptRequest) {
    const response = await fetch("http://localhost:5110/api/prompt", {
        method: 'POST',
        body: JSON.stringify(request),
        keepalive: true,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.ok) {
        return await response.json() as PromptResponse;
    }
}