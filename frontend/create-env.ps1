# Script to create .env.local file
# Run this script from the frontend directory

$envContent = @"
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=YySdEUkjveSOswKzy06I/rsYHfK2yiAQlsT8aCuM/Sw=

# Google OAuth Credentials (Isi dengan credentials Anda)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
"@

$envPath = ".env.local"

if (Test-Path $envPath) {
    Write-Host "File .env.local sudah ada. Apakah Anda ingin menimpanya? (y/n)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "Dibatalkan." -ForegroundColor Red
        exit
    }
}

$envContent | Out-File -FilePath $envPath -Encoding utf8
Write-Host "File .env.local berhasil dibuat!" -ForegroundColor Green
Write-Host ""
Write-Host "PENTING: Edit file .env.local dan isi:" -ForegroundColor Yellow
Write-Host "  - GOOGLE_CLIENT_ID" -ForegroundColor Yellow
Write-Host "  - GOOGLE_CLIENT_SECRET" -ForegroundColor Yellow
Write-Host ""
Write-Host "Dapatkan credentials dari: https://console.cloud.google.com/" -ForegroundColor Cyan

