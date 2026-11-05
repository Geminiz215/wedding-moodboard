export interface WeddingEventItem {
  id: string;
  eyebrow: string;
  title: string;
  eventName: string;
  dayDisplay: string;
  dateDisplay: string;
  timeDisplay: string;
  venueName: string;
  hallName: string;
  addressDisplay: string;
  notes: string;
  mapUrl: string;
}

export interface BankAccountItem {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
}

export interface GalleryPhotoItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  date: string;
  caption: string;
  aspect: 'portrait' | 'landscape' | 'square';
}

export interface GuestbookEntry {
  id: string;
  name: string;
  relation: string;
  message: string;
  timestamp: string;
}

export interface WeddingConfig {
  couple: {
    brideShort: string;
    brideFull: string;
    brideRole: string;
    brideFather: string;
    brideMother: string;
    brideParentsPlaceholder: string;
    bridePortrait: string;
    groomShort: string;
    groomFull: string;
    groomRole: string;
    groomFather: string;
    groomMother: string;
    groomParentsPlaceholder: string;
    groomPortrait: string;
  };
  theme: {
    title: string;
    tagline: string;
  };
  weddingDateISO: string;
  rsvpDeadlineDisplay: string;
  timezone: string;
  dateDisplay: string;
  dateUppercase: string;
  dateNumeric: string;
  timeDisplay: string;
  timeUppercase: string;
  venueSummary: string;
  venueCity: string;
  venueFullAddress: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  quranVerse: {
    surahReference: string;
    arabic: string;
    transliteration: string;
    translationId: string;
  };
  story: {
    scriptTitle: string;
    heading: string;
    subtitle: string;
    paragraphs: string[];
    milestones: Array<{
      period: string;
      title: string;
      description: string;
    }>;
  };
  gallery: GalleryPhotoItem[];
  events: {
    akad: WeddingEventItem;
    resepsi: WeddingEventItem;
  };
  dressCode: {
    title: string;
    subtitle: string;
    description: string;
    palette: Array<{ name: string; hex: string }>;
  };
  gift: {
    heading: string;
    subtitle: string;
    accounts: BankAccountItem[];
    digitalWalletNote: string;
  };
  closing: {
    coupleNames: string;
    quote: string;
    thankYouMessage: string;
  };
  music: {
    title: string;
    autoplayAfterOpen: boolean;
  };
  guestPresets: Array<{
    name: string;
    maxQuota: number;
  }>;
  initialGuestbook: GuestbookEntry[];
}

