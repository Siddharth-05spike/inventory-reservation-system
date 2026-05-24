# Inventory Reservation System

A full-stack inventory reservation system built with Next.js, Prisma, PostgreSQL (Neon), and TypeScript.

The application allows users to reserve products from warehouses, confirm purchases, cancel reservations, and automatically release expired reservations.

---

# Features

## Backend

- Product and warehouse inventory management
- Reservation system with:
  - PENDING
  - CONFIRMED
  - CANCELLED
  - RELEASED statuses
- Reservation expiry handling
- Automatic stock restoration
- Concurrency-safe reservation logic
- REST APIs using Next.js App Router

## Frontend

- Product listing page
- Real-time stock display
- Reserve product flow
- Reservation checkout page
- Live countdown timer
- Confirm purchase button
- Cancel reservation button
- Automatic UI updates after actions

---

# Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- Tailwind CSS
- React

---

# API Endpoints

## Products

### GET `/api/products`

Returns all products with stock availability per warehouse.

---

## Warehouses

### GET `/api/warehouses`

Returns all warehouses.

---

## Reservations

### POST `/api/reservation`

Creates a reservation.

Returns:
- `200` on success
- `409` if stock is unavailable

---

### POST `/api/reservation/:id/confirm`

Confirms a reservation.

Returns:
- `200` on success
- `410` if reservation expired

---

### POST `/api/reservation/:id/cancel`

Cancels a reservation and restores stock.

---

### POST `/api/release-expired`

Releases expired reservations automatically.

---

# Database Schema

Main entities:

- Product
- Warehouse
- Inventory
- Reservation

Inventory tracks:
- totalQuantity
- reservedQuantity
- availableQuantity

Reservations contain:
- status
- quantity
- expiresAt

---

# Concurrency Handling

The reservation endpoint is designed to be concurrency-safe.

Implementation approach:
- Prisma database transactions
- Atomic conditional inventory updates using `updateMany`
- Stock updates occur only if enough inventory is available

This guarantees that when two requests attempt to reserve the final unit simultaneously:
- only one succeeds
- the other receives a `409 Conflict`

---

# Reservation Expiry

Reservations contain an `expiresAt` timestamp.

Expired reservations are released using:
- `/api/release-expired`

This endpoint:
1. Finds expired PENDING reservations
2. Restores reserved stock
3. Updates reservation status to RELEASED

In production this can be triggered using:
- Vercel Cron Jobs
- Background workers
- Scheduled jobs

---

# Running Locally

## 1. Clone repository

```bash
git clone <repo-url>