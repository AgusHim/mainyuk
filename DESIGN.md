# DESAIN.md

# YukNgaji Solo — Landing Page Design Guideline
**Project:** `ynsolo.id`  
**Brand:** YukNgaji Solo  
**Positioning:** Modern Islamic Community & Youth Movement  
**Primary reference:** https://yn.academy/  
**Current website:** https://ynsolo.id/

---

## 1. PURPOSE

Dokumen ini adalah **source of truth untuk AI Agent / Coding Agent** saat merombak
landing page `ynsolo.id`.

Target akhir:

> Membuat YukNgaji Solo terasa seperti komunitas muda yang modern, hangat,
> relevan, aktif, dan premium — bukan seperti template website organisasi,
> sekolah, atau portal event biasa.

Referensi visual utama adalah **arah desain modern/editorial/premium** seperti
YN Academy. Yang diambil adalah **design language**, bukan menyalin identitas,
copywriting, layout secara literal, atau aset mereka.

### Karakter visual yang harus terasa

- Modern
- Minimal
- Warm
- Editorial
- Human
- Premium
- Youthful
- Islamic
- Community-driven
- Approachable
- Calm tetapi tetap hidup

### Kalimat pengarah desain

> **Modern community website with an editorial feel, strong typography,
> authentic photography, generous whitespace, and a warm Islamic identity.**

---

# 2. CURRENT WEBSITE ANALYSIS

Website saat ini sangat sederhana dan berpusat pada identitas komunitas serta
beberapa aksi utama.

Konten utama yang terlihat saat ini:

- YukNgaji Solo
- `#TemanBahagia`
- Walking Tour
- Kepoin Admin
- Fun Sport
- Donasi & Support
- Momen Bahagia
- Event Terbaru
- Navigation: Home, Events, Transaksi

Sumber:
https://ynsolo.id/

### Masalah desain yang ingin diselesaikan

AI Agent harus menganggap redesign ini sebagai **evolution**, bukan sekadar
ganti warna atau mempercantik halaman.

Target perbaikan:

1. Hero harus memiliki storytelling yang kuat.
2. `#TemanBahagia` harus menjadi identitas emosional, bukan hanya tagline.
3. Event harus menjadi salah satu conversion point utama.
4. Aktivitas komunitas harus terasa hidup melalui photography.
5. CTA harus jelas tetapi tidak membuat halaman terasa seperti kumpulan tombol.
6. Visual hierarchy harus jauh lebih kuat.
7. Website harus terasa seperti brand/community platform, bukan link aggregator.
8. Mobile experience harus menjadi prioritas.
9. Navigation harus lebih terstruktur.
10. Informasi tetap mudah ditemukan tanpa membuat halaman penuh teks.

---

# 3. DESIGN PRINCIPLES

## Principle 01 — Whitespace First

Whitespace adalah bagian dari desain.

Jangan mengisi ruang kosong hanya agar section terlihat "ramai".

Gunakan section spacing besar:

```css
section {
  padding-block: clamp(72px, 10vw, 160px);
}
```

Hero boleh memiliki spacing lebih besar:

```css
.hero {
  padding-top: clamp(96px, 12vw, 180px);
}
```

---

## Principle 02 — Typography Is the Main Visual

Jangan terlalu bergantung pada icon, card, badge, atau dekorasi.

Headline besar adalah salah satu elemen visual utama.

Contoh direction:

```text
Teman untuk
tumbuh dan
bahagia bersama.
```

atau:

```text
Cari teman.
Temukan makna.
Tumbuh bersama.
```

Copy final disesuaikan dengan brand/content aktual.

---

## Principle 03 — Human Before UI

Website harus terasa seperti komunitas manusia.

Prioritaskan:

- wajah
- interaksi
- aktivitas
- event
- kebersamaan
- moment
- stories

daripada:

- decorative icon
- statistics card
- generic illustrations
- dashboard-like components

---

