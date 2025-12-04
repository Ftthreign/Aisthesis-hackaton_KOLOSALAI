---
# **AISTHESIS API — Developer Documentation (Final Complete Version)**

Dokumentasi teknis lengkap untuk developer backend & frontend AISTHESIS.
Fokus pada integrasi, JWT auth, analisis AI, dan pengelolaan data.
---

# 🚀 Overview

## Teknologi Utama

- **FastAPI + Async**
- **PostgreSQL + SQLAlchemy 2.0**
- **Alembic Migration**
- **Pydantic v2**
- **Google OAuth ID Token**
- **JWT Access & Refresh Token**
- **Gemini (Vision + LLM)**

---

# 🗂 Project Structure (Backend)

Struktur resmi proyek, supaya setiap developer baru tidak tersesat:

```
app/
│── main.py
│── config.py
│── database.py
│
├── core/
│   ├── auth.py
│   └── ...
│
├── models/
│   ├── base.py
│   ├── user.py
│   ├── oauth.py
│   └── analysis/
│       ├── analysis.py
│       ├── story.py
│       ├── taste.py
│       ├── pricing.py
│       ├── brand_theme.py
│       ├── seo.py
│       ├── marketplace.py
│       ├── persona.py
│       ├── packaging.py
│       ├── action_plan.py
│       └── ...
│
├── schemas/
│   ├── auth.py
│   ├── user.py
│   ├── vision.py
│   ├── analysis.py
│   └── analysis_*.py
│
├── services/
│   ├── users_service.py
│   ├── analysis_service.py
│
├── routers/
│   ├── auth_router.py
│   ├── analysis_router.py
│   ├── history_router.py
│   ├── export_router.py
│
└── prompts/
    ├── vision_prompt.py
    ├── story_prompt.py
    ├── taste_prompt.py
    ├── pricing_prompt.py
    ├── brand_prompt.py
    ├── seo_prompt.py
    ├── marketplace_prompt.py
    ├── persona_prompt.py
    ├── packaging_prompt.py
    ├── action_plan_prompt.py
```

---

# ⚙️ Environment Setup

## 1. Install Dependencies

```
pip install -r requirements.txt
```

## 2. Konfigurasi `.env`

```
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/aisthesis
DATABASE_URL_SYNC=postgresql://user:pass@localhost:5432/aisthesis

SECRET_KEY=<random secret>
ALGORITHM=HS256

GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_API_KEY=your-gemini-api-key

ENVIRONMENT=development
```

## 3. Migration Setup

```
alembic upgrade head
```

## 4. Run Server

```
uvicorn app.main:app --reload
```

---

# 📄 API Documentation URLs

FastAPI menyediakan dokumentasi otomatis:

| Tipe         | URL             |
| ------------ | --------------- |
| Swagger UI   | `/docs`         |
| ReDoc        | `/redoc`        |
| OpenAPI JSON | `/openapi.json` |

---

# 🔐 Authentication System

AISTHESIS memakai gabungan:

- **Google ID Token** → hanya untuk login
- **JWT internal** → untuk semua request selanjutnya

JWT internal berisi:

```json
{ "sub": "<user_uuid>", "exp": <timestamp> }
```

---

# 🧑‍💻 Login Flow (Developer)

### 1. Frontend ambil **Google ID Token**

Dari GIS / One-Tap / NextAuth:

```js
credential = google_id_token;
```

### 2. Kirim ID Token ke backend

```
POST /auth/google/login
{
  "id_token": "<google_id_token>"
}
```

### 3. Backend response

```json
{
  "access_token": "jwt",
  "refresh_token": "jwt",
  "token_type": "bearer"
}
```

### 4. Semua request berikutnya:

```
Authorization: Bearer <access_token>
```

---

# 📌 Authentication Endpoints

---

## **POST /auth/google/login**

Input:

```json
{
  "id_token": "<google_id_token>"
}
```

Response:

```json
{
  "access_token": "jwt",
  "refresh_token": "jwt",
  "token_type": "bearer"
}
```

---

## **GET /auth/profile**

Headers:

```
Authorization: Bearer <access_token>
```

Response:

```json
{
  "id": "uuid",
  "email": "user@gmail.com",
  "name": "User",
  "avatar_url": "...",
  "is_active": true
}
```

---

# 🖼️ Analysis Engine

Endpoint inti untuk analisis AI.

---

## **POST /analysis**

Upload gambar → dikirim ke Gemini Vision → lanjut LLM → simpan ke DB.

### Headers:

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

### Body:

```
file: <image>
```

### Response:

`AnalysisResponse` (struktur lengkap)

Contoh ringkas:

```json
{
  "id": "uuid",
  "image_url": "/uploads/<filename>",
  "vision_result": { ... },
  "story": { ... },
  "taste": { ... },
  "pricing": { ... },
  "brand_theme": { ... },
  "seo": { ... },
  "marketplace": { ... },
  "persona": { ... },
  "packaging": { ... },
  "action_plan": { ... }
}
```

---

# 📜 History Endpoints

---

## **GET /history**

List:

```json
[{ "id": "uuid", "image_url": "/uploads/img.jpg", "created_at": "..." }]
```

---

## **GET /history/{id}**

Detail analisis.

---

## **DELETE /history/{id}**

Response:

```json
{ "message": "deleted" }
```

---

# 📥 Export Endpoints

---

## **GET /export/pdf/{id}**

Mendownload PDF hasil analisis.

Content-Type:

```
application/pdf
```

---

## **GET /export/json/{id}**

```json
{
  "id": "uuid",
  "vision_result": {},
  ...
}
```

---

# 📐 Data Model Summary (Developer)

### **Analysis**

- `id`
- `user_id`
- `image_url`
- `image_filename`
- `vision_result (JSONB)`
- Relationships:

  - story (1–1)
  - taste (1–1)
  - pricing (1–1)
  - brand_theme (1–1)
  - seo (1–1)
  - marketplace (1–1)
  - persona (1–1)
  - packaging (1–1)
  - action_plan (1–1)

Semua tabel child menggunakan:

```
analysis_id (FK, CASCADE)
```

---

# 🔄 Frontend Integration Guide

## Step 1: Ambil Google ID Token

GIS / One-Tap / NextAuth.

## Step 2: Login ke backend

```js
await fetch("/auth/google/login", {
  method: "POST",
  body: JSON.stringify({ id_token }),
});
```

## Step 3: Simpan access_token

## Step 4: Kirim request terproteksi

```js
fetch("/analysis", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});
```

---

# 🛑 Error Codes

| Code | Penyebab                           |
| ---- | ---------------------------------- |
| 400  | Token Google invalid, file invalid |
| 401  | Bearer token hilang / invalid      |
| 404  | Analysis tidak ditemukan           |
| 500  | Kesalahan internal                 |

---

# 📎 Useful Developer Commands

Generate migration:

```
alembic revision --autogenerate -m "update models"
```

Upgrade:

```
alembic upgrade head
```

Downgrade:

```
alembic downgrade -1
```

Run server:

```
uvicorn app.main:app --reload
```

---

Kalau kamu mau, saya bisa:

✓ Buatkan **PDF template**
✓ Tambahkan endpoint `/export/zip`
✓ Buat CLI internal untuk batch processing
✓ Buatkan architecture diagram (C4 model / sequence diagram)

Tinggal bilang saja tanpa basa-basi.
