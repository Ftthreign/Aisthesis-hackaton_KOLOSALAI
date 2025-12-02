# **AISTHESIS API Documentation**

Dokumentasi resmi API untuk integrasi frontend–backend AISTHESIS.
Semua request yang membutuhkan autentikasi wajib mengirimkan **Google ID Token** melalui header:

```
Authorization: Bearer <google_id_token>
```

---

# **📌 Base URL**

- **Production Backend:** `https://<your-backend-domain>`
- Semua endpoint berada di root (`/`).

---

# **📘 Authentication**

## **GET /auth/verify**

Verifikasi Google ID Token dan mengembalikan data user.

### **Headers**

```
Authorization: Bearer <google_id_token>
```

### **Response 200**

```json
{
  "id": "uuid",
  "email": "user@gmail.com",
  "name": "User Name",
  "avatar_url": "https://...",
  "is_active": true,
  "created_at": "2025-01-01T10:20:30",
  "updated_at": "2025-01-01T10:20:30"
}
```

---

# **📤 Upload & Analysis**

## **POST /analysis**

Melakukan upload gambar dan menjalankan AI Analysis (Vision + LLM).

### **Headers**

```
Authorization: Bearer <google_id_token>
Content-Type: multipart/form-data
```

### **Body (form-data)**

```
file: <image>
```

### **Response 200 (AnalysisResponse)**

```json
{
  "id": "uuid",
  "image_url": "https://cdn.../image.jpg",
  "image_filename": "image.jpg",

  "vision_result": {
    "labels": ["coffee", "latte"],
    "colors": ["brown", "white"],
    "objects": ["cup", "foam"],
    "mood": "cozy",
    "raw": {}
  },

  "story": {
    "product_name": "Latte Caramel Bliss",
    "tagline": "Manis, lembut, dan hangat di hati",
    "short_desc": "Latte caramel dengan rasa creamy.",
    "long_desc": "Perpaduan espresso premium dan caramel...",
    "caption_casual": "Siap nemenin hari kamu 😋☕",
    "caption_professional": "Latte caramel dengan cita rasa...",
    "caption_storytelling": "Pagi itu, aroma kopi menyapa..."
  },

  "taste": {
    "taste_profile": ["manis", "creamy", "light bitterness"],
    "aroma_profile": ["caramel", "coffee roast"],
    "sensory_persona": "Hangat, lembut, friendly",
    "pairing": ["cookies", "croissant"]
  },

  "pricing": {
    "recommended_price": 25000,
    "min_price": 20000,
    "max_price": 30000,
    "reasoning": "Harga menyesuaikan tren coffee shop urban...",
    "promo_strategy": ["beli 2 gratis 1", "happy hour 4-6 pm"],
    "best_posting_time": "09:00 - 11:00"
  },

  "brand_theme": {
    "primary_color": "#A47551",
    "secondary_color": "#E6D5C3",
    "accent_color": "#F5F5F5",
    "tone": "hangat, cozy, friendly",
    "style_suggestions": ["soft shadow", "warm tone", "flat composition"]
  },

  "seo": {
    "keywords": ["latte caramel", "coffee shop", "cozy drink"],
    "hashtags": ["#latte", "#coffeelover", "#caramellatte"]
  },

  "marketplace": {
    "shopee_desc": "Nikmati Latte Caramel Bliss...",
    "tokopedia_desc": "Rasakan kelembutan latte caramel...",
    "instagram_desc": "Siap nemenin pagi kamu ☕✨"
  },

  "persona": {
    "name": "Karin, The Cozy Explorer",
    "bio": "Suka mencoba kopi baru di setiap perjalanan...",
    "demographics": {
      "age_range": "18-30",
      "location": "Urban Indonesia",
      "gender": "female"
    },
    "motivations": ["cari minuman manis yang tidak enek", "butuh vibes cozy"],
    "pain_points": ["kopi terlalu pahit", "minuman estetis tapi overpriced"]
  },

  "packaging": {
    "suggestions": [
      "Cup warna cream & caramel",
      "Label dengan font hangat",
      "Sticker minimalis"
    ],
    "material_recommendations": ["Cup kertas premium"]
  },

  "action_plan": {
    "day_1": "Posting teaser foto produk",
    "day_2": "Upload video pouring caramel",
    "day_3": "Promo bundling pagi",
    "day_4": "UGC challenge",
    "day_5": "Posting testimoni",
    "day_6": "Live story: behind the cup",
    "day_7": "Promo penutup minggu"
  },

  "created_at": "2025-01-01T10:20:30",
  "updated_at": "2025-01-01T10:20:30"
}
```

---

# **📜 History**

## **GET /history**

Menampilkan daftar analisis milik user.

### **Headers**

```
Authorization: Bearer <google_id_token>
```

### **Response 200**

```json
[
  {
    "id": "uuid",
    "image_url": "https://cdn.../latte.jpg",
    "created_at": "2025-01-01T10:20:30"
  },
  {
    "id": "uuid",
    "image_url": "https://cdn.../matcha.jpg",
    "created_at": "2025-01-03T12:11:20"
  }
]
```

---

## **GET /history/{id}**

Mengambil data detail 1 analisis.

### **Response 200**

```json
{ ... AnalysisResponse ... }
```

---

## **DELETE /history/{id}**

Menghapus 1 analisis.

### **Response 200**

```json
{ "message": "deleted" }
```

---

# **📥 Export**

## **GET /export/pdf/{id}**

Mendownload hasil analisis dalam bentuk PDF.

### **Response**

Content-Type:

```
application/pdf
```

(Hasil berupa file streaming.)

---

## **GET /export/json/{id}**

Mendownload hasil analisis dalam bentuk JSON mentah.

### **Response**

```json
{ ... AnalysisResponse ... }
```

---

# **📦 Data Structure Summary**

## **AnalysisResponse**

```json
{
  "id": "uuid",
  "image_url": "string",
  "vision_result": { ... },
  "story": { ... },
  "taste": { ... },
  "pricing": { ... },
  "brand_theme": { ... },
  "seo": { ... },
  "marketplace": { ... },
  "persona": { ... },
  "packaging": { ... },
  "action_plan": { ... },
  "created_at": "string",
  "updated_at": "string"
}
```

---

# **🛠️ Usage Flow (Frontend)**

1. User login via Google (NextAuth)
2. NextAuth menyimpan Google ID Token
3. Frontend kirim token via header ke backend
4. Upload gambar → `/analysis`
5. Muncul dashboard hasil analisis
6. History bisa ditarik dari `/history`
7. Download PDF/JSON jika diperlukan

---

# **📞 Kontak Tim Backend**

- Pastikan selalu kirim Google ID Token
- Pastikan file dikirim dalam format `multipart/form-data`
- Backend menolak request tanpa header Authorization

---
