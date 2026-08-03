import axios from "axios";

const productApiInstance=axios.create({
    baseURL:"/api/products",
    withCredentials:true
})

export async function createProducts(formData) {
    const response=await productApiInstance.post("/",formData,{headers:{"Content-Type":"multipart/form-data"}})
    return response.data
}

export async function getSellerProducts() {
    const response=await productApiInstance.get("/seller")
    return response.data
}
export async function getProductById(productId){
    const response=await productApiInstance.get(`/detail/${productId}`)
    return response.data
}

export async function addProductVariant(productId,newProductVariant){
    const formData=new FormData()
    newProductVariant.images.forEach((image) => {
        formData.append("images", image)
    })
    formData.append("stock",newProductVariant.stock)
    formData.append("priceAmount",newProductVariant.price)
    formData.append("attributes",JSON.stringify(newProductVariant.attributes))

    if (newProductVariant.priceCurrency) {
        formData.append("priceCurrency", newProductVariant.priceCurrency)
    }

    const response=await productApiInstance.post(`/${productId}/variants`,formData,{
        headers:{"Content-Type":"multipart/form-data"}
    })
    return response.data

}
