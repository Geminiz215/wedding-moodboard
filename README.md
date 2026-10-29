# Soft Romance in Bloom — Digital Wedding Invitation

> 🤖 **AI / Developer Context Guide:** Untuk panduan arsitektur lengkap, peta file, dan konvensi proyek yang dioptimalkan untuk AI agent, lihat **[PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)**.

Undangan pernikahan digital interaktif bergaya **Luxury Botanical Stationery** (*Soft Romance in Bloom*) untuk **Aurelia & Daniel**. Dirancang dengan pendekatan editorial klasik taman Eropa, tipografi serif *Playfair Display* & kaligrafi *Allura*, sistem animasi gulir (*scroll choreography*) yang terkendali, serta dukungan penuh terhadap aksesibilitas WCAG 2.2 AA dan `prefers-reduced-motion`.

---

## 1. Fitur Utama & Arsitektur Pengalaman (UX)

1. **Sampul Pembuka (*Invitation Cover*)**:
   - Latar kertas *ivory* bertekstur halus (`#F7EEE8`), tirai beludru *sage green* (`#6B6F52`), pita sutra *dusty pink* (`#E7B8C4`), dan bingkai lengkung emas sampanye (`#D8C37B`) dengan efek gambar garis SVG (`ornamentDraw`).
   - Sapaan tamu personal (`Kepada Yth. Bapak/Ibu/Saudara/i [Nama Tamu]`) melalui parameter URL `?to=Nama+Tamu&quota=2` atau pengalih pratinjau tamu di bilah atas.
   - Transisi tirai pembuka (`curtainReveal`, ~720ms) yang langsung memindahkan fokus keyboard/pembaca layar ke konten utama.
2. **Hero & Profil Mempelai**:
   - Komposisi editorial asimetris pada layar desktop dan terpusat secara anggun pada layar seluler.
   - Kartu mempelai dengan penanda data demonstrasi yang jelas (tanpa mengarang nama orang tua atau silsilah).
3. **Kisah Perjalanan (*Couple Story*)**:
   - Tata letak jurnal cinta 2 paragraf ringkas dengan lini masa vertikal yang tergambar secara bertahap saat masuk ke dalam *viewport*.
4. **Hitung Mundur Waktu Nyata (*Live Countdown*)**:
   - Menghitung mundur secara akurat ke `2027-06-14T16:00:00+07:00` (`Asia/Jakarta` / WIB) dengan angka tabular (`font-variant-numeric: tabular-nums`) agar tidak menggeser tata letak, dukungan pembaca layar (`aria-live="polite"`), serta penanganan status waktu berakhir (*expired state*) tanpa angka negatif.
5. **Rangkaian Acara & Panduan Busana**:
   - Panel terpisah untuk **Pemberkatan & Akad** serta **Resepsi & Jamuan Malam** di *The Grand Santika, Jakarta* (data demonstrasi).
   - Palet warna panduan busana (*Dusty Pink*, *Mauve Rose*, *Sage Green*, *Champagne*), modal peta lokasi interaktif, dan tombol unduh kalender `.ICS`.
6. **Galeri Editorial & Lightbox Aksesibel**:
   - Grid asimetris dengan rasio aspek eksplisit (mencegah *Cumulative Layout Shift*).
   - Dialog *Lightbox* yang mendukung navigasi tombol panah (`ArrowLeft`, `ArrowRight`), penutupan dengan `Escape`, dan pemulihan fokus otomatis ke foto pemicu.
7. **Formulir RSVP Fungsional dengan Kuota Tamu**:
   - Memvalidasi nama tamu, pilihan kehadiran (*Hadir* / *Tidak dapat hadir*), dan membatasi jumlah tamu sesuai kuota undangan personal (`maxQuota`).
   - Menampilkan status pemrosesan, mencegah pengiriman ganda, dan menampilkan status **Mode Demo** secara jujur apabila Supabase belum dikonfigurasi.
8. **Buku Tamu Digital & Amplop Digital (*Tanda Kasih*)**:
   - Validasi pesan buku tamu dengan penghitung karakter.
   - Kartu rekening bank contoh dengan tombol **Salin Nomor Rekening** (`CopyButton`) yang berubah menjadi `"Tersalin"` disertai umpan balik *toast* aksesibel.

---

## 2. Sistem Token Desain (`src/styles/tokens.css`)

```css
:root {
  --color-dusty-pink: #E7B8C4;
  --color-mauve: #C98AA3;
  --color-sage: #6B6F52;
  --color-ivory: #F7EEE8;
  --color-gold: #D8C37B;
  --color-ink: #493237;
  --color-muted-rose: #9A7078;
  --color-border: rgba(112, 76, 79, 0.22);
}
```

---

## 3. Cara Menjalankan & Mengkustomisasi Data Pernikahan

### A. Menjalankan Versi Mandiri (Single-File Canvas / Static Hosting)
Berkas `index.standalone.html` telah memuat seluruh aset fotografi editorial, ilustrasi bunga peony transparan, CSS, dan logika interaktif secara mandiri. Anda dapat membukanya langsung di browser atau mengunggahnya ke layanan *static hosting* (Vercel, Netlify, Cloudflare Pages).

### B. Menjalankan Proyek Next.js (App Router + Tailwind CSS)
1. Instal dependensi dan jalankan server pengembangan:
   ```bash
   npm install
   npm run dev        # pengembangan
   npm run build && npm start   # produksi
   ```
2. Struktur berkas:
   - `src/app/invitation.html` — markup undangan (teks, nama, tanggal, lokasi, nomor rekening).
   - `src/app/invitation.js` — logika interaktif & `weddingConfig` (tanggal hitung mundur, preset tamu, galeri, ucapan awal).
   - `src/app/globals.css` — token desain & animasi; `tailwind.config.js` — palet & font.
   - `src/app/layout.tsx` — judul, meta deskripsi, dan Google Fonts.

---

## 4. Panduan Penggantian Aset Fotografi & Ilustrasi Bunga

Letakkan foto pasangan dan ilustrasi botani baru di folder `public/assets/`:
- Gunakan format **WebP** atau **JPEG** teroptimasi (lebar 800–1200px untuk foto galeri) agar pemuatan halaman tetap cepat pada perangkat seluler.
- Untuk ilustrasi bunga sudut (*corner florals*), gunakan berkas **PNG** atau **WebP** dengan latar belakang transparan.
- Selalu cantumkan atribut `width`, `height`, dan teks alternatif (`alt`) deskriptif dalam Bahasa Indonesia.

---

## 5. Integrasi Backend Supabase (RSVP & Buku Tamu)

Secara bawaan, apabila variabel lingkungan Supabase belum diatur, aplikasi menampilkan penanda **Mode Demo** dan menyimpan pengujian RSVP/Ucapan di `localStorage` browser (tidak memalsukan penyimpanan server).

Untuk mengaktifkan penyimpanan database nyata:

1. Buat proyek baru di [Supabase](https://supabase.com) dan jalankan skrip SQL berikut pada **SQL Editor**:

```sql
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

create table public.guestbook_messages (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null,
  relation text,
  message text not null check (char_length(message) <= 280),
  created_at timestamptz not null default now()
);

alter table public.rsvp_submissions enable row level security;
alter table public.guestbook_messages enable row level security;

create policy "Allow public insert on rsvp_submissions"
  on public.rsvp_submissions for insert with check (true);

create policy "Allow public select and insert on guestbook_messages"
  on public.guestbook_messages for all using (true) with check (true);
```

2. Buat berkas `.env.local` di direktori utama proyek (jangan pernah menyimpan *service_role key* di sisi klien):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
```
