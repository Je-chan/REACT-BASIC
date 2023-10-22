/**
 *  route.ts 를 사용하게 되면 API 를 만드는 것과 동일함
 */

// GET 요청
export async function GET(request: Request) {
  return new Response("HELLO, GET WORLD!");
}

// POST 요청
export async function POST(request: Request) {
  return new Response("HELLO, POST WORLD!");
}
