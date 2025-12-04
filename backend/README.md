# AISTHESIS API — Developer Documentation

Dokumentasi teknis untuk pengembangan backend dan integrasi frontend.
Semua endpoint menggunakan autentikasi JWT yang dihasilkan dari proses login Google.

---

# 🚀 Overview

## Teknologi Utama

- **FastAPI** (Backend)
- **PostgreSQL** (Database)
- **SQLAlchemy 2.0 (Async)**
- **Alembic** (Database migration)
- **Pydantic v2**
- **Google OAuth (ID Token)**
- **JWT** (Auth)

---

# 🗂 Project Structure (Backend)

```
app/
│── config.py
│── main.py
│── database.py
│
├── models/
│   ├── user.py
│   ├── oauth.py
│   ├── analysis.py
│   └── ...
│
├── schemas/
│   ├── auth.py
│   ├── user.py
│   ├── analysis_*.py
│   └── ...
│
├── routers/
│   └── ...
│
└── services/
    └── ...
```

---

# ⚙️ Environment Setup

## 1. Install dependencies

```
pip install -r requirements.txt
```

## 2. Isi file `.env`

```
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/aisthesis
DATABASE_URL_SYNC=postgresql://user:pass@localhost:5432/aisthesis

SECRET_KEY=your-secret
GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
```

## 3. Jalankan database migration

```
alembic upgrade head
```

## 4. Jalankan development server

```
uvicorn app.main:app --reload
```

---

# 🔐 Authentication Flow (Developer Version)

AISTHESIS **tidak menggunakan refresh Google setiap login**.
Backend hanya butuh:

1. Frontend mendapatkan **Google ID Token**
2. Frontend mengirim ID Token ke backend
3. Backend memverifikasi → membuat user jika baru → generate JWT internal

---

# 🔑 Login Flow Detail

### 1. Frontend memanggil Google (GIS / One-Tap / NextAuth)

Frontend menerima:

```
credential = <google_id_token>
```

### 2. Frontend kirim token ke backend

```
POST /auth/google/login
Body:
{
  "id_token": "<google_id_token>"
}
```

### 3. Backend response:

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>"
}
```

### 4. Semua request berikutnya:

```
Authorization: Bearer <access_token>
```

---

# 📌 Authentication Endpoints

## **POST /auth/google/login**

- Verifikasi Google ID Token
- Create user jika belum ada
- Return `access_token` & `refresh_token`

Example request:

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

Mengambil user saat ini (berdasarkan JWT internal).

Headers:

```
Authorization: Bearer <access_token>
```

---

# 🖼️ Analysis Engine

## **POST /analysis**

- Upload gambar
- Jalankan Vision AI
- Generate branding, storytelling, persona, pricing, dll.

Request:

```
Content-Type: multipart/form-data
file: <image>
```

Response: `AnalysisResponse` lengkap (object besar).

---

# 📜 History Endpoints

### **GET /history**

Daftar semua analisis milik user.

### **GET /history/{id}**

Detail satu analisis.

### **DELETE /history/{id}**

Menghapus analisis.

Semua butuh:

```
Authorization: Bearer <access_token>
```

---

# 📥 Export Endpoints

### **GET /export/pdf/{id}**

Mendownload PDF hasil analisis.

### **GET /export/json/{id}**

Mengambil file JSON mentah.

---

# 🧩 Data Model Summary (Simplified)

Semua analisis `Analysis` memiliki relasi:

- story
- taste
- pricing
- brand_theme
- seo
- marketplace
- persona
- packaging
- action_plan

---

# 🔄 Frontend Integration Guide

## Step 1. Ambil Google ID Token

Gunakan:

- Google Identity Services (GIS)
- Atau NextAuth (provider: Google)

Result:

```
id_token = <google_id_token>
```

## Step 2. Kirim ke backend

```js
const res = await fetch("/auth/google/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id_token }),
});
```

## Step 3. Simpan token

```
localStorage.setItem("access_token", data.access_token)
```

## Step 4. Gunakan token

```js
fetch("/auth/profile", {
  headers: { Authorization: `Bearer ${token}` },
});
```

---

# ⚠️ Important Notes (Developer)

- Backend **tidak menerima Google ID Token di Authorization header**
  → hanya menerima **JWT internal**
- Authorization header HARUS format:

  ```
  Bearer <access_token>
  ```

- JWT akan berisi `sub = user_id`
- `get_current_user` membaca JWT, bukan Google token lagi
- Migration wajib dijalankan setelah update model

---

# 📎 Useful Commands

Generate new migration:

```
alembic revision --autogenerate -m "message"
```

Upgrade:

```
alembic upgrade head
```

Downgrade:

```
alembic downgrade -1
```

---
