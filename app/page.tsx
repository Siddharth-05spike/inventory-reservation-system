"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type WarehouseStock = {
  warehouseId: string;
  warehouseName: string;
  totalQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
};

type Product = {
  id: string;
  name: string;
  warehouses: WarehouseStock[];
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const response = await fetch("/api/products");

    const data = await response.json();

    setProducts(data);
  }

  async function reserveProduct(
    productId: string,
    warehouseId: string
  ) {
    try {
      setLoading(true);

      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          warehouseId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      alert("Reservation created");

      router.push(`/reservation/${data.id}`);

    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f7fb",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "40px",
          fontWeight: "bold",
          marginBottom: "40px",
          color: "#111827",
        }}
      >
        Inventory Reservation System
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "24px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow:
                "0 4px 14px rgba(0,0,0,0.08)",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#111827",
              }}
            >
              {product.name}
            </h2>

            {product.warehouses.map((warehouse) => (
              <div
                key={warehouse.warehouseId}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "16px",
                }}
              >
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#111827",
                  }}
                >
                  {warehouse.warehouseName}
                </h3>

                <p
                  style={{
                    marginTop: "8px",
                    color: "#374151",
                  }}
                >
                  Available Stock:{" "}
                  <strong>
                    {warehouse.availableQuantity}
                  </strong>
                </p>

                <button
                  disabled={
                    warehouse.availableQuantity <= 0 ||
                    loading
                  }
                  onClick={() =>
                    reserveProduct(
                      product.id,
                      warehouse.warehouseId
                    )
                  }
                  style={{
                    marginTop: "16px",
                    width: "100%",
                    backgroundColor:
                      warehouse.availableQuantity > 0
                        ? "#2563eb"
                        : "#9ca3af",
                    color: "white",
                    border: "none",
                    padding: "12px",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    cursor:
                      warehouse.availableQuantity > 0
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  {warehouse.availableQuantity > 0
                    ? "Reserve"
                    : "Out of Stock"}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}