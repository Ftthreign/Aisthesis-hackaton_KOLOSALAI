# Setup Environment Variables

## Quick Setup

Buat file `.env.local` di folder `frontend/` dengan isi berikut:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=YySdEUkjveSOswKzy06I/rsYHfK2yiAQlsT8aCuM/Sw=

# Google OAuth Credentials (Isi dengan credentials Anda)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Langkah-langkah

1. **Buat file `.env.local` di folder `frontend/`**

2. **Copy dan paste isi di atas ke file tersebut**

3. **Generate secret baru (opsional)**, jalankan:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

4. **Setup Google OAuth:**
   - Buka [Google Cloud Console](https://console.cloud.google.com/)
   - Buat project baru atau pilih project yang sudah ada
   - Enable Google+ API
   - Buat OAuth 2.0 credentials
   - Tambahkan Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy Client ID dan Client Secret ke file `.env.local`

5. **Restart dev server** setelah membuat file `.env.local`

## Catatan

- File `.env.local` tidak akan di-commit ke git (sudah di-ignore)
- Jangan share secret key ke publik
- Untuk production, gunakan environment variables yang aman

