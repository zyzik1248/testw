import { getStore } from "@netlify/blobs";
import { NextResponse } from "next/server";

const store = getStore("products");

export async function GET() {
  const products = await store.get("products", { type: "json" });

  return NextResponse.json(products ?? []);
}

export async function POST(request: Request) {
  const product = await request.json();

  const products = (await store.get("products", {
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