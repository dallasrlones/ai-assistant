const { buildDeepSeekPayload, handleDeepseekCall } = require('./deepseek/helper');
const { buildLlamaVisionPayload, analyzeImageLlamaVision } = require('./llama-vision/helper')

async function getBasicLevels(prompt, streamResponse, onStream) {
    prompt += '\n' + "What hardness out of <^1^>, <^2^>, or <^3^> is this Question?"
    const response = await sendBasicTextPrompt(prompt, {
        directions: [
            "ONLY return with a single integer, either 1,2, or 3 based on the difficulty of this question. This response will allow me to run a small, medium, and hard model for this prompt.",
            "This response will be parsed as a single integer, only respond with a single character response which will be the hardness level.",
            "Format the response like this <^value^>, so I can capture it, so for example <^1^>, <^2^>, or <^3^>.",
            "If a code example is in the response, return <^3^> hardness level"
        ],
        streamResponse,
        onStream
    });
    return response;
}

const normalDirections = [
    "Be concise and to the point for most responses, unless elaboration is requested.",
    "When asked for detailed information, provide comprehensive explanations.",
    "If you are responding with code, make sure to put it in markup format with its proper language, for example ```javascript and then don't forget to end it with ```.",
    "Use the context if there is any as a reference for previous conversation messages.",
];

async function sendBasicTextPrompt(prompt, { streamResponse = false, onStream = null, history = [], directions = [] }) {
    const payload = buildDeepSeekPayload("deepseek-r1:1.5b", prompt, history, directions);
    console.log('hit basic')
    return await handleDeepseekCall(payload, streamResponse, onStream);
}

async function sendMediumTextPrompt(prompt, { streamResponse = false, onStream = null, history = [] }) {
    const payload = buildDeepSeekPayload("deepseek-r1:8b", prompt, history, normalDirections);
    console.log('hit medium')
    return await handleDeepseekCall(payload, streamResponse, onStream);
}

async function sendHardTextPrompt(prompt, { streamResponse = false, onStream = null, history = [] }) {
    const payload = buildDeepSeekPayload("deepseek-r1:14b", prompt, history, normalDirections);
    console.log('hit hard')
    return await handleDeepseekCall(payload, streamResponse, onStream);
}

async function sendTextPrompt(prompt, streamResponse = false, onStream = null, history = []) {
    try {
        let levelsResponse = await getBasicLevels(prompt, { streamResponse, onStream })

        if (levelsResponse.answer.includes('<^1^>')) {
            return sendBasicTextPrompt(prompt, { streamResponse, onStream, history });
        }

        if (levelsResponse.answer.includes('<^2^>')) {
            return sendMediumTextPrompt(prompt, { streamResponse, onStream, history })
        }

        if (levelsResponse.answer.includes('<^3^>')) {
            return sendHardTextPrompt(prompt, { streamResponse, onStream, history })
        }

        return sendBasicTextPrompt(prompt, { streamResponse, onStream, history });
    } catch (error) {
        console.error('Error:', error.message);
        throw new Error('Failed to process the AI service request');
    }
}

async function analyzeImage(prompt, base64Image) {
    const payload = buildLlamaVisionPayload(prompt, base64Image)
    return await analyzeImageLlamaVision(payload)
}


module.exports = { sendTextPrompt, analyzeImage };