export const weddingConfig: WeddingConfig = {
  couple: {
    brideShort: 'Zahra',
    brideFull: 'Zahra',
    brideRole: 'The Bride',
    brideFather: 'Bapak [Nama Ayah Dummy]',
    brideMother: 'Ibu [Nama Ibu Dummy]',
    brideParentsPlaceholder: 'Putri dari Bapak [Nama Ayah Dummy] dan Ibu [Nama Ibu Dummy]',
    bridePortrait: '/assets/editorial_bouquet_flatlay.jpg',
    groomShort: 'Fachri',
    groomFull: 'Fachri',
    groomRole: 'The Groom',
    groomFather: 'Bapak [Nama Ayah Dummy]',
    groomMother: 'Ibu [Nama Ibu Dummy]',
    groomParentsPlaceholder: 'Putra dari Bapak [Nama Ayah Dummy] dan Ibu [Nama Ibu Dummy]',
    groomPortrait: '/assets/editorial_couple_conservatory.jpg',
  },
  theme: {
    title: 'Soft Romance in Bloom',
    tagline: 'A celebration of love, in a garden of endless blooms, where two hearts become one.',
  },
  weddingDateISO: '2025-06-14T16:00:00+07:00',
  rsvpDeadlineDisplay: '31 May 2025',
  timezone: 'Asia/Jakarta',
  dateDisplay: 'Sabtu, 14 Juni 2025',
  dateUppercase: 'SATURDAY, 14 JUNE 2025',
  dateNumeric: '14 . 06 . 2025',
  timeDisplay: 'Pukul 16.00 WIB',
  timeUppercase: 'AT 4 PM',
  venueSummary: 'The Grand Santika, Jakarta',
  venueCity: 'Jakarta',
  venueFullAddress: 'The Grand Santika Jakarta, Jl. K.S. Tubun No. 7, Slipi, Jakarta Barat, DKI Jakarta 11410',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hotel+Santika+Premiere+Jakarta',
  googleMapsEmbedUrl: 'https://www.google.com/maps?q=Hotel+Santika+Premiere+Slip+Jakarta&output=embed',
  quranVerse: {
    surahReference: 'QS. Ar-Rum: 21',
    arabic:
      'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ',
    transliteration:
      'Wa min āyātihī an khalaqa lakum min anfusikum azwājal litaskunū ilaihā wa ja‘ala bainakum mawaddataw wa raḥmah, inna fī żālika la’āyātil liqaumiy yatafakkarūn.',
    translationId:
      '“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.”',
  },
  story: {
    scriptTitle: 'Their Story',
    heading: 'Their Story',
    subtitle: 'Every love story is beautiful, but ours is our favorite.',
    paragraphs: [
      'Setiap kisah kasih memiliki musim mekarnya sendiri. Bagi Zahra & Fachri, cerita ini bertumbuh dari percakapan sederhana di sebuah sore yang tenang, melintasi berbagai musim kehidupan, hingga akhirnya mekar menjadi keyakinan untuk melangkah bersama seumur hidup.',
      'Kini, dengan restu tulus kedua orang tua dan limpahan rahmat Allah SWT, kami bersiap mengikat janji suci pernikahan di taman penuh bunga yang menjadi saksi awal lembaran baru kami.',
    ],
    milestones: [
      {
        period: 'Chapter I • 2022',
        title: 'First Encounter',
        description:
          'Pertemuan pertama yang membuka lembaran kisah penuh rasa syukur dan percakapan hangat yang tak terlupakan.',
      },
      {
        period: 'Chapter II • 2024',
        title: 'The Promise & Engagement',
        description:
          'Pertemuan hangat kedua keluarga besar yang menyatukan hati dalam restu, doa tulus, dan ikatan lamaran.',
      },
      {
        period: 'Chapter III • 14 June 2025',
        title: 'Soft Romance in Bloom',
        description:
          'Bersama doa restu orang tua, keluarga, dan sahabat tercinta, kami memulai lembaran baru sebagai suami istri di The Grand Santika, Jakarta.',
      },
    ],
  },
  gallery: [
    {
      id: 'photo-1',
      src: '/assets/editorial_couple_conservatory.jpg',
      alt: 'Potret romantis Zahra dan Fachri di konservatori taman bunga',
      title: 'I. In the Conservatory Garden',
      date: 'Spring 2024',
      caption: 'I. Conservatory Vows — Zahra & Fachri dalam nuansa klasik taman bunga peony.',
      aspect: 'portrait',
    },
    {
      id: 'photo-2',
      src: '/assets/editorial_garden_table.jpg',
      alt: 'Tata meja jamuan malam taman Eropa dengan lilin emas dan peony merah muda',
      title: 'II. Candlelit Botanical Table',
      date: 'Autumn 2024',
      caption: 'II. Candlelit Garden Reception — Jamuan malam bertabur bunga peony & cahaya lilin hangat.',
      aspect: 'landscape',
    },
    {
      id: 'photo-3',
      src: '/assets/editorial_bouquet_flatlay.jpg',
      alt: 'Buket peony dusty pink dan kertas undangan pernikahan dengan pita sutra',
      title: 'III. Bespoke Stationery & Blooms',
      date: 'Winter 2024',
      caption: 'III. Botanical Stationery Suite — Buket mawar & peony dusty pink di atas kertas ivory.',
      aspect: 'portrait',
    },
    {
      id: 'photo-4',
      src: '/assets/opt_bow_drapery.jpg',
      alt: 'Detail pita sutra merah muda besar dengan tirai beludru hijau sage dan lilin',
      title: 'IV. Silk Ribbon & Velvet Drapery',
      date: 'June 2025',
      caption: 'IV. Soft Romance in Bloom — Detail pita sutra dusty pink & tirai beludru hijau sage.',
      aspect: 'portrait',
    },
  ],
  events: {
    akad: {
      id: 'akad',
      eyebrow: 'SCENE 05 • THE SACRED CEREMONY',
      title: 'The Sacred Ceremony',
      eventName: 'Akad Nikah',
      dayDisplay: 'Saturday',
      dateDisplay: 'Sabtu, 14 Juni 2025',
      timeDisplay: 'Pukul 16.00 – 17.30 WIB (At 4 PM)',
      venueName: 'The Grand Santika, Jakarta',
      hallName: 'Glasshouse Garden Pavilion',
      addressDisplay: 'Jl. K.S. Tubun No. 7, Slipi, Jakarta Barat, DKI Jakarta 11410',
      notes: 'Mohon hadir 15 menit sebelum prosesi dimulai untuk menjaga kekhidmatan akad nikah.',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hotel+Santika+Premiere+Jakarta',
    },
    resepsi: {
      id: 'resepsi',
      eyebrow: 'SCENE 06 • THE WEDDING RECEPTION',
      title: 'The Wedding Reception',
      eventName: 'Wedding Reception',
      dayDisplay: 'Saturday',
      dateDisplay: 'Sabtu, 14 Juni 2025',
      timeDisplay: 'Pukul 18.30 – 21.30 WIB (At 6:30 PM)',
      venueName: 'The Grand Santika, Jakarta',
      hallName: 'Grand Ballroom & Botanical Terrace',
      addressDisplay: 'Jl. K.S. Tubun No. 7, Slipi, Jakarta Barat, DKI Jakarta 11410',
      notes: 'Jamuan makan malam taman klasik diiringi ansambel musik akustik.',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hotel+Santika+Premiere+Jakarta',
    },
  },
  dressCode: {
    title: 'Formal Attire',
    subtitle: 'Garden Elegance Palette',
    description:
      'Kami mengundang Bapak/Ibu/Saudara/i mengenakan busana formal dengan nuansa warna lembut berikut:',
    palette: [
      { name: 'Dusty Pink', hex: '#E7B8C4' },
      { name: 'Mauve Pink', hex: '#C98AA3' },
      { name: 'Sage Green', hex: '#6B6F52' },
      { name: 'Champagne Gold', hex: '#D8C37B' },
    ],
  },
  gift: {
    heading: 'A Token of Love',
    subtitle:
      'Your presence is the greatest gift. However, if you wish to share a token of affection, we would be honored.',
    accounts: [
      {
        id: 'bca',
        bankName: 'Bank Central Asia (BCA)',
        bankCode: 'BCA',
        accountNumber: '5310982741',
        accountHolder: 'Zahra',
      },
      {
        id: 'mandiri',
        bankName: 'Bank Mandiri',
        bankCode: 'MANDIRI',
        accountNumber: '1370019283746',
        accountHolder: 'Fachri',
      },
    ],
    digitalWalletNote: 'Tersedia juga pengiriman tanda kasih melalui QRIS & alamat kediaman mempelai.',
  },
  closing: {
    coupleNames: 'Zahra & Fachri',
    quote: 'Same love, new chapter.',
    thankYouMessage: 'Thank you for being part of our special day.',
  },
  music: {
    title: 'Soft Romance in Bloom — Instrumental Harp & Piano',
    autoplayAfterOpen: true,
  },
  guestPresets: [
    { name: 'Keluarga Besar Bpk. Wijaya', maxQuota: 2 },
    { name: 'Sahabat — Rania Putri', maxQuota: 1 },
    { name: 'Keluarga Dr. Hendra Kusuma', maxQuota: 4 },
  ],
  initialGuestbook: [
    {
      id: 'gb-1',
      name: 'Keluarga Besar Bpk. Hendrawan',
      relation: 'Kerabat Keluarga',
      message:
        'Selamat menempuh hidup baru untuk Zahra & Fachri. Semoga Allah SWT senantiasa melimpahkan berkah, sakinah, mawaddah, wa rahmah dalam rumah tangga kalian.',
      timestamp: '18 Mei 2025',
    },
    {
      id: 'gb-2',
      name: 'Clarissa & Adi',
      relation: 'Sahabat Mempelai',
      message:
        'Happy wedding Zahra & Fachri! Semoga cinta kalian terus mekar seindah taman bunga ini selamanya. So happy for you both!',
      timestamp: '19 Mei 2025',
    },
    {
      id: 'gb-3',
      name: 'Dr. Farhan & Keluarga',
      relation: 'Rekan Kerja',
      message:
        'Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khair. Selamat berbahagia Zahra dan Fachri!',
      timestamp: '20 Mei 2025',
    },
  ],
};
