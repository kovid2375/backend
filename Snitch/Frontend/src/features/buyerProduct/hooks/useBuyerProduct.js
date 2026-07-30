import { getAllProducts } from "../services/buyerProduct.api";
import { useDispatch } from "react-redux";
import { setProducts, setLoading, setError } from "../state/buyerProduct.slice";

export const useBuyerProduct = () => {
    const dispatch = useDispatch();

    async function handleGetAllProducts() {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await getAllProducts();
            dispatch(setProducts(data.products));
            return data.products;
        } catch (error) {
            console.log(error);
            dispatch(setError(error.response?.data?.message || "Failed to fetch products"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return { handleGetAllProducts };
};