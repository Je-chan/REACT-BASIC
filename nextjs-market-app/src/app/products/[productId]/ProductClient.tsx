"use client";

import React from "react";
import { Product, User } from "@prisma/client";
import Container from "@/components/Container";
import ProductHead from "@/components/products/ProductHead";
import ProductInfo from "@/components/products/ProductInfo";
import dynamic from "next/dynamic";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { categories } from "@/components/categories/Categories";

interface ProductClientProps {
  product: Product & { user: User };
  currentUser?: User | null;
}

const ProductClient = ({ product, currentUser }: ProductClientProps) => {
  const router = useRouter();

  const KakaoMap = dynamic(() => import("../../../components/KakaoMap"), {
    ssr: false,
  });

  const category = categories.find(
    (category) => category.path === product.category,
  );

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto ">
        <div className="flex flex-col gap-6">
          <ProductHead
            title={product.title}
            imageSrc={product.imageSrc}
            id={product.id}
            currentUser={currentUser}
          />
          <div className="grid grid-cols-1 mt-6 md:grid-cols-7 md:gap-10">
            <ProductInfo
              user={product.user}
              category={category}
              createdAt={product.createdAt}
              description={product.description}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <KakaoMap
                detailPage
                latitude={product.latitude}
                longitude={product.longitude}
              />
            </div>
          </div>
        </div>
        <div>
          <Button
            label={"이 유저와 채팅하기"}
            onClick={() => router.push("/chat")}
          />
        </div>
      </div>
    </Container>
  );
};

export default ProductClient;
