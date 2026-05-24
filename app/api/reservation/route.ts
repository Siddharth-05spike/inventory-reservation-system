export const dynamic = "force-dynamic";

import { prisma } from "../../../src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { productId, warehouseId, quantity } = body;

    if (!productId || !warehouseId || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const reservation = await prisma.$transaction(async (tx) => {

      const inventory = await tx.inventory.findFirst({
        where: {
          productId,
          warehouseId,
        },
      });

      if (!inventory) {
        throw new Error("Inventory not found");
      }

      const updateResult = await tx.inventory.updateMany({
        where: {
          id: inventory.id,
          reservedQuantity: {
            lte:
              inventory.totalQuantity - quantity,
          },
        },
        data: {
          reservedQuantity: {
            increment: quantity,
          },
        },
      });

      if (updateResult.count === 0) {
        throw new Error("Not enough stock available");
      }

      return await tx.reservation.create({
        data: {
          productId,
          warehouseId,
          quantity,
          status: "PENDING",
          expiresAt: new Date(
            Date.now() + 5 * 60 * 1000
          ),
        },
      });

    });

    return NextResponse.json(reservation);

  } catch (error: any) {

    console.error(error);

    if (error.message === "Inventory not found") {
      return NextResponse.json(
        { error: "Inventory not found" },
        { status: 404 }
      );
    }

    if (
      error.message ===
      "Not enough stock available"
    ) {
      return NextResponse.json(
        { error: "Not enough stock available" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );

  }
}