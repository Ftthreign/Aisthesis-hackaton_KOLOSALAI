# AISTHESIS – AI Food Product Analyzer for Food UMKM

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
![Hackathon](https://img.shields.io/badge/Hackathon-IMPHNEN%20x%20Kolosal-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-teal)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)

AISTHESIS adalah platform analisis berbasis AI yang membantu UMKM makanan mengubah satu foto produk menjadi insight bisnis lengkap. Sistem menghasilkan deskripsi menu, profil rasa dan aroma, rekomendasi harga, tema branding, SEO, deskripsi marketplace, persona pelanggan, saran kemasan, dan rencana pemasaran 7 hari.

# 🎯 Problem Statement

Banyak UMKM makanan kesulitan membuat konten pemasaran yang menarik dan konsisten.
Mereka perlu menulis deskripsi menu, menentukan harga jual, membuat caption,
mendesain branding, hingga menyusun strategi promosi semuanya memakan waktu dan
sering dilakukan tanpa dasar analisis.

# 💡 Our Solution

AISTHESIS menghadirkan analisis otomatis berbasis AI hanya dari **satu foto makanan**.  
Platform ini menghasilkan deskripsi produk, analisis rasa, rekomendasi harga, branding,
SEO, persona pelanggan, hingga rencana pemasaran secara instan.  
UMKM dapat fokus berjualan tanpa harus memahami marketing atau copywriting.

---

# 🧰 Tech Stack

## Frontend

- Next.js 15 (App Router)
- TailwindCSS + Shadcn UI
- NextAuth (Google OAuth)
- React Query / Fetch API

## Backend

- FastAPI (Python 3.11)
- SQLAlchemy + Alembic
- PostgreSQL
- Vision API + LLM (Google Gemini Vision)

## DevOps

- Monorepo Structure
- GitHub Actions (CI/CD-ready)
- Digital Ocean Droplet

---

Repositori ini menggunakan struktur **monorepo**, terdiri dari:

- **backend/** (FastAPI, PostgreSQL, AI Pipeline)
- **frontend/** (Next.js, TailwindCSS, Shadcn UI)

---

## 📂 Struktur Repository

```

/
├── backend/ # FastAPI, PostgreSQL, AI Orchestration
├── frontend/ # Next.js, TailwindCSS, Shadcn UI
└── README.md # Dokumentasi utama

```

---

# ✨ Fitur Utama

### 1. Vision-based Food Analysis

- Deteksi elemen visual makanan
- Identifikasi kategori makanan
- Analisis warna, plating, dan konteks visual

### 2. Deskripsi Makanan

- Nama menu rekomendasi
- Deskripsi panjang & pendek
- Storytelling yang cocok untuk marketing
- Caption Instagram (casual, profesional, storytelling)

### 3. Profil Rasa & Aroma

- Taste profile
- Aroma profile
- Sensory persona
- Food pairing recommendation

### 4. Smart Pricing Advisor

- Harga rekomendasi
- Rentang harga minimum dan maksimum
- Penjelasan perhitungan harga
- Strategi promo & waktu posting terbaik

### 5. Branding Suite

- Rekomendasi warna brand
- Tone & gaya brand
- Gaya visual untuk promosi

### 6. SEO & Marketplace Content

- Keyword SEO
- Hashtag
- Deskripsi untuk Shopee, Tokopedia, dan Instagram Shop

### 7. Business Features

- Buyer persona
- Packaging suggestions
- Rencana strategi pemasaran 7 hari

### 8. History

- Riwayat analisis

---

# 🏗️ Arsitektur Sistem

## **Frontend (Next.js)**

- Next.js App Router
- TailwindCSS + Shadcn UI
- NextAuth Google OAuth
- Fetch API untuk backend
- Halaman utama: upload, dashboard analisis, history, detail history

## **Backend (FastAPI)**

- FastAPI asynchronous
- SQLAlchemy + Alembic
- AI pipeline modular (Vision → Prompt Builder → LLM → Extractor)
- JWT verification dari NextAuth
- Redis
- Google Gemini Vision API
- Worker

## **Database (PostgreSQL)**

- Users
- OAuth accounts
- Analyses + detail tables

## DevOps

- Digital Ocean Droplet
- GitHub Actions (CI/CD-ready)
- Docker

---

# 🚀 Cara Menjalankan Proyek

## **1. Clone Repository**

```bash
git clone https://github.com/Ftthreign/Aisthesis-hackaton_KOLOSALAI
cd https://github.com/Ftthreign/Aisthesis-hackaton_KOLOSALAI
```

---

# 🔧 Backend Setup (FastAPI)

Masuk ke folder backend:

```bash
cd backend
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Setup environment

Buat file `.env`:

```
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/aist
JWT_SECRET=your_jwt_secret
AI_API_KEY=your_ai_key
```

### Jalankan migrasi database:

```bash
alembic upgrade head
```

### Jalankan server backend:

```bash
uvicorn app.main:app --reload
```

---

# 💻 Frontend Setup (Next.js)

Masuk ke folder frontend:

```bash
cd frontend
```

### Install dependencies

```bash
npm install
```

### Setup environment

Buat `.env.local`:

```
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
API_BASE_URL=http://localhost:8000
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
```

### Jalankan frontend:

```bash
npm run dev
```

Aplikasi akan berjalan pada:

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend:** [http://localhost:8000](http://localhost:8000/api/v1)

---

# 📹 Video Demo

```
https://drive.google.com/drive/folders/10TTzSixbMtEpQ3eYGlohmxWPvajx8XvO
```

Pastikan video mencakup masalah, solusi, demo fitur utama, dan alur penggunaan.

---

# ⚙️ Deployment

```
Live Frontend: https://myistri.my.id/
```

---

# 🛡️ Best Practices

- Tidak meng-commit file `.env`
- Tidak meng-upload `node_modules` atau `vendor`
- Tidak ada hardcoded credentials
- Struktur folder rapi dan modular
- Tidak ada file >500 baris campur aduk UI & logic

---

# 👥 Contributors

| Nama                 | Role               | GitHub                                         |
| -------------------- | ------------------ | ---------------------------------------------- |
| Fadhil Abdul Fattah  | Backend Developer  | [@Ftthreign](https://github.com/Ftthreign)     |
| Echa Aprilianto      | Backend Developer  | [@apirJS](https://github.com/apirJS)           |
| Stefanus Lay         | Frontend Developer | [@StivenLay](https://github.com/StivenLay)     |
| Muhammad Azka Naufal | Frontend Developer | [@mhmdazkanfl](https://github.com/mhmdazkanfl) |

<br>

# 📌 Disclaimer

AISTHESIS dikembangkan dalam periode Hackathon dan beberapa fitur dapat masih terus
dikembangkan untuk peningkatan stabilitas, UX, dan akurasi AI.

---

<br>
<br>

> AISTHESIS TEAM © 2025
