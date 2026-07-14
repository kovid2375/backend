import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere } from "@langchain/cohere";
import { ChatOpenAI } from "@langchain/openai";
import config from "../config/config.js";



export const geminiModel = new ChatGoogle({
    model: "gemini-2.5-pro",
    apiKey: config.GOOGLE_API_KEY,
})

export const mistralAIModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: config.MISTRALAI_API_KEY,
})


export const cohereModel = new ChatCohere({
    model: "command-a-03-2025",
    apiKey: config.COHERE_API_KEY,
})

export const openaiModel = new ChatOpenAI({
    model: "gpt-4o-mini",
    apiKey: config.OPENAI_API_KEY,
})