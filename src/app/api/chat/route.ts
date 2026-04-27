import { GoogleGenerativeAI } from '@google/generative-ai';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

// Create a new Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Define message interface
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Convert messages to the format expected by Gemini
function convertToGeminiMessages(messages: Message[]) {
  return messages.map(message => ({
    role: message.role === 'user' ? 'user' : 'model',
    parts: [{ text: message.content }],
  }));
}

export async function POST(req: Request) {
  try {
    // Extract the `messages` from the body of the request
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Convert messages to Gemini format
    const geminiMessages = convertToGeminiMessages(messages);

    // Start a chat session
    const chat = model.startChat({
      history: geminiMessages.slice(0, -1), // All messages except the last one
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Get the last message (user's current message)
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage.role !== 'user') {
      return new Response('Last message must be from user', { status: 400 });
    }

    // Generate a streaming response
    const result = await chat.sendMessageStream(lastMessage.content);
    
    // Create a readable stream from the Gemini stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              // Format for AI SDK streaming
              const formattedChunk = `0:"${text.replace(/"/g, '\\"')}"\n`;
              controller.enqueue(new TextEncoder().encode(formattedChunk));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    // Respond with the stream
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate response' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
