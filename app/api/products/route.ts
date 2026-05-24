export const dynamic = "force-dynamic";

import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        inventories: {
          include: {
            warehouse: true,
          },
        },
      },
    });

    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      warehouses: product.inventories.map((inventory) => ({
        warehouseId: inventory.warehouse.id,
        warehouseName: inventory.warehouse.name,
        totalQuantity: inventory.totalQuantity,
        reservedQuantity: inventory.reservedQuantity,
        availableQuantity:
          inventory.totalQuantity - inventory.reservedQuantity,
      })),
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
