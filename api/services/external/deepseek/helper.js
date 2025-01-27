const axios = require('axios');
const aiRoot = 'http://host.docker.internal:11434/api/generate';

const debug = false;

const buildDeepSeekPayload = (model, prompt, history=[], directions=[]) => {
    if (!prompt) {
        throw new Error('Prompt is required');
    }
    if (!model) {
        throw new Error('Model is required');
    }
    let startingDirectionIndex = 0;

    let builtPrompt = '';

    builtPrompt += directions.map(direction => {
        startingDirectionIndex += 1;
        return startingDirectionIndex + ': ' + direction
    }).join('\n')

    builtPrompt += `Context: ${history.map(({ role, content }) => `${role}: ${content.trim()}`).join(' ')}\n`
    builtPrompt += `Question: ${prompt}\n`
    builtPrompt += 'Answer:'

    const payload = {
        model,
        prompt: builtPrompt
    }
    return payload;
}

const handleDeepseekCall = async (payload, streamResponse = false, onStream = null) => {
    try {
        if (debug) console.log('payload', payload);
        const response = await axios.post(aiRoot, payload, { responseType: 'stream' });

        let buffer = '';
        let result = { success: true, done: false, answer: [], thoughts: [], isThinking: false };

        return new Promise((resolve, reject) => {
            response.data.on('data', (chunk) => {
                buffer += chunk.toString();

                try {
                    const data = JSON.parse(buffer);
                    buffer = '';

                    if (debug) console.log(`data: ${JSON.stringify(data)}`);

                    if (data.response === '<think>') {
                        result.isThinking = true;
                    } else if (data.response === '</think>') {
                        result.isThinking = false;
                    } else if (result.isThinking) {
                        result.thoughts.push(data.response);
                        if (streamResponse && onStream) {
                            if (debug) console.log('thinking data', data);
                            onStream({ type: 'T', value: data.response });
                        }
                    } else {
                        result.answer.push(data.response);
                        if (streamResponse && onStream) {
                            if (debug) console.log('answer data', data);
                            onStream({ type: 'A', value: data.response });
                        }
                    }
                } catch (err) {
                    console.log("Error parsing part in handleDeepseekCall", err)
                }
            });

            response.data.on('end', () => {
                result.done = true;
                result.answer = result.answer.join('').trim();
                result.thoughts = result.thoughts.join(' ').trim();
                resolve(result);
            });

            response.data.on('error', (err) => {
                console.error('Stream error:', err.message);
                reject(err);
            });
        });
    } catch (error) {
        console.error('Error:', error.message);
        throw new Error('Failed to process the AI service request');
    }
};

module.exports = { buildDeepSeekPayload, handleDeepseekCall }