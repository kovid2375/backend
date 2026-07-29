import { useDispatch, useSelector } from "react-redux";
import { createProducts, getSellerProducts } from "../services/product.api";
import {
  setSellerProducts,
  setProductLoading,
  setProductError,
} from "../state/product.slice";

export const useProduct = () => {
  const dispatch = useDispatch();
  const { sellerProducts, loading, error } = useSelector(
    (state) => state.product
  );

  async function handleCreateProduct(formData) {
    dispatch(setProductLoading(true));
    dispatch(setProductError(null));
    try {
      const data = await createProducts(formData);
      dispatch(setSellerProducts([data.product, ...sellerProducts]));
      return data.product;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to create product";
      dispatch(setProductError(message));
      throw err;
    } finally {
      dispatch(setProductLoading(false));
    }
  }

  async function handleGetSellerProducts() {
    dispatch(setProductLoading(true));
    dispatch(setProductError(null));
    try {
      const data = await getSellerProducts();
      dispatch(setSellerProducts(data.products));
      return data.products;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to fetch products";
      dispatch(setProductError(message));
      throw err;
    } finally {
      dispatch(setProductLoading(false));
    }
  }

  return {
    sellerProducts,
    loading,
    error,
    handleCreateProduct,
    handleGetSellerProducts,
  };
};
