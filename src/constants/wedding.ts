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
      image: "/images/events/ceremony.jpg",
    },
    reception: {
      title: "Resepsi Pernikahan",
      date: "Minggu, 14 Maret 2027",
      time: "12:00 - 17:00 WIB",
      venue: "The Ritz-Carlton Jakarta, Pacific Place",
      address: "Jl. Jend. Sudirman Kav 52-53, Senayan, Kebayoran Baru, Jakarta Selatan",
      mapsUrl: "https://maps.google.com/?q=The+Ritz+Carlton+Jakarta+Pacific+Place",
      image: "/images/events/reception.jpg",
    },
  },
  loveStory: [
    {
      title: "Pertama Bertemu",
      date: "15 Januari 2021",
      description:
        "Kami pertama kali bertemu di sebuah kedai kopi di Menteng. Dewi sedang membaca novel favoritnya, dan Budi tidak sengaja menumpahkan latte-nya. Sebuah awal yang canggung namun tak terlupakan.",
      image: "/images/story/1.jpg",
    },
    {
      title: "Pacaran",
      date: "14 Februari 2021",
      description:
        "Setelah sebulan penuh percakapan panjang dan tawa yang tak henti, Budi memberanikan diri untuk menyatakan cintanya di Hari Valentine — di kedai kopi yang sama.",
      image: "/images/story/2.jpg",
    },
    {
      title: "Lamaran",
      date: "20 Desember 2026",
      description:
        "Di bawah langit malam yang dipenuhi bintang di Puncak, Budi berlutut dan mengajukan pertanyaan terpenting dalam hidupnya. Dewi menjawab ya dengan air mata bahagia.",
      image: "/images/story/3.jpg",
    },
    {
      title: "Pernikahan",
      date: "14 Maret 2027",
      description:
        "Hari ini, kami akan memulai babak baru dalam hidup kami. Terima kasih telah menjadi bagian dari kisah cinta kami.",
      image: "/images/story/4.jpg",
    },
  ],
  gallery: [
    { src: "/images/gallery/1.jpg", alt: "Wedding ceremony flowers" },
    { src: "/images/gallery/2.jpg", alt: "Elegant table setting" },
    { src: "/images/gallery/3.jpg", alt: "Bride bouquet with white roses" },
    { src: "/images/gallery/4.jpg", alt: "Wedding rings" },
    { src: "/images/gallery/5.jpg", alt: "Romantic first dance" },
    { src: "/images/gallery/6.jpg", alt: "Garden wedding decor" },
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
  heroImage: "/images/hero-bg.jpg",
  music: {
    src: "/music/wedding.mp3",
    title: "Canon in D — Pachelbel",
  },
} as const;
