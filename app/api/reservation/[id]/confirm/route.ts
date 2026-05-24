import { prisma } from "../../../../../src/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
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
        { error: "Reservation already processed" },
        { status: 400 }
      );
    }

    if (new Date() > reservation.expiresAt) {
      return NextResponse.json(
        { error: "Reservation expired" },
        { status: 410 }
      );
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: {
        status: "CONFIRMED",
      },
    });

    return NextResponse.json(updatedReservation);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}