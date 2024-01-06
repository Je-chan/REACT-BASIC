"use client";

import React from "react";
import { Product, User } from "@prisma/client";

interface ProductClientProps {
  product: Product & { user: User };
  currentUser?: User | null;
}

const ProductClient = ({ product, currentUser }: ProductClientProps) => {
  return <div>PRODUCT CLIENT</div>;
};

export default ProductClient;
