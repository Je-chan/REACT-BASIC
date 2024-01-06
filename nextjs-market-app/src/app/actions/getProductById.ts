import prismadb from "@/helpers/prismadb";

interface Params {
  productId?: string;
}

export default async function getProductById(params: Params) {
  try {
    const { productId } = params;

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        user: true,
      },
    });

    if (!product) {
      return null;
    }

    return product;
  } catch (err) {
    throw new Error("상품 불러오기 실패");
  }
}