## Principle 04 — Premium, Not Luxurious

Premium berarti:

- spacing rapi
- typography kuat
- imagery bagus
- interaction halus
- hierarchy jelas

Bukan:

- gold everywhere
- gradient berlebihan
- glassmorphism
- excessive shadow
- 3D object
- animation berlebihan

---

# 4. BRAND PERSONALITY

YukNgaji Solo harus terasa:

### Friendly
Tidak kaku atau terlalu formal.

### Young
Bahasa visual cocok untuk anak muda dan komunitas.

### Faith-centered
Nilai Islam hadir secara natural.

### Inclusive
Pengunjung baru tidak boleh merasa seperti "orang luar".

### Active
Harus terasa ada kegiatan nyata.

### Meaningful
Aktivitas bukan sekadar acara, tetapi bagian dari perjalanan komunitas.

---

# 5. VISUAL DIRECTION

Gunakan kombinasi:

```text
Modern Editorial
        +
Islamic Community
        +
Youth Lifestyle
        +
Event Culture
```

Bayangan visual:

- modern magazine
- premium community platform
- lifestyle brand
- Islamic youth movement
- curated event platform

Hindari visual:

- website masjid klasik
- template sekolah
- portal berita
- marketplace
- SaaS dashboard
- landing page startup penuh gradient

---

# 6. COLOR SYSTEM

Gunakan base neutral yang hangat.

```css
:root {
  --background: #F8F7F3;
  --foreground: #171717;

  --surface: #FFFFFF;
  --surface-muted: #F0EFE9;

  --border: #E4E2DA;

  --accent: #1F6B5A;
  --accent-dark: #174F43;
  --accent-soft: #E5F0EC;

  --muted: #6F6D66;
}
```

### Rules

- Background utama: off-white/warm neutral
- Text: near-black
- Accent: hijau muted / warna brand
- White digunakan sebagai surface
- Border sangat subtle

### DILARANG

Jangan memakai:

- neon green
- bright cyan
- purple gradient
- rainbow gradient
- glow
- gold sebagai warna utama
- 5+ warna brand secara bersamaan

Maksimum:

```text
1 primary accent
1 accent soft
neutral palette
```

---

# 7. TYPOGRAPHY

Typography harus menjadi salah satu focal point.

## Recommended fonts

Primary:

- Geist
- Inter
- Plus Jakarta Sans
- DM Sans

Optional editorial accent:

- Instrument Serif
- Playfair Display
- Lora
- Cormorant Garamond

Jangan membuat seluruh website memakai serif.

---

## Typography scale

### Hero

Desktop:

```css
font-size: clamp(3.5rem, 7vw, 7rem);
line-height: 0.95;
letter-spacing: -0.05em;
font-weight: 600;
```

Mobile:

```css
font-size: clamp(2.8rem, 12vw, 4.5rem);
line-height: 0.98;
letter-spacing: -0.04em;
```

### H2

```css
font-size: clamp(2.4rem, 5vw, 5rem);
line-height: 1;
letter-spacing: -0.045em;
```

### Body

```css
font-size: 18px;
line-height: 1.7;
```

Mobile:

```css
font-size: 16px;
line-height: 1.65;
```

---

# 8. CONTAINER

Desktop:

```css
.container {
  width: min(1280px, calc(100% - 64px));
  margin-inline: auto;
}
```

Mobile:

```css
.container {
  width: min(100% - 40px, 1280px);
}
```

Untuk section yang sangat visual, boleh memakai container lebih lebar:

```text
1360px - 1440px
```

Text block jangan terlalu lebar.

```css
.text-content {
  max-width: 650px;
}
```

---

# 9. GRID

Gunakan 12-column grid untuk layout editorial kompleks.

```css
grid-template-columns: repeat(12, 1fr);
gap: 24px;
```

Untuk section sederhana:

```css
grid-template-columns: repeat(2, minmax(0, 1fr));
```

