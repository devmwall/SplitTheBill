// ChatGptService.js
const { OpenAI } = require('openai');
const config = require('../config/config');

// Initialize the OpenAI client with your API key

class ChatGptService {
    constructor(){
        this.openai = new OpenAI({
            apiKey: config.openAiApiKey, // Replace this with your actual OpenAI API key
        });
    }

    
    async retrieveReceiptJson(receiptData) {
        console.log("Making openAI api call");
        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    "role": "developer",
                    "content": "You are a receipt extraction assistant. Your task is to parse receipts and extract the following information in JSON format: 1) An array of all purchased items, where each item is an object with the fields 'name' and 'price'. If a quantity is present, include a 'quantity' field as well. 2) The 'tax' as a separate field with its amount. 3) The 'total' as a separate field with its amount."
                },
                {
                    "role": "user",
                    "content": receiptData
                }

            ],

        })
        console.log(completion);
        return completion.choices[0].message;

    };


}

module.exports = ChatGptService;