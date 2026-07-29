import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as productsApi from "../api/products";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: productsApi.fetchProducts,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsApi.createProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product added");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Failed to add product");
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsApi.updateProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Failed to update");
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsApi.deleteProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Failed to delete");
    },
  });
}