Mobile:

```css
grid-template-columns: 1fr;
```

### Rules

Jangan membuat semua section memiliki pola grid yang sama.

Variasikan:

- centered
- asymmetric
- 2-column
- large image + text
- text + stacked list
- bento editorial
- full-width visual

---

# 10. HEADER

Header harus minimal.

Desktop:

```text
[Logo]      About   Events   Activities   Community      [Join Us]
```

Alternatif jika navigasi perlu lebih singkat:

```text
[Logo]      Events   Activities   About      [Gabung]
```

### Behavior

Initial:

- clean
- low visual weight
- no huge navbar
- no giant shadow

On scroll:

- subtle surface/background
- subtle blur boleh digunakan
- border bawah sangat halus

Mobile:

```text
[Logo]                                      [Menu]
```

Menu drawer harus simple.

### Header CTA

Primary CTA yang direkomendasikan:

```text
Gabung Komunitas
```

atau berdasarkan flow aktual aplikasi:

```text
Lihat Event
```

Jangan memiliki 3–5 CTA di navbar.

---

# 11. HERO

Hero harus menjadi area paling kuat di seluruh halaman.

## Goal

Pengunjung dalam 5 detik harus mengerti:

1. Siapa YukNgaji Solo.
2. Apa yang mereka lakukan.
3. Mengapa pengunjung harus peduli.
4. Apa langkah berikutnya.

---

## Recommended hero structure

```text
EYEBROW

YUKNGAJI SOLO

Teman untuk
tumbuh dan
bahagia bersama.

Short supporting copy.

[ Lihat Event ] [ Kenal Lebih Dekat ]

social proof / community indicator

                         LARGE PHOTO
                         LARGE PHOTO
                         LARGE PHOTO
```

---

## Hero alternative

Gunakan large editorial photography:

```text
┌──────────────────────────────────────────────┐
│                                              │
│  YUKNGAJI SOLO                               │
│                                              │
│  Teman untuk                                 │
│  tumbuh dan                                  │
│  bahagia bersama.                            │
│                                              │
│  Supporting text                             │
│                                              │
│  [ Lihat Event ]                             │
│                                              │
├──────────────────────────────────────────────┤
│            LARGE COMMUNITY PHOTO             │
│                                              │
└──────────────────────────────────────────────┘
```

Hero image harus terasa seperti dokumentasi komunitas nyata.

---

# 12. `#TEMANBAHAGIA`

`#TemanBahagia` adalah aset brand yang sudah dimiliki dan harus dipertahankan.

Jangan membuangnya tanpa alasan.

Tetapi ubah perannya dari sekadar tagline menjadi **brand story**.

Contoh:

```text
#TEMANBAHAGIA

Hidup lebih seru ketika dijalani bersama.

YukNgaji Solo hadir sebagai ruang bertemu,
belajar, bergerak, dan bertumbuh bersama.
```

Visual:

- large typography
- subtle accent
- one strong photograph
- generous whitespace

Jangan menjadikan section ini seperti card biasa.

---

# 13. COMMUNITY STORY

Section ini menjawab:

> "YukNgaji Solo itu sebenarnya apa?"

Pattern:

```text
SMALL EYEBROW

Bukan hanya datang ke event.

Kami membangun ruang untuk
bertemu, belajar, bergerak,
dan tumbuh bersama.

                         IMAGE
                         IMAGE
```

Tone harus human dan conversational.

---

# 14. ACTIVITIES / PROGRAMS

Aktivitas yang saat ini terlihat:

- Walking Tour
- Fun Sport
- Event komunitas
- komunikasi/admin
- donasi/support

Jangan tampilkan semuanya sebagai 5 card identik.

Gunakan editorial layout.

Contoh:

```text
AKTIVITAS

01  WALKING TOUR
    Bergerak, ngobrol, dan menikmati kota
    bersama teman-teman.

02  FUN SPORT
    Olahraga santai dan membangun
    kebersamaan.

03  EVENT
    Ruang belajar, berbagi, dan bertemu.
```

