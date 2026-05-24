"use client";

import { useEffect, useState } from "react";

type Reservation = {
  id: string;
  status: string;
  expiresAt: string;
};

export default function ReservationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [reservation, setReservation] =
    useState<Reservation | null>(null);

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    loadReservation();
  }, []);

  async function loadReservation() {
    const { id } = await params;

    const response = await fetch(
      `/api/reservation/${id}`
    );

    const data = await response.json();

    setReservation(data);
  }

  useEffect(() => {
    if (!reservation) return;

    const interval = setInterval(() => {
      const expiry =
        new Date(reservation.expiresAt).getTime();

      const now = new Date().getTime();

      const difference = expiry - now;

      if (difference <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
        return;
      }

      const seconds = Math.floor(difference / 1000);

      setTimeLeft(`${seconds}s`);

    }, 1000);

    return () => clearInterval(interval);

  }, [reservation]);

  async function confirmReservation() {
    if (!reservation) return;

    const response = await fetch(
      `/api/reservation/${reservation.id}/confirm`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    alert(data.status || data.error);

    loadReservation();
  }

  async function cancelReservation() {
    if (!reservation) return;

    const response = await fetch(
      `/api/reservation/${reservation.id}/cancel`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    alert(data.status || data.error);

    loadReservation();
  }

  if (!reservation) {
    return <p>Loading...</p>;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f7fb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          color: "#111827",
          padding: "40px",
          borderRadius: "16px",
          width: "420px",
          boxShadow:
            "0 4px 14px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "24px",
          }}
        >
          Reservation Details
        </h1>

        <p>
          <strong>ID:</strong> {reservation.id}
        </p>

        <p style={{ marginTop: "10px" }}>
          <strong>Status:</strong>{" "}
          {reservation.status}
        </p>

        <p style={{ marginTop: "10px" }}>
          <strong>Expires In:</strong>{" "}
          {timeLeft}
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "30px",
          }}
        >
          <button
            onClick={confirmReservation}
            style={{
              flex: 1,
              backgroundColor: "#16a34a",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Confirm
          </button>

          <button
            onClick={cancelReservation}
            style={{
              flex: 1,
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}