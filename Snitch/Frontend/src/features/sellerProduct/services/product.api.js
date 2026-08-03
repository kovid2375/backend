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
    const response=await productApiInstance.get(`/details/${productId}`)
    return response.data
}

export async function addProductVariant(procuctId,newProductVariant){
    console.log(newProductVariant)
    const formData=new FormData()
    newProductVariant.images.array.forEach(image => {
        formData.append(`images`,image.file)
    });
    formData.append("stock",newProductVariant.stock)
    formData.append("priceAmount",newProductVariant.price)
    formData.append("attributes",JSON.stringify(newProductVariant.attributes))

    const response=await productApiInstance.post(`/${procuctId}/variants`,formData)
    return response.data

}