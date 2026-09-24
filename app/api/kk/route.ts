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
    try {
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

        const updatedProducts = [...products, newProduct];

        await store.setJSON("products", updatedProducts);

        // Potwierdzamy, że zapis jest już dostępny
        const savedProducts = await store.get("products", {
            type: "json",
        });

        if (!savedProducts) {
            return NextResponse.json(
                { error: "Product was not saved" },
                { status: 500 }
            );
        }

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}