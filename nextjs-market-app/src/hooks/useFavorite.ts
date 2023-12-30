import { User } from "@prisma/client";
import React, { useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
      toast.warn("먼저 로그인을 해주세요.");
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
      toast.success("성공했습니다.");
    } catch (err) {
      toast.error("실패했습니다.");
    }
  };

  return {
    hasFavorited,
    toggleFavorite,
  };
};

export default useFavorite;
