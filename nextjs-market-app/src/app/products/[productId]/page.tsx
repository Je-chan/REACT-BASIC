import React from "react";
import getProductById from "@/app/actions/getProductById";
import getCurrentUser from "@/app/actions/getCurrentUser";
import EmptyState from "@/components/EmptyState";
import ProductClient from "@/app/products/[productId]/ProductClient";

interface Params {
  productId?: string;
}

const ProductPage = async ({ params }: { params: Params }) => {
  const product = await getProductById(params);

  const currentUser = await getCurrentUser();

  console.log("product", product);

  if (!product) {
    return <EmptyState />;
  }

  return <ProductClient product={product} currentUser={currentUser} />;
};

export default ProductPage;