Gunakan numbering besar sebagai visual.

---

# 15. ACTIVITY CARD

Jika card memang diperlukan:

```css
.activity-card {
  border-radius: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 28px;
}
```

Hover:

```css
transform: translateY(-4px);
transition: 220ms ease-out;
```

Jangan menggunakan:

- thick border
- glowing shadow
- gradient
- icon besar berwarna-warni

---

# 16. EVENTS

Event harus menjadi salah satu primary conversion.

Section:

```text
EVENT TERBARU

Temukan kegiatan
berikutnya bersamamu.

[Event Card]
[Event Card]
[Event Card]

Lihat Semua Event →
```

---

## Event card

Prioritas visual:

1. Poster/foto
2. Event title
3. Date
4. Location
5. Short label
6. CTA

Contoh:

```text
┌──────────────────────────┐
│                          │
│          IMAGE           │
│                          │
└──────────────────────────┘

15 SEP 2026
Community

Walking Tour Solo

Solo, Jawa Tengah

Lihat Detail →
```

Image radius:

```text
24px
```

Metadata:

```text
12px - 14px
```

Title:

```text
20px - 28px
```

---

# 17. EVENT FEATURED

Event terdekat / event utama boleh memiliki treatment lebih besar.

Pattern:

```text
┌──────────────────────────────────────────┐
│                                          │
│              LARGE IMAGE                 │
│                                          │
├───────────────────────┬──────────────────┤
│ DATE                  │ TITLE            │
│                       │                  │
│ LOCATION              │ DESCRIPTION      │
│                       │                  │
│                       │ [ Lihat Event ]  │
└───────────────────────┴──────────────────┘
```

Featured event jangan dibuat seperti banner iklan.

---

# 18. MOMEN BAHAGIA

Section "Momen Bahagia" dari website lama harus dipertahankan,
tetapi dibuat lebih editorial.

Tujuan:

> Membuktikan bahwa komunitas ini benar-benar hidup.

---

## Recommended layout

Jangan gunakan gallery grid biasa 3x3.

Gunakan:

```text
┌───────────────────┬───────────────┐
│                   │               │
│   LARGE IMAGE     │   IMAGE       │
│                   │               │
├───────────────────┤               │
│                   │               │
│   IMAGE           │               │
│                   │               │
└───────────────────┴───────────────┘
```

Boleh menggunakan masonry/asymmetric grid.

Photo harus menjadi konten.

---

# 19. PHOTO STYLE

Gunakan:

- candid
- natural light
- genuine interaction
- outdoor activity
- group moments
- learning
- sports
- community gathering
- laughing / conversation
- city exploration

Hindari:

- generic corporate stock photo
- fake handshake
- terlalu banyak posed portrait
- over-edited photo
- artificial gradient overlay

---

# 20. IMAGE TREATMENT

Recommended:

```css
img {
  object-fit: cover;
  border-radius: 24px;
}
```

Large:

```css
border-radius: 32px;
```

Shadow harus subtle atau bahkan tanpa shadow.

```css
box-shadow: 0 12px 40px rgba(0,0,0,.05);
```

Jika image sudah kuat, no shadow lebih baik.

---

# 21. COMMUNITY NUMBERS / SOCIAL PROOF

Gunakan hanya jika data benar-benar tersedia.

Contoh:

```text
500+
Teman yang pernah bergabung

50+
Kegiatan

5 tahun
Bertumbuh bersama
```

Jangan mengarang angka.

Jika angka belum tersedia, gunakan social proof kualitatif:

```text
Belajar
Bergerak
Bertumbuh
Bersama
```

---

# 22. TESTIMONIAL

Jika testimonial tersedia, gunakan format editorial.

Jangan:

```text
★★★★★
"Best community..."
```

seperti marketplace.

Lebih baik:

