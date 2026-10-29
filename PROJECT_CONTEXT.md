# Project Context & AI Agent Architecture Guide

> **Catatan untuk AI / LLM:**  
> File ini dirancang khusus sebagai panduan pemindaian cepat (*fast scan & deep context*) untuk memahami struktur, arsitektur, konvensi kode, dan alur kerja proyek **Soft Romance in Bloom — Digital Wedding Invitation**. Baca file ini sebelum melakukan perubahan kode atau menambahkan fitur baru.

---
 
## 1. Ringkasan Eksekutif (Executive Summary)

- **Nama Proyek:** Soft Romance in Bloom (`soft-romance-in-bloom-invitation`)
- **Tipe Proyek:** Undangan Pernikahan Digital Interaktif (*Luxury Botanical Stationery*).
- **Pasangan:** Aurelia & Daniel
- **Target Tanggal Acara:** `2027-06-14T16:00:00+07:00` (WIB / `Asia/Jakarta`).
- **Gaya Desain:** **Romantic Editorial & Botanical Art Direction**:
  - Sampul pembuka (*cinematic opening*) dengan tirai beludru hijau sage, aksen pita sutra, dan segel lilin 3D (*wax seal button*).
  - Tipografi editorial berkelas: *Playfair Display* & *Cormorant Garamond* (serif) berpadu kaligrafi halus *Allura* (script) dan *Montserrat* (sans-serif).
  - Navigasi intuitif prioritas mobile: *Floating Ergonomic Bottom Dock* dengan 5 aksi utama ramah jangkauan jempol.
  - RSVP praktis (*frictionless RSVP*): Kartu status kehadiran 1-ketukan, *stepper counter* kuota tamu (`−` / `+`), integrasi konfirmasi instan ke WhatsApp & kalender (.ICS).
- **Standar Aksesibilitas:** WCAG 2.2 AA, keyboard trap & focus restoration pada modal/lightbox, `aria-live="polite"` untuk hitung mundur, serta kepatuhan penuh terhadap `prefers-reduced-motion`.

---

## 2. Arsitektur Distribusi Ganda (Dual-Mode Architecture)

⚠️ **PENTING UNTUK AI:** Proyek ini memiliki **2 format distribusi** yang harus dipahami hubungannya:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    STRUKTUR DUAL-MODE REPOSITORI                        │
└─────────────────────────────────────────────────────────────────────────┘
        │
        ├─► [1] Next.js App Router (Full Stack / SSR + Client Hydration)
        │    ├── Entry Point: `src/app/page.tsx`
        │    ├── Markup: `src/app/invitation.html` (diimpor via fs.readFileSync)
        │    ├── Client Scripts: `src/app/invitation.js` & `InvitationScript.tsx`
        │    ├── Konfigurasi: `src/config/weddingConfig.ts`
        │    └── Backend Integration: `src/services/supabaseClient.ts`
        │
        └─► [2] Standalone Single-File Canvas (`index.standalone.html`)
             ├── File HTML tunggal mandiri (~1.3 MB)
             ├── Seluruh aset (gambar, SVG, font, CSS, JS) di-embed inline/base64
             └── Siap langsung dibuka di browser lokal atau static host tanpa Node.js
```

### Aturan Sinkronisasi Kode:
- Jika melakukan perubahan pada antarmuka/markup utama, perhatikan apakah perubahan ditujukan untuk aplikasi **Next.js** (`src/app/invitation.html` & `invitation.js`) atau versi **Standalone** (`index.standalone.html`), atau keduanya.
- Komponen Next.js `src/app/page.tsx` sengaja menggunakan pembacaan `invitation.html` secara langsung untuk menjaga kesetaraan tampilan pixel-perfect dengan versi standalone.

---

## 3. Peta Berkas & Direktori (Repository Tree)

```text
wedding-moodboard/
├── .env.example              # Template variabel lingkungan Supabase
├── .env.local                # Konfigurasi env lokal (Supabase credentials)
├── .gitignore                # Git ignore standar Next.js & Node.js
├── index.standalone.html     # Versi mandiri satu berkas (Full self-contained)
├── package.json              # Konfigurasi dependensi dan skrip proyek
├── postcss.config.js         # Konfigurasi PostCSS untuk Tailwind CSS
├── tailwind.config.js        # Konfigurasi palet tema dan font keluarga
├── tsconfig.json             # Konfigurasi TypeScript Next.js
├── README.md                 # Dokumentasi umum untuk pengguna manusia
├── PROJECT_CONTEXT.md        # File ini: Panduan teknis & arsitektur untuk AI
│
├── public/                   # Aset statis publik (ikon, gambar, ilustrasi)
│   └── assets/               # Foto pasangan & ilustrasi botanikal WebP/PNG
│
└── src/
    ├── app/
    │   ├── globals.css        # Variabel desain, keyframe animasi & reset
    │   ├── invitation.html    # Template DOM utama undangan
    │   ├── invitation.js      # Logika interaktif DOM, countdown, RSVP, dsb.
    │   ├── InvitationScript.tsx # Client component pembungkus initInvitation()
    │   ├── layout.tsx         # Root layout Next.js & konfigurasi metadata / fonts
    │   └── page.tsx           # Entry page SSR Next.js
    ├── config/
    │   └── weddingConfig.ts   # Tipe TypeScript & data default konfigurasi acara
    ├── services/
    │   └── supabaseClient.ts  # Client Supabase dengan fallback Demo Mode otomatis
    └── styles/
        └── tokens.css         # Token desain CSS murni (warna, shadow, typography)
