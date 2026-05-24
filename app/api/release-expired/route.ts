export const dynamic = "force-dynamic";

import { prisma } from "../../../src/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {

    const expiredReservations = await prisma.reservation.findMany({
      where: {
        status: "PENDING",
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    for (const reservation of expiredReservations) {

      await prisma.inventory.updateMany({
        where: {
          productId: reservation.productId,
          warehouseId: reservation.warehouseId,
        },
        data: {
          reservedQuantity: {
            decrement: reservation.quantity,
          },
        },
      });

      await prisma.reservation.update({
        where: {
          id: reservation.id,
        },
        data: {
          status: "RELEASED",
        },
      });

    }

    return NextResponse.json({
      released: expiredReservations.length,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );

  }
}