import { createSlice } from "@reduxjs/toolkit"; 
const buyerProductSlice=createSlice({
    name:"buyerProduct",
    initialState:{
        products:[],
        loading:false,
        error:null
    },
    reducers:{
        setProducts:(state,action)=>{
            state.products=action.payload
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        },
        setError:(state,action)=>{
            state.error=action.payload
        }
    }
})

export const { setProducts, setLoading, setError } = buyerProductSlice.actions
export default buyerProductSlice.reducer