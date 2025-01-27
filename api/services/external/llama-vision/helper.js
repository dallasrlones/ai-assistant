const axios = require('axios');
const aiRoot = 'http://host.docker.internal:11434/api/generate';

const buildLlamaVisionPayload = (prompt, base64Image) => {
    if (!prompt || !base64Image) {
        throw new Error('Both prompt and base64Image are required');
    }
    const payload = { model: 'llama3.2-vision:11b', prompt, images: [base64Image] };
    return payload;
};

const analyzeImageLlamaVision = async (payload, base64Image) => {
    try {
        const response = await axios.post(aiRoot, payload, { responseType: 'stream' });

        let buffer = '';
        let finalResponse = '';

        return new Promise((resolve, reject) => {
            response.data.on('data', (chunk) => {
                buffer += chunk.toString();
                try {
                    const data = JSON.parse(buffer);
                    buffer = '';
                    if (data.response) { finalResponse += data.response; }
                    if (data.done) { resolve(finalResponse.trim()); }
                } catch (err) {
                    // Ignore incomplete JSON; wait for more chunks
                }
            });

            response.data.on('end', () => {
                if (!finalResponse) {
                    reject(new Error('Empty response received from API.'));
                }
            });

            response.data.on('error', (err) => {
                console.error('Stream error:', err);
                reject(err);
            });
        });
    } catch (error) {
        console.error('Error in analyzeImage:', error);
        throw new Error('Failed to analyze the image.');
    }
};

module.exports = { analyzeImageLlamaVision, buildLlamaVisionPayload }