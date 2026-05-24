export const dynamic = "force-dynamic";

import { prisma } from "../../../../../src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    if (reservation.status !== "PENDING") {
      return NextResponse.json(
        { error: "Only pending reservations can be cancelled" },
        { status: 400 }
      );
    }

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

    const cancelledReservation = await prisma.reservation.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    });

    return NextResponse.json(cancelledReservation);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}