```text
"Awalnya datang sendiri.
Sekarang setiap ada kegiatan,
selalu ada teman untuk diajak."

Nama
Community member
```

Gunakan 1–3 testimonial kuat.

---

# 23. CTA

CTA utama harus mengarahkan user pada action nyata.

Prioritas:

```text
Lihat Event
```

atau:

```text
Gabung Komunitas
```

atau:

```text
Kepoin Kegiatan
```

CTA sekunder:

```text
Kepoin Admin
```

Gunakan maksimal dua CTA utama per section.

---

# 24. DONATION / SUPPORT

"Donasi & Support" sudah merupakan fungsi penting.

Jangan dibuat seperti iklan donation banner.

Gunakan section sederhana:

```text
DUKUNG GERAKAN INI

Setiap kegiatan tumbuh karena ada
teman-teman yang ikut mendukung.

[ Dukung YukNgaji Solo ]
```

Gunakan tone:

- gratitude
- transparent
- community-oriented

Bukan:

- guilt
- urgency manipulation
- aggressive fundraising

---

# 25. WHATSAPP CTA

Karena website saat ini memiliki CTA "Kepoin Admin",
WhatsApp tetap boleh menjadi conversion channel penting.

Visual:

```text
Punya pertanyaan?

Ngobrol langsung dengan admin YukNgaji Solo.

[ Chat dengan Admin ]
```

Jangan meletakkan tombol WhatsApp floating yang terlalu besar.

Floating button jika dipakai:

```text
small
subtle
mobile-friendly
```

---

# 26. FOOTER

Footer harus minimal.

Recommended:

```text
YUKNGAJI SOLO

Komunitas yang tumbuh bersama.

Navigation
Home
Events
Activities
About

Support
Kepoin Admin
Donasi & Support

Social
Instagram
YouTube

© 2026 YukNgaji Solo
```

Gunakan text muted.

Tidak perlu 5–7 kolom.

---

# 27. PAGE STRUCTURE

Landing page utama direkomendasikan:

```text
1. Header
2. Hero
3. #TemanBahagia / Brand Story
4. Community Introduction
5. Activities / Programs
6. Featured Event
7. Event Terbaru
8. Momen Bahagia
9. Community / Testimonial
10. Support / Donation
11. Final CTA
12. Footer
```

---

# 28. SECTION RHYTHM

Jangan membuat seluruh page terlihat seperti kumpulan card.

Gunakan rhythm:

```text
Hero                  → typography
Brand story           → typography + image
Community             → editorial text
Activities            → structured list
Featured event        → large visual
Events                → cards
Moments               → gallery
Testimonial           → typography
Support               → simple CTA
Final CTA             → strong typography
Footer                → minimal
```

Dengan demikian setiap section memiliki "job" yang berbeda.

---

# 29. DARK SECTION

Gunakan dark section secara selektif.

Recommended:

```css
background: #171717;
color: #FFFFFF;
```

Cocok untuk:

- Final CTA
- Testimonial
- Brand statement
- Support

Jangan membuat semua section dark.

---

# 30. BORDER RADIUS

Gunakan konsisten:

```text
Button:       9999px
Small card:   16px
Card:         24px
Large image:  28px–32px
Section panel: 32px
```

Jangan mencampurkan 8–10 tipe radius.

---

# 31. BUTTON SYSTEM

## Primary

```css
background: var(--accent);
color: #fff;
border-radius: 9999px;
padding: 14px 22px;
```

## Secondary

```css
background: transparent;
border: 1px solid var(--border);
border-radius: 9999px;
padding: 14px 22px;
```

## Dark CTA

```css
background: #171717;
color: #fff;
```

### Interaction

```css
transition: all 180ms ease-out;
```

Hover:

```text
translateY(-1px)
slight background change
```

Tidak boleh:

- glow
- gradient animation
- huge shadow
- excessive scale

---

# 32. ICON SYSTEM

Gunakan satu icon library.

