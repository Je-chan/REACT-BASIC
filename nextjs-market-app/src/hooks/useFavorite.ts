import { User } from "@prisma/client";
import React, { useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface UseFavorite {
  productId: string;
  currentUser?: User | null;
}

const useFavorite = ({ productId, currentUser }: UseFavorite) => {
  const router = useRouter();
  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];

    return list.includes(productId);
  }, [currentUser, productId]);

  const toggleFavorite = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!currentUser) {
      return;
    }

    try {
      let request;

      if (hasFavorited) {
        request = () => axios.delete(`/api/favorites/${productId}`);
      } else {
        request = () => axios.post(`/api/favorites/${productId}`);
      }

      await request();

      // 데이터를 업데이트 한 다음에 바로 화면에 반영해주기 위함
      // Next.js 13 이 추천하는 방식
      router.refresh();
    } catch (err) {}
  };

  return {
    hasFavorited,
    toggleFavorite,
  };
};

export default useFavorite;
