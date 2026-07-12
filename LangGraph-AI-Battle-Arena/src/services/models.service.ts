import {ChatGoogle} from "@langchain/google"
import { ChatMistralAI } from "@langchain/mistralai"
import { ChatCohere } from "@langchain/cohere"
import config from "../config/config.js"
 export const googlemodel= new ChatGoogle({
    model:"gemini-flash-latest",
    apiKey:config.GOOGLE_API_KEY
})

export const mistralai=new ChatMistralAI({
    model:"mistral-medium-latest",
    apiKey:config.MISTRAL_API_KEY
})

export const cohere= new ChatCohere({
    model:"",
    apiKey:config.COHERE_API_KEY
})