Recommended:

```text
Lucide
```

Icon:

```text
16px–20px
```

Gunakan icon hanya jika membantu memahami fungsi.

Jangan memasang icon di setiap heading.

---

# 33. ANIMATION

Animation harus subtle.

Recommended:

```text
fade + translateY
image scale 1 → 1.02
button translateY -1px
card translateY -2px
```

Duration:

```text
180ms–700ms
```

Scroll reveal:

```text
opacity: 0 → 1
transform: translateY(20px) → translateY(0)
```

Stagger:

```text
80ms–120ms
```

### DILARANG

- parallax berlebihan
- text flying around
- cursor gimmicks
- infinite floating animation
- auto-changing hero text yang cepat
- excessive motion

---

# 34. ACCESSIBILITY

Wajib:

- semantic HTML
- correct heading hierarchy
- keyboard navigation
- visible focus state
- image alt text
- contrast yang baik
- buttons memakai `<button>`
- navigation memakai `<a>`
- reduced motion support

Gunakan:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

# 35. RESPONSIVE DESIGN

Mobile bukan desktop yang diperkecil.

## Desktop

- large typography
- asymmetric layout
- large image
- horizontal navigation
- generous spacing

## Mobile

- one-column
- clear hierarchy
- compact navigation
- CTA mudah dijangkau
- image tetap dominan
- content tidak terlalu panjang

Hero mobile:

```text
Eyebrow
↓
Large heading
↓
Supporting copy
↓
CTA
↓
Hero image
```

Jangan:

```text
heading
image
button
image
text
button
```

yang membuat flow kacau.

---

# 36. MOBILE NAVIGATION

Gunakan:

```text
[Logo] [Menu]
```

Drawer:

```text
Home
Events
Activities
About
Support

[Gabung Komunitas]
```

Drawer tidak perlu full-screen animation yang berat.

---

# 37. MOBILE CTA

CTA touch target minimal:

```text
44px
```

Button boleh full-width pada section tertentu:

```css
width: 100%;
```

terutama:

- event CTA
- community CTA
- support CTA

---

# 38. SEO / CONTENT STRUCTURE

Landing page harus memakai hierarchy semantic:

```html
<header>
<nav>

<main>

<section>
<h1>
<h2>
<h3>

<footer>
```

Hanya satu `h1` utama.

Suggested H1 direction:

```text
Teman untuk tumbuh
dan bahagia bersama.
```

atau copy final yang lebih sesuai dengan strategi brand.

H2 harus menjelaskan section.

Contoh:

```text
Temukan kegiatan berikutnya
Tempat kami bertemu
Momen yang kami bagi
Tumbuh bersama
```

---

# 39. MICROCOPY

Tone copy:

- natural
- pendek
- conversational
- optimistic
- warm
- thoughtful

### Hindari

```text
Kami adalah platform terbaik...
```

```text
Solusi inovatif untuk generasi...
```

```text
Jadilah bagian dari revolusi...
```

Bahasa harus terdengar seperti manusia.

---

# 40. ISLAMIC VISUAL IDENTITY

Islamic identity harus terasa **natural**, bukan dekoratif.

Gunakan:

- values
- photography
- language
- calm colors
- meaningful messaging

Boleh memakai elemen dekoratif yang sangat halus:

- subtle geometric line
- small pattern
- Arabic-inspired grid

Tetapi jangan:

- pattern memenuhi background
- bulan sabit di semua section
- kaligrafi di setiap section
- ornamen gold berlebihan
- icon masjid di mana-mana

---

# 41. WHAT NOT TO COPY FROM YN ACADEMY

Referensi visual bukan berarti clone.

JANGAN menyalin:

- exact layout
- exact text
- exact illustration
- exact photography
- exact component arrangement
- exact spacing jika menghasilkan visual yang identik
- branding
- logo
- asset

Yang boleh diadopsi:

