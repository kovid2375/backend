import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/state/auth.slice'
import productReducer from '../features/sellerProduct/state/product.slice'
import buyerProductReducer from '../features/buyerProduct/state/buyerProduct.slice'
import cartReducer from '../features/cart/state/cart.slice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        buyerProduct: buyerProductReducer,
        cart: cartReducer
    }
})
