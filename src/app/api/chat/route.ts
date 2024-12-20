import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const encoder = new TextEncoder();

    // Create a ReadableStream to send data to the client
    const stream = new ReadableStream({
        async start(controller) {
            // Function to send messages
            const sendMessage = (message: string) => {
                controller.enqueue(encoder.encode(`data: ${message}\n\n`));
            };

            // Parse the user's message from the request body
            const { message } = await req.json();

            // Simulate server processing and send responses
            sendMessage(`Server received: ${message}`);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
            sendMessage('Server is processing your message...');
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
            sendMessage('Here is the response to your message.');

            // Close the stream after sending all messages
            controller.close();
        },
    });

    // Return the stream response with appropriate headers for SSE
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    });
}