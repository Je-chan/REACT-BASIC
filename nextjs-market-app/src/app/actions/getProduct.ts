import prisma from "@/helpers/prismadb";
import { PRODUCTS_PER_PAGE } from "@/constants";

export interface ProductsParams {
  latitude?: number;
  longitude?: number;
  category?: string;
  page?: number;
  skip?: number;
}

export default async function getProducts(params: ProductsParams) {
  try {
    const { latitude, longitude, category, skip } = params;

    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (latitude) {
      query.latitude = {
        // 범위 지정
        gte: Number(latitude) - 0.01,
        lte: Number(latitude) + 0.01,
      };
    }

    if (longitude) {
      query.longitude = {
        gte: Number(longitude) - 0.01,
        lte: Number(longitude) + 0.01,
      };
    }

    // 개수만 세는 메서드(count)
    const totalItems = await prisma.product.count({ where: query });

    const products = await prisma.product.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
      take: PRODUCTS_PER_PAGE,
      skip: skip ? Number(skip) : 0,
    });

    return {
      data: products,
      totalItems,
    };
  } catch (err: any) {
    throw new Error(err);
  }
}
