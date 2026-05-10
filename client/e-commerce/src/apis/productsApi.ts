import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const getProducts = async () => {
  const response = await api.get("/products");

  return response.data;
};

import { useEffect, useState } from "react";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();

      setProducts(data);

      setLoading(false);
    }

    fetchProducts();
  }, []);

  return { products, loading };
};

export default useProducts;