- editorial whitespace
- strong typography
- warm neutral palette
- rounded imagery
- asymmetrical layouts
- subtle interaction
- content-first design
- premium simplicity

---

# 42. TECHNICAL IMPLEMENTATION

Jika menggunakan Next.js:

Prioritaskan:

- Server Components
- semantic HTML
- CSS/Tailwind
- `next/image`
- responsive design
- optimized assets
- minimal client-side JavaScript

Gunakan client component hanya saat diperlukan:

- interactive menu
- carousel
- animation control
- dynamic event filters
- modal

Jangan menjadikan seluruh landing page client component tanpa alasan.

---

# 43. COMPONENT ARCHITECTURE

Recommended:

```text
components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── MobileMenu.tsx
│
├── sections/
│   ├── Hero.tsx
│   ├── TemanBahagia.tsx
│   ├── CommunityIntro.tsx
│   ├── Activities.tsx
│   ├── FeaturedEvent.tsx
│   ├── Events.tsx
│   ├── Moments.tsx
│   ├── Testimonial.tsx
│   ├── Support.tsx
│   └── FinalCTA.tsx
│
└── ui/
    ├── Button.tsx
    ├── Container.tsx
    ├── EventCard.tsx
    ├── ActivityItem.tsx
    └── ImageCard.tsx
```

Jangan membuat `page.tsx` menjadi satu file besar.

---

# 44. DATA-DRIVEN CONTENT

Event, activities, gallery, testimonial, dan social links sebaiknya
bersumber dari data/config/API apabila backend sudah tersedia.

Contoh:

```ts
type Event = {
  title: string;
  date: string;
  location: string;
  image: string;
  href: string;
};
```

Jangan hardcode seluruh event langsung di JSX jika data dinamis tersedia.

---

# 45. IMAGE PERFORMANCE

Gunakan:

```tsx
<Image />
```

dengan:

- width/height yang benar
- appropriate `sizes`
- priority untuk hero
- lazy loading untuk below-the-fold
- WebP/AVIF jika pipeline mendukung

Hero image:

```text
priority = true
```

Gallery images:

```text
loading = lazy
```

Jangan memuat image resolution sangat besar jika tampil hanya 300px.

---

# 46. PERFORMANCE TARGET

Target:

```text
Fast first load
Minimal JS
Optimized images
No layout shift
Responsive immediately
```

Jangan menambahkan library besar hanya untuk:

- simple animation
- simple menu
- simple carousel
- simple fade

Prefer CSS/native web APIs jika cukup.

---

# 47. SEO TARGET

Pastikan:

```text
title
description
Open Graph
Twitter Card
canonical URL
favicon
structured metadata
```

Suggested title:

```text
YukNgaji Solo — Teman untuk Tumbuh dan Bahagia Bersama
```

Final SEO copy harus disesuaikan dengan keyword strategy aktual.

Jangan keyword stuffing.

---

# 48. SOCIAL / SHARE

Pastikan link utama mudah ditemukan:

- Instagram
- WhatsApp
- YouTube
- platform komunitas lain jika tersedia

Social icon sebaiknya berada:

- footer
- contact/support area

Jangan memenuhi hero dengan social icons.

---

# 49. DESIGN TOKENS

Centralize tokens.

```css
:root {
  --background: #F8F7F3;
  --foreground: #171717;

  --surface: #FFFFFF;
  --surface-muted: #F0EFE9;

  --border: #E4E2DA;

  --accent: #1F6B5A;
  --accent-dark: #174F43;
  --accent-soft: #E5F0EC;

  --muted: #6F6D66;

  --radius-sm: 16px;
  --radius-md: 24px;
  --radius-lg: 32px;
  --radius-pill: 9999px;
}
```

Spacing:

```text
4
8
12
16
24
32
48
64
96
120
160
```

Gunakan spacing scale yang konsisten.

---

# 50. DESIGN QA

Sebelum menganggap redesign selesai, AI Agent wajib melakukan visual review
pada:

```text
Desktop 1440px
Desktop 1280px
Tablet 1024px
Mobile 390px
Mobile 375px
```

Periksa:

### Hero

- [ ] headline kuat
- [ ] CTA jelas
- [ ] image tidak rusak
- [ ] tidak terlalu padat

### Typography

- [ ] hierarchy jelas
- [ ] tidak terlalu kecil
- [ ] line-height nyaman
- [ ] text width terbatas

### Spacing

- [ ] section punya breathing room
- [ ] tidak terlalu rapat
- [ ] tidak ada random margins

### Images

- [ ] ratio konsisten
- [ ] crop bagus
- [ ] loading baik
- [ ] alt tersedia

### Components

- [ ] button konsisten
- [ ] radius konsisten
- [ ] border konsisten
- [ ] hover subtle

### Mobile

- [ ] tidak horizontal overflow
- [ ] CTA mudah disentuh
- [ ] menu jelas
- [ ] image tetap menarik

---

# 51. AI AGENT ABSOLUTE RULES

AI AGENT **HARUS**:

1. Mempertahankan identitas YukNgaji Solo.
2. Mempertahankan `#TemanBahagia` sebagai aset brand.
3. Menjadikan event sebagai conversion utama.
4. Mengutamakan authentic community photography.
5. Menggunakan whitespace besar.
6. Menggunakan typography besar.
7. Menjaga visual hierarchy.
8. Membuat mobile-first interaction.
9. Menggunakan neutral + one accent color.
10. Menggunakan animation secara subtle.
11. Menjaga accessibility.
12. Menjaga performance.

AI AGENT **DILARANG**:

1. Membuat desain seperti dashboard.
2. Mengubah semua content menjadi card.
3. Menambahkan gradient tanpa alasan.
4. Menggunakan emoji sebagai elemen desain.
5. Menggunakan terlalu banyak icon.
6. Menggunakan shadow berat.
7. Menggunakan terlalu banyak warna.
8. Membuat hero penuh badge.
9. Meng-copy desain YN Academy secara literal.
10. Mengarang statistik, testimonial, event, atau informasi komunitas.
11. Mengorbankan readability demi visual.
12. Mengorbankan performance demi animation.

---

# 52. FINAL INFORMATION ARCHITECTURE

Target final:

```text
HOME
│
├── Hero
│
├── #TemanBahagia
│
├── Tentang YukNgaji Solo
│
├── Aktivitas
│   ├── Walking Tour
│   ├── Fun Sport
│   └── Kegiatan lainnya
│
├── Featured Event
│
├── Event Terbaru
│
├── Momen Bahagia
│
├── Testimonial / Community Proof
│
├── Support
│
├── Final CTA
│
└── Footer
```

Supporting routes:

```text
/events
/transaksi
```

Route lain dipertahankan sesuai aplikasi/backend yang sudah ada.

---

# 53. GOLDEN RULE

Ketika AI Agent bingung memilih desain:

### Pilih whitespace
daripada decoration.

### Pilih typography
daripada icon.

### Pilih authentic photo
daripada stock illustration.

### Pilih simplicity
daripada banyak komponen.

### Pilih human
daripada corporate.

### Pilih readability
daripada visual gimmick.

### Pilih community experience
daripada link aggregator.

---

# 54. TARGET FEEL

Ketika user membuka `ynsolo.id`, reaction yang diharapkan:

> "Ini bukan sekadar website event.
> Ini komunitas yang ingin saya kenal."

Visual harus membuat YukNgaji Solo terasa:

**Modern × Human × Islamic × Youthful × Warm × Active × Premium**

---

# 55. SOURCE / REFERENCE

Current website:

https://ynsolo.id/

Primary visual reference:

https://yn.academy/

Gunakan kedua website tersebut sebagai referensi konteks dan arah,
tetapi **identitas final harus tetap milik YukNgaji Solo**.
