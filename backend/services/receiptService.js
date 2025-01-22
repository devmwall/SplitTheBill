// ReceiptService.js
const config = require('../config/config');
const OcrService = require('../services/ocrService');
const ChatGptService = require('../services/chatGptService');
const importedObject = require('../testing.json')
const { nanoid } = require('nanoid');
const Receipt  = require('../models/receipt')

class ReceiptService {
    constructor(){
        this.OcrService = new OcrService();
        this.ChatGptService = new ChatGptService();
    }

    parseContent(content) {
        // Remove the ```json and ``` markers
        const cleanedContent = content.replace(/```json\n/, '').replace(/```$/, '');
      
        // Parse the JSON string
        try {
            const parsed = JSON.parse(cleanedContent);
            return parsed;
        } catch (error) {
            console.error("Failed to parse JSON:", error);
            return null;
        }
      }

    async processImage(imageData) {
        // Process the image using OCR service
        const ocrResult = await this.OcrService.processImageLocally(imageData.path);
        const chatGptResults = await this.ChatGptService.retrieveReceiptJson(ocrResult.text);
        const parsedContent = this.parseContent(chatGptResults.content);
        //console.log(parsedContent);
        return parsedContent;
        /*
          1.Now that we have analyzed content, we need to generate them a random site
          2. This will use mongodb to create a url that corresponds to the list
        */
    }

    

    //URL Will be test/nanoid
    async generateUrl(imageReturnObject){
        const urlKey = nanoid(10);
        const receiptVal = new Receipt({
            receiptId: urlKey,
            receiptObject: imageReturnObject,
            receiptClaims: null
        })
        await receiptVal.save();
        return receiptVal;
    }




}

module.exports = ReceiptService;