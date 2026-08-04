import { useDispatch } from "react-redux";
import { setCart,incrementCartItem } from "../state/cart.slice";
import { addCartItemApi, getCart, incrementCartItemApi } from "../service/cart.api";



export const useCart=()=>{
    const dispatch=useDispatch()

    async function handleAddItem({productId,variantId,quantity=1}) {
        const data = await addCartItemApi({productId,variantId,quantity})
        await handleGetCart()
        return data 
    }

    async function handleGetCart() {
        const data = await getCart()
        dispatch(setCart(data.cart))
        return data
    }
    async function handleIncrementCartItem({productId,variantId}) {
        await incrementCartItemApi({productId,variantId})
        dispatch(incrementCartItem({productId,variantId}))
    }


    return{handleAddItem,handleGetCart,handleIncrementCartItem}
}
