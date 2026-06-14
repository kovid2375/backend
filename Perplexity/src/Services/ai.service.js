import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const model = new ChatGoogleGenerativeAI({    model:"gemini-3.5-flash",
    apiKey:process.env.GEMINI_API_KEY
})


export async function testAi(){
    model.invoke("explain ai in 100 words?").then((response)=>{
        console.log(response.text)
    })
}
export async function hello() {
    console.log(
        'hello'
    )
    
}