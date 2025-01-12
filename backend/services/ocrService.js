// backend/services/OcrService.js
class OcrService {
    constructor(apiKey, apiEndpoint) {
        this.apiKey = apiKey ||   process.env.OCR_API_KEY,
        this.apiEndpoint = apiEndpoint || process.env.OCR_API_ENDPOINT;
    }

    async processImage(imageBuffer) {
        try {
            if (!this.apiKey) {
                throw new Error('OCR API key not configured');
            }

            // Here you would implement the actual OCR API call
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

            const result = await response.json();
            return result;
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
}

module.exports = OcrService;