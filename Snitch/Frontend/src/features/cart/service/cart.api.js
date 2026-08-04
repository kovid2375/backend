import axios from "axios";

const cartApiInstance=axios.create({
    baseURL:"/api/cart",
    withCredentials:true
})

export const addCartItemApi = async ({ productId, variantId, quantity = 1 }) => {
    const path = variantId ? `/add/${productId}/${variantId}` : `/add/${productId}`
    const response=await cartApiInstance.post(path,{
        quantity
    })
        
    return response.data
}

export const getCart=async ()=>{
    const response=await cartApiInstance.get("/")
    return response.data
}

export const incrementCartItemApi=async({productId,variantId})=>{
    const path = variantId ? `/quantity/increment/${productId}/${variantId}` : `/quantity/increment/${productId}`
    const response=await cartApiInstance.patch(path)
    return response.data
}
