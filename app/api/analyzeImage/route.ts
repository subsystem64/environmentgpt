import { Configuration, OpenAIApi } from "openai-edge"
import { OpenAIStream, StreamingTextResponse } from "ai"

export const runtime = 'edge';

const configuration = new Configuration({
    apiKey: "sk-proj-vTXbJRG3oft8qESAzSw6T3BlbkFJmwifXtrHdiFGvTJlMVbe"
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
                    { type: "text", text: "Will the object in this image still exist in the future with climate change?" },
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