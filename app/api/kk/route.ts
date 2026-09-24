import { getStore } from "@netlify/blobs";
import { NextResponse } from "next/server";

export async function GET() {
  const store = getStore("products");

  const products = await store.get("products", {
    type: "json",
  });

  return NextResponse.json(products ?? []);
}

export async function POST(request: Request) {
  const store = getStore("products");

  const product = await request.json();

  const products =
    (await store.get("products", {
      type: "json",
    })) ?? [];

  const newProduct = {
    id: crypto.randomUUID(),
    ...product,
  };

  products.push(newProduct);

  await store.setJSON("products", products);

  return NextResponse.json(newProduct, { status: 201 });
}