```

---

## 4. Stack Teknologi & Versi

| Kategori | Teknologi | Versi | Catatan |
|---|---|---|---|
| **Framework** | Next.js (App Router) | `^16.4.3` | Digunakan untuk runtime modern React 19 |
| **UI Library** | React & React DOM | `^19.3.1` | Menggunakan Server Component + Client Component wrapper |
| **Styling** | Tailwind CSS + CSS Variables | `3.4.17` | Utility-first + token desain di `:root` |
| **Bahasa** | TypeScript & JavaScript | `^5.6.2` | TypeScript untuk config/services, Vanilla JS untuk micro-interaction |
| **Database** | Supabase JS Client | `^2.45.0` | RSVP & Buku Tamu (mendukung Demo Mode tanpa database) |
| **Font Google** | Playfair Display & Allura | - | Di-load di `layout.tsx` & inline font di standalone |

---

## 5. Token Desain & Sistem Warna

Warna tema didefinisikan secara sentral pada `src/styles/tokens.css`, `src/app/globals.css`, dan `tailwind.config.js`:

```css
:root {
  --color-dusty-pink: #E7B8C4;  /* Aksen pita sutra & hover */
  --color-mauve:      #C98AA3;  /* Sub-judul & teks aksen romantis */
  --color-mauve-deep: #A8647F;  /* Aksen romantis pekat */
  --color-sage:       #61664C;  /* Tirai beludru sampul, ornamen dedaunan botani */
  --color-sage-deep:  #464A35;  /* Bayangan lipatan tirai */
  --color-ivory:      #FAF6F0;  /* Latar belakang kertas katun bertekstur utama */
  --color-ivory-elevated: #FFFDFB; /* Permukaan kartu stationery */
  --color-gold:       #D4BA72;  /* Garis border lengkung & ornamen foil antik */
  --color-ink:        #3A272B;  /* Teks utama (letterpress deep espresso-wine ink, WCAG AA compliant) */
  --color-muted-rose: #9A7078;  /* Deskripsi sekunder & border halus */
  --color-border:     rgba(100, 73, 80, 0.18);
  --color-border-gold: rgba(212, 186, 114, 0.45);
}
```

### Aturan Tipografi:
- **Heading / Judul Utama:** `font-serif` / `font-display` (`Playfair Display`, `Cormorant Garamond`, serif)
- **Aksen Romantis / Cursive:** `font-script` (`Allura`, cursive)
- **Body / Antarmuka / Label:** `font-sans` (`Montserrat`, -apple-system, sans-serif)

---

## 6. Modul Interaktif & Logika Fitur (`invitation.js`)

Ketika membaca atau mengubah logika interaktif di `src/app/invitation.js`:

1. **Cover & Tirai Pembuka Sinematik (`openInvitationCover`)**:
   - Sampul interaktif berbalut tirai beludru hijau sage dengan segel lilin 3D (*wax seal button*).
   - Menampilkan salam personal: `Kepada Yth. Bapak/Ibu/Saudara/i [Nama Tamu]` + lencana kuota tamu.
   - Ketukan pada segel lilin memicu denting harpa lembut (*Web Audio API*), membuka tirai beludru dengan kurva halus (*silk easing* 780ms), dan memindahkan fokus aksesibel ke konten utama.
   - Tombol "Sampul" tetap dapat diakses di bilah atas untuk membuka kembali sampul kapan saja.

2. **Navigasi Intuitif & Mobile-First Bottom Dock**:
   - **Desktop:** Sticky frosted-glass bar di bagian atas dengan monogram stempel `A & D` dan indikator bab aktif.
   - **Mobile:** *Floating Navigation Dock* melayang di bagian bawah dengan 5 ikon ergonomis (Mempelai, Acara, Galeri, RSVP, Kasih) yang ramah jangkauan satu jempol.
   - Garis progres scroll bernuansa emas sampanye & dusty rose di paling atas.

3. **RSVP Praktis (Frictionless RSVP)**:
   - Tombol pilihan kehadiran berupa kartu taktil (*Hadir dengan Sukacita* vs *Berhalangan Hadir*).
   - Pengatur jumlah tamu interaktif (*stepper counter* `−` / `+`) yang otomatis membatasi kuota sesuai undangan personal (`maxQuota`).
   - Panel konfirmasi instan setelah RSVP dengan tautan cepat:
     - **Kirim Konfirmasi via WhatsApp:** Pesan WhatsApp otomatis yang siap dikirimkan ke pihak mempelai/keluarga.
     - **Simpan ke Kalender:** Mengunduh berkas `.ics` atau membuka Google Calendar.
     - **Ubah Konfirmasi:** Membuka kembali formulir jika tamu ingin memperbarui data.

4. **Hitung Mundur Waktu Nyata (`initCountdown`)**:
   - Menghitung mundur secara presisi ke target `2027-06-14T16:00:00+07:00` (WIB).
   - Menggunakan angka tabular (`font-variant-numeric: tabular-nums`) untuk stabilitas tata letak (tanpa *Cumulative Layout Shift*).

5. **Galeri & Lightbox Aksesibel (`initLightbox`)**:
   - Grid editorial asimetris dengan rasio aspek eksplisit.
   - Dialog penampil gambar layar penuh yang mendukung tombol panah, gesekan layar, dan tombol `Escape`.

6. **Pemutar Audio Harpa Akustik Sintetis (`toggleBackgroundMusic`)**:
   - Menggunakan *Web Audio API* ramah privasi (tanpa berkas audio eksternal berat).
   - Disertai indikator animasi equalizer gelombang suara 4-batang di bilah atas.

7. **Buku Tamu & Tanda Kasih Digital (`initGuestbook` & Salin Rekening)**:
   - Formulir doa restu dengan penghitung karakter (maksimal 280 karakter).
   - Kartu nomor rekening (BCA & Mandiri) dengan tombol salin 1-ketukan, animasi centang, dan *toast notification* elegan.

---

## 7. Skema Database Supabase & Fallback Mode

Jika backend dihubungkan, struktur tabel SQL yang digunakan:

```sql
-- Tabel RSVP
create table public.rsvp_submissions (
  id uuid primary key default gen_random_uuid(),
  guest_slug text not null,
  guest_name text not null,
  attendance text not null check (attendance in ('hadir', 'tidak_hadir')),
  pax integer not null default 1 check (pax >= 0 and pax <= 10),
  dietary_notes text,
  message text,
  created_at timestamptz not null default now()
);

-- Tabel Ucapan Tamu
create table public.guestbook_messages (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null,
  relation text,
  message text not null check (char_length(message) <= 280),
  created_at timestamptz not null default now()
);
```

### Logika Fallback (Graceful Degradation):
File `src/services/supabaseClient.ts` memeriksa keberadaan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Jika tidak ditemukan:
- Sistem tidak crash / error.
- Operasi beralih ke `localStorage` browser.
- UI menampilkan penanda jujur bahwa formulir berjalan dalam mode demonstrasi.

---

## 8. Panduan Menjalankan Perintah (Commands)

```bash
# Menjalankan server pengembangan lokal (Next.js)
npm run dev

# Membangun build produksi
npm run build

# Menjalankan build produksi lokal
npm run start
```

---

## 9. Petunjuk Khusus untuk AI / LLM (Agent Rules & Best Practices)

1. **Jaga Integritas Desain:** Jangan mengganti variabel warna heksadesimal sembarangan. Gunakan token CSS yang sudah ada di `tokens.css`.
2. **Jangan Mengarang Data Pribadi:** Jika menambah template acara, rekening, atau nama orang tua, selalu gunakan placeholder atau tandai dengan flag `isDemonstrationContent: true`.
3. **Patuhi Aksesibilitas (A11y):**
   - Pertahankan atribut `aria-label`, `aria-live`, dan `role`.
   - Pastikan dialog modal menangani `Escape` dan focus restoration.
   - Hindari animasi berkedip tanpa perlindungan `@media (prefers-reduced-motion: reduce)`.
4. **Perhatikan Perubahan File Statis vs Next.js:** Periksa apakah permintaan pengguna berfokus pada file mandiri `index.standalone.html` atau aplikasi web `src/app/`.

---
*Dokumen ini dibuat dan dikurasi agar AI agent dapat langsung memahami konteks proyek dalam 1 kali pemindaian.*

