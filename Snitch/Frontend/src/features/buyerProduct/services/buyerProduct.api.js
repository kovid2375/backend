import axios from "axios";

const buyerProductApiInstance=axios.create({
    baseURL:"/api/products",
    withCredentials:true
})

export async function getAllProducts() {
    const response=await buyerProductApiInstance.get("/buyer")
    return response.data
}

export async function getBuyerProductById(productId) {
    const response = await buyerProductApiInstance.get(`/detail/${productId}`)
    return response.data
}
