import { HumanMessage } from "@langchain/core/messages";
import { StateGraph,StateSchema,MessagesValue,START,END, ReducedValue } from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
import {mistralModel,googleModel,cohereModel} from "./models.service.js"
import {z} from "zod"
import { createAgent, providerStrategy } from "langchain";
const State=new StateSchema({
    messages: MessagesValue,
    solution_1:new ReducedValue(z.string().default(""),{
        reducer:(current,next)=>{
            return next
        }
    }),
    solution_2:new ReducedValue(z.string().default(""),{
        reducer:(current,next)=>{
            return next
        }
    }),
    judge_recommendation: new ReducedValue(z.object({
        solution_1_score: z.number().default(0),
        solution_2_score: z.number().default(0)
    }).default({
        solution_1_score:0,
        solution_2_score:0
    }),
        {
            reducer:(current,next)=>{
                return next
            }
        }
    )
})

const solutionNode:GraphNode<typeof State>= async (state)=>{
    const[mistral_solution,cohere_solution]= await Promise.all([
        mistralModel.invoke(state.messages[0].text),
        cohereModel.invoke(state.messages[0].text)
    ])
    return {
        solution_1:mistral_solution.text,
        solution_2:cohere_solution.text
    }
}
const judgeNode:GraphNode<typeof State>= async (state)=>{
    const {solution_1,solution_2}=state

    const judge=createAgent({
        model:googleModel,
        tools:[],
        responseFormat:providerStrategy(z.object({
            solution_1_score:z.number().min(0).max(10),
            solution_2_score:z.number().min(0).max(10)
        }))
    })
    const judgeResponse=await judge.invoke({
        messages:[
            
        new HumanMessage(
            `You are a judge tasked with evaluating the quality of two solutions to a problem . The problem is :${state.messages[0].text}, the first solution is : ${solution_1}, the second solution is : ${solution_2}, now give your scores to both solution . please provide a score between 0 and 10 for each solution where zero means the solution is completely incorrect or irrelevent, and 10 means the solution is perfect and fully address the problem `
        )
    ]
        
    })
    const result = judgeResponse.structuredResponse
    return{
        judge_recommendation: result
    }
}

const graph = new StateGraph(State)
    .addNode("solution",solutionNode)
    .addNode("judge",judgeNode)
    .addEdge(START,"solution")
    .addEdge("solution","judge")
    .addEdge("judge",END)
    .compile()

export default async function(userMessage:string){
        const result= await graph.invoke({
            messages:[
                new HumanMessage(userMessage)
            ]
        })
        console.log(result)
        return result.messages
    }
