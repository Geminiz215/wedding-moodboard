export interface WeddingEventItem {
  id: string;
  eyebrow: string;
  title: string;
  dateDisplay: string;
  timeDisplay: string;
  venueName: string;
  addressDisplay: string;
  notes: string;
  mapUrl: string;
}

export interface BankAccountItem {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isDemoPlaceholder: boolean;
}

export interface WeddingConfig {
  isDemonstrationContent: boolean;
  couple: {
    brideShort: string;
    brideFull: string;
    brideParentsPlaceholder: string;
    groomShort: string;
    groomFull: string;
    groomParentsPlaceholder: string;
  };
  weddingDateISO: string;
  timezone: string;
  dateDisplay: string;
  timeDisplay: string;
  venueSummary: string;
  heroQuote: string;
  heroIntroId: string;
  story: {
    scriptTitle: string;
    heading: string;
    paragraphs: string[];
    milestones: Array<{
      period: string;
      title: string;
      description: string;
    }>;
  };
  events: WeddingEventItem[];
  dressCode: {
    title: string;
    description: string;
    palette: Array<{ name: string; hex: string }>;
  };
  giftAccounts: BankAccountItem[];
}

export const weddingConfig: WeddingConfig = {
  isDemonstrationContent: true,
  couple: {
    brideShort: 'Aurelia',
    brideFull: 'Aurelia Larasati',
    brideParentsPlaceholder: 'Putri tercinta dari [Nama Ayah Mempelai Wanita] & [Nama Ibu Mempelai Wanita]',
    groomShort: 'Daniel',
    groomFull: 'Daniel Pratama',
    groomParentsPlaceholder: 'Putra tercinta dari [Nama Ayah Mempelai Pria] & [Nama Ibu Mempelai Pria]',
  },
  weddingDateISO: '2027-06-14T16:00:00+07:00',
  timezone: 'Asia/Jakarta',
  dateDisplay: 'Sabtu, 14 Juni 2027',
  timeDisplay: 'Pukul 16.00 WIB',
  venueSummary: 'The Grand Santika, Jakarta',
  heroQuote: 'In a garden of endless blooms, where two hearts become one.',
  heroIntroId:
    'Dengan penuh rasa syukur dan sukacita, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada perayaan ikatan suci pernikahan kami.',
  story: {
    scriptTitle: 'Same love, new chapter',
    heading: 'Kisah Perjalanan Kami',
    paragraphs: [
      'Setiap perjalanan kasih memiliki musim mekarnya sendiri. Bagian ini disediakan bagi Aurelia & Daniel untuk membagikan kisah pertemuan pertama hingga keputusan tulus untuk menyatukan janji suci pernikahan.',
      'Seluruh paragraf dan tonggak waktu ini menggunakan teks penampung editorial yang jujur dan dapat diperbarui langsung pada berkas src/config/weddingConfig.ts.',
    ],
    milestones: [
      {
        period: 'Babak Pertama • [Tahun Pertemuan]',
        title: 'Awal Perkenalan',
        description: '[Contoh Milestone 1] Tuliskan momen ketika kedua mempelai pertama kali dipertemukan.',
      },
      {
        period: 'Babak Kedua • [Tahun Lamaran]',
        title: 'Mengikat Janji & Lamaran',
        description: '[Contoh Milestone 2] Ceritakan momen ketika kedua keluarga saling bersilaturahmi dan merestui niat baik.',
      },
      {
        period: 'Babak Baru • 14 Juni 2027',
        title: 'Hari Bahagia Kami',
        description: 'Bersama doa restu orang tua, keluarga, dan sahabat tercinta, kami memulai lembaran baru di The Grand Santika, Jakarta.',
      },
    ],
  },
  events: [
    {
      id: 'ceremony',
      eyebrow: 'Bagian Pertama',
      title: 'Pemberkatan & Akad',
      dateDisplay: 'Sabtu, 14 Juni 2027',
      timeDisplay: 'Pukul 16.00 – 17.30 WIB',
      venueName: 'The Grand Santika, Jakarta',
      addressDisplay: 'Glasshouse Garden Pavilion • [Alamat Lengkap Venue — Konfirmasi Sebelum Publikasi]',
      notes: 'Mohon hadir 15 menit sebelum prosesi dimulai untuk menjaga kekhidmatan acara.',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hotel+Santika+Premiere+Jakarta',
    },
    {
      id: 'reception',
      eyebrow: 'Bagian Kedua',
      title: 'Resepsi & Jamuan Malam',
      dateDisplay: 'Sabtu, 14 Juni 2027',
      timeDisplay: 'Pukul 18.30 – 21.30 WIB',
      venueName: 'The Grand Santika, Jakarta',
      addressDisplay: 'Grand Ballroom & Botanical Terrace • [Alamat Lengkap Venue — Konfirmasi Sebelum Publikasi]',
      notes: 'Jamuan makan malam taman klasik diiringi ansambel musik akustik.',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hotel+Santika+Premiere+Jakarta',
    },
  ],
  dressCode: {
    title: 'Formal Attire / Garden Elegance',
    description: 'Kami menyarankan busana formal dengan nuansa warna lembut berikut (hindari warna putih bersih):',
    palette: [
      { name: 'Dusty Pink', hex: '#E7B8C4' },
      { name: 'Mauve Rose', hex: '#C98AA3' },
      { name: 'Sage Green', hex: '#6B6F52' },
      { name: 'Champagne', hex: '#D8C37B' },
    ],
  },
  giftAccounts: [
    {
      id: 'bca-demo',
      bankName: 'Bank Central Asia (BCA)',
      accountNumber: '000012345678',
      accountHolder: '[Nama Penerima — Aurelia Larasati]',
      isDemoPlaceholder: true,
    },
    {
      id: 'mandiri-demo',
      bankName: 'Bank Mandiri',
      accountNumber: '000098765432',
      accountHolder: '[Nama Penerima — Daniel Pratama]',
      isDemoPlaceholder: true,
    },
  ],
};
