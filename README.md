# Araç Envanter Frontend

Araç envanter ve bakım/tamir takip sisteminin Next.js tabanlı Türkçe web arayüzüdür.

## Mevcut özellikler

- Responsive admin giriş ekranı
- Backend JWT authentication bağlantısı
- JWT'yi HttpOnly çerezde saklayan güvenli proxy akışı
- Korumalı kontrol paneli
- Admin profil doğrulaması
- Güvenli çıkış

## Kurulum

```bash
npm install
copy .env.example .env.local
npm run dev
```

Frontend varsayılan olarak `http://localhost:3000`, backend ise `http://localhost:3001/api/v1` adresinde çalışır.

## Kontroller

```bash
npm run lint
npm run build
```
