// OcrService.js
const { createWorker } = require('tesseract.js');

class OcrService {
    constructor(apiKey, apiEndpoint) {
        this.apiKey = apiKey || process.env.OCR_API_KEY;
        this.apiEndpoint = apiEndpoint || process.env.OCR_API_ENDPOINT;

    }

    async processImage(imageBuffer) {
        try {
            if (!this.apiKey) {
                throw new Error('OCR API key not configured');
            }

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image: imageBuffer.toString('base64')
                })
            });

            if (!response.ok) {
                throw new Error(`OCR service responded with status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('OCR Processing Error:', error);
            throw error;
        }
    }

    async processImageFromUrl(imageUrl) {
        try {
            const response = await fetch(imageUrl);
            const imageBuffer = await response.buffer();
            return this.processImage(imageBuffer);
        } catch (error) {
            console.error('Error fetching image from URL:', error);
            throw error;
        }
    }

    async processImageLocally(imagePath) {
        try {
            const worker = await createWorker('eng');
            const result = await worker.recognize(imagePath);
            await worker.terminate();
            return result.data;
        } catch (error) {
            console.error('Error processing image locally:', error);
            throw error;
        }
    }
}

module.exports = OcrService;