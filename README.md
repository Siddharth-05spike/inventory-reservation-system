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

# Output Screen Shots
<img width="1920" height="1080" alt="Screenshot (193)" src="https://github.com/user-attachments/assets/6957246c-29f9-47d8-ac41-dab677768aea" />
<img width="1920" height="1080" alt="Screenshot (183)" src="https://github.com/user-attachments/assets/43f91e4f-197f-40ce-badf-8d557972532f" />
<img width="1920" height="1080" alt="Screenshot (186)" src="https://github.com/user-attachments/assets/2b3cce6e-b7ba-416e-b6e1-77b32cc3db4f" />
<img width="1920" height="1080" alt="Screenshot (187)" src="https://github.com/user-attachments/assets/d9a28910-6396-464c-9cc0-1bebb29e934b" />
<img width="1920" height="1080" alt="Screenshot (188)" src="https://github.com/user-attachments/assets/0c2baed0-06de-4d57-bb5d-5a5f0f06c6ee" />
<img width="1920" height="1080" alt="Screenshot (189)" src="https://github.com/user-attachments/assets/380a524d-7ca0-4752-b373-4f710d41f343" />
<img width="1920" height="1080" alt="Screenshot (190)" src="https://github.com/user-attachments/assets/cb05db59-c447-418c-b56b-afa5b4a69c03" />
<img width="1920" height="1080" alt="Screenshot (191)" src="https://github.com/user-attachments/assets/6cf01fc7-8657-4600-bc96-358b62f32b07" />
<img width="1920" height="1080" alt="Screenshot (192)" src="https://github.com/user-attachments/assets/1b19faee-dad2-4511-bfbc-5f3066683e11" />


