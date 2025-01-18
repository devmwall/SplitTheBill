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
    async processImage(imageData) {
        // Process the image using OCR service
        //const ocrResult = await this.OcrService.processImageLocally(imageData.path);
        //const chatGptResults = //await this.ChatGptService.retrieveReceiptJson(ocrResult.text);
        //const parsedContent = parseContent(chatGptResults.content)
        //console.log(parsedContent);
        return importedObject;
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