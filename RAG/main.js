import{PDFLoader} from "@langchain/community/document_loaders/fs/pdf"
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters"
import {MistralAIEmbeddings} from "@langchain/mistralai"
import {Pinecone} from "@pinecone-database/pinecone"
import dotenv from "dotenv"
dotenv.config();
const pc=new Pinecone({apiKey:process.env.PINECONE_API_KEY})
const index = pc.index("cohort2-rag")
// const loader = new PDFLoader("./story.pdf")
// const docs = await loader.load()
const embeddings= new MistralAIEmbeddings({
    apiKey:process.env.MISTRAL_API_KEY,
    model:"mistral-embed",
})
// const splitter = new RecursiveCharacterTextSplitter({
//     chunkSize : 500,
//     chunkOverlap: 0,
// })
// const chunks = await splitter.splitDocuments(docs)
// console.log(chunks)

// const vectors = await Promise.all(chunks.map(async(chunk)=>{
//     const embedding = await embeddings.embedQuery(chunk.pageContent)
//     return {
//         text:chunk.pageContent,
//         metadata:chunk.metadata,
//         embedding:embedding
//     }
// }))
// const result = await index.upsert({
//     records:vectors.map((doc,i)=>({
//         id:`doc-${i}`,
//         values:doc.embedding,
//         metadata:{
//             text:doc.text
//         }
//     }))
// })
// console.log(result)

const queryEmbedding = await embeddings.embedQuery("how was the internship experience?")
console.log(queryEmbedding)

const result=await index.query({
    topK:3,
    vector:queryEmbedding,
    includeMetadata:true,
})
console.log(JSON.stringify(result))


