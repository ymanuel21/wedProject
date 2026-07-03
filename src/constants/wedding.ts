export const WEDDING_DATA = {
  couple: {
    bride: { fullName: "Dewi Amalia", nickname: "Dewi" },
    groom: { fullName: "Budi Manuel", nickname: "Budi" },
  },
  date: new Date("2027-03-14T09:00:00+07:00"),
  events: {
    ceremony: {
      title: "Pemberkatan Nikah",
      date: "Minggu, 14 Maret 2027",
      time: "09:00 - 11:00 WIB",
      venue: "Gereja Katedral Jakarta",
      address: "Jl. Katedral No.7B, Ps. Baru, Kecamatan Sawah Besar, Kota Jakarta Pusat",
      mapsUrl: "https://maps.google.com/?q=Gereja+Katedral+Jakarta",
    },
    reception: {
      title: "Resepsi Pernikahan",
      date: "Minggu, 14 Maret 2027",
      time: "12:00 - 17:00 WIB",
      venue: "The Ritz-Carlton Jakarta, Pacific Place",
      address: "Jl. Jend. Sudirman Kav 52-53, Senayan, Kebayoran Baru, Jakarta Selatan",
      mapsUrl: "https://maps.google.com/?q=The+Ritz+Carlton+Jakarta+Pacific+Place",
    },
  },
  loveStory: [
    {
      title: "Pertama Bertemu",
      date: "15 Januari 2021",
      description:
        "Kami pertama kali bertemu di sebuah kedai kopi di Menteng. Dewi sedang membaca novel favoritnya, dan Budi tidak sengaja menumpahkan latte-nya. Sebuah awal yang canggung namun tak terlupakan.",
    },
    {
      title: "Pacaran",
      date: "14 Februari 2021",
      description:
        "Setelah sebulan penuh percakapan panjang dan tawa yang tak henti, Budi memberanikan diri untuk menyatakan cintanya di Hari Valentine — di kedai kopi yang sama.",
    },
    {
      title: "Lamaran",
      date: "20 Desember 2026",
      description:
        "Di bawah langit malam yang dipenuhi bintang di Puncak, Budi berlutut dan mengajukan pertanyaan terpenting dalam hidupnya. Dewi menjawab ya dengan air mata bahagia.",
    },
    {
      title: "Pernikahan",
      date: "14 Maret 2027",
      description:
        "Hari ini, kami akan memulai babak baru dalam hidup kami. Terima kasih telah menjadi bagian dari kisah cinta kami.",
    },
  ],
  gallery: [
    { src: "/gallery/1.svg", alt: "Engagement photo" },
    { src: "/gallery/2.svg", alt: "Pre-wedding garden" },
    { src: "/gallery/3.svg", alt: "Beach sunset" },
    { src: "/gallery/4.svg", alt: "Urban pre-wedding" },
    { src: "/gallery/5.svg", alt: "Candid moment" },
    { src: "/gallery/6.svg", alt: "Ring detail" },
  ],
  gift: {
    bankAccounts: [
      {
        bank: "BCA",
        accountNumber: "1234567890",
        accountName: "Dewi Amalia",
      },
      {
        bank: "Mandiri",
        accountNumber: "0987654321",
        accountName: "Budi Manuel",
      },
    ],
    qrisImage: "/qris.svg",
    address: "Jl. Cempaka Putih No. 42, Jakarta Pusat, 10510",
  },
  music: {
    src: "/music/wedding.mp3",
    title: "Canon in D — Pachelbel",
  },
} as const;
