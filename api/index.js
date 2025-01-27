const express = require('express');
const multer = require('multer')
const cors = require('cors'); // Import the cors middleware
const fs = require('fs')

const app = express();
const port = 1337;

const { sendTextPrompt, analyzeImage } = require('./services/external/aiService');

// Enable CORS with default settings
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));

// Middleware to parse JSON request bodies
app.use(express.json());
const upload = multer({ dest: 'uploads/' });

app.post('/analyze-image', upload.single('image'), async (req, res) => {
    try {
        const imagePath = req.file.path;
        const imageData = fs.readFileSync(imagePath);
        const prompt = req.body.prompt;

        const base64Image = imageData.toString('base64');

        const response = await analyzeImage(prompt, base64Image)
        const description = response;

        res.json({ description, base64Image });
        fs.unlinkSync(imagePath);
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Failed to process image' });
    }
});

app.post('/ask', async (req, res) => {
    const { prompt, history } = req.body;
    const streamResponse = req.query.stream === 'true';
    // console.log(`asking: ${prompt}, streaming: ${streamResponse}, history: ${JSON.stringify(history)}`);

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        if (streamResponse) {
            await sendTextPrompt(prompt, true, (data) => {
                res.write(`${JSON.stringify(data)}\n`);
            }, history || []);
            res.end();
        } else {
            const result = await sendTextPrompt(prompt, false, null, history || []);
            res.json(result);
        }
    } catch (error) {
        console.error('Error:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        }
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
