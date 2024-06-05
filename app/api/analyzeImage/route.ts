import { Configuration, OpenAIApi } from "openai-edge"
import { OpenAIStream, StreamingTextResponse } from "ai"

export const runtime = 'edge';

const configuration = new Configuration({
    apiKey: "YOUR-KEY-HERE"
});

const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
    // { image: "ASDFASDFASDF base64 string" }
    const { image } = await request.json();

    const response = await openai.createChatCompletion({
        model: "gpt-4-vision-preview",
        stream: true,
        max_tokens: 4096, 
        messages: [ 
            {
                role: "user",
                //@ts-ignore
                content: [
                    { type: "text", text: "Given the advances in technology and adaptive strategies in agriculture, will the object in this image face major impacts from climate change? Begin your response with Yes or No followed by a comma, and provide a brief explanation. Respond in 2-3 sentences" },
                    {
                        type: "image_url",
                        image_url: image // base64 images
                    }
                ]
            }
        ]
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
}