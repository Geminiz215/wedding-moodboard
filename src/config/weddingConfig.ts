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
}

export interface WeddingConfig {
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
  couple: {
    brideShort: 'Aurelia',
    brideFull: 'Aurelia Larasati',
    brideParentsPlaceholder: 'Putri tercinta dari Bpk. Bambang Larasati & Ibu Endang Larasati',
    groomShort: 'Daniel',
    groomFull: 'Daniel Pratama',
    groomParentsPlaceholder: 'Putra tercinta dari Bpk. Hendrawan Pratama & Ibu Rina Pratama',
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
      'Setiap kisah kasih memiliki musim mekarnya sendiri. Berawal dari perjumpaan sederhana yang sarat ketulusan, kami belajar untuk saling memahami, bertumbuh bersama, dan melangkah berdampingan melewati ragam cerita kehidupan.',
      'Kini, dengan restu tulus kedua orang tua dan limpahan rahmat Tuhan, kami bersiap mengikat janji suci pernikahan, melangkah ke lembaran baru yang dipenuhi pengharapan dan cinta abadi.',
    ],
    milestones: [
      {
        period: 'Babak Pertama • Musim Semi 2023',
        title: 'Awal Perkenalan',
        description: 'Pertemuan pertama yang membuka lembaran kisah penuh rasa syukur dan percakapan tanpa akhir.',
      },
      {
        period: 'Babak Kedua • Akhir Tahun 2026',
        title: 'Mengikat Janji & Lamaran',
        description: 'Pertemuan hangat kedua keluarga besar yang menyatukan hati dalam restu dan doa tulus.',
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
      addressDisplay: 'Glasshouse Garden Pavilion, The Grand Santika Jakarta, Jl. K.S. Tubun No. 7, Slipi, Jakarta Barat',
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
      addressDisplay: 'Grand Ballroom & Botanical Terrace, The Grand Santika Jakarta, Jl. K.S. Tubun No. 7, Slipi, Jakarta Barat',
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
      id: 'bca',
      bankName: 'Bank Central Asia (BCA)',
      accountNumber: '5310982741',
      accountHolder: 'Aurelia Larasati',
    },
    {
      id: 'mandiri',
      bankName: 'Bank Mandiri',
      accountNumber: '1370019283746',
      accountHolder: 'Daniel Pratama',
    },
  ],
};
