import { BoardTile, GameCard, AdminSettings, RealmType, TileType } from '../types/game';

// 6 Canonical Sumpa Cards from GDD
export const CANONICAL_SUMPA_CARDS: GameCard[] = [
  {
    id: 'sumpa_tikbalang',
    deck: 'sumpa',
    title: 'Sumpa ng Tikbalang',
    subtitle: 'Maling Landas',
    category: 'curse',
    flavorText: 'Isang espiritu ng kabayong nilalang na lumiligaw sa mga naglalakbay.',
    hint: 'Kapag baligtad lamang ang suot kong damit ko matatagpuan ang daan.',
  },
  {
    id: 'sumpa_manananggal',
    deck: 'sumpa',
    title: 'Sumpa ng Manananggal',
    subtitle: 'Pagkahati',
    category: 'curse',
    flavorText: 'Nilalang ng gabi na naghihiwalay ang katawan upang maghasik ng lagim.',
    hint: 'Bago mag-umaga, kailangan kong hanapin ang iniwan ko.',
  },
  {
    id: 'sumpa_bakunawa',
    deck: 'sumpa',
    title: 'Sumpa ng Bakunawa',
    subtitle: 'Buwan',
    category: 'curse',
    flavorText: 'Higanteng serpente ng karagatan na naghahangad lumamon sa pitong buwan.',
    hint: 'Napapanaginipan kong nilalamon ng isang higanteng ahas ang langit.',
  },
  {
    id: 'sumpa_kapre',
    deck: 'sumpa',
    title: 'Sumpa ng Kapre',
    subtitle: 'Usok',
    category: 'curse',
    flavorText: 'Higanteng nananahan sa sinaunang balete at nagbubuga ng mahiwagang usok.',
    hint: 'Amoy tabako ang hininga ko kahit hindi ako naninigarilyo.',
  },
  {
    id: 'sumpa_nuno',
    deck: 'sumpa',
    title: 'Sumpa ng Nuno sa Punso',
    subtitle: 'Punso',
    category: 'curse',
    flavorText: 'Munting bantay ng lupa na nagbibigay parusa sa hindi nagbibigay galang.',
    hint: 'Sumasakit ang katawan ko kapag may nakalimot magsabi ng "tabi-tabi po."',
  },
  {
    id: 'sumpa_tiyanak',
    deck: 'sumpa',
    title: 'Sumpa ng Tiyanak',
    subtitle: 'Iyak',
    category: 'curse',
    flavorText: 'Mapanlinlang na nilalang na nagbabalatkayong sanggol sa puso ng masukal na gubat.',
    hint: 'May iyak ng sanggol sa gubat na ako lamang ang pinagmumulan.',
  },
];

// 18 Canonical Pahiwatig Gate Riddle Cards from GDD (3 per curse)
export const CANONICAL_PAHIWATIG_CARDS: GameCard[] = [
  // Tikbalang
  {
    id: 'pah_tikbalang_1',
    deck: 'pahiwatig',
    title: 'Pahiwatig ng Ligaw',
    matchingSumpaId: 'sumpa_tikbalang',
    category: 'clue',
    question: 'Sino ang laging napapabalik sa kanyang pinagsimulan?',
    flavorText: 'Tanong ng Diwaling bantay sa Pintuan.',
  },
  {
    id: 'pah_tikbalang_2',
    deck: 'pahiwatig',
    title: 'Pahiwatig ng Yabag',
    matchingSumpaId: 'sumpa_tikbalang',
    category: 'clue',
    question: 'Sino ang nakaririnig ng yabag ng kabayo ngunit walang nakikitang sakay?',
    flavorText: 'Ang bulong ng tikbalang sa makakapal na dahon.',
  },
  {
    id: 'pah_tikbalang_3',
    deck: 'pahiwatig',
    title: 'Pahiwatig ng Damit',
    matchingSumpaId: 'sumpa_tikbalang',
    category: 'clue',
    question: 'Sino ang kailangang magsuot ng damit nang pabaligtad upang makita ang daan?',
    flavorText: 'Ang tradisyonal na pananggalang sa ligaw ng gubat.',
  },
  // Manananggal
  {
    id: 'pah_manananggal_1',
    deck: 'pahiwatig',
    title: 'Pahiwatig ng Liwanag',
    matchingSumpaId: 'sumpa_manananggal',
    category: 'clue',
    question: 'Sino ang buo lamang sa liwanag ng araw?',
    flavorText: 'Ang lihim ng katawang nahahati sa kadiliman.',
  },
  {
    id: 'pah_manananggal_2',
    deck: 'pahiwatig',
    title: 'Pahiwatig ng Pagsikat',
    matchingSumpaId: 'sumpa_manananggal',
    category: 'clue',
    question: 'Sino ang kailangang bumalik sa iniwan niya bago sumikat ang araw?',
    flavorText: 'Ang takot sa abo at asin ng bukang-liwayway.',
  },
  {
    id: 'pah_manananggal_3',
    deck: 'pahiwatig',
    title: 'Pahiwatig ng Likod',
    matchingSumpaId: 'sumpa_manananggal',
    category: 'clue',
    question: 'Sino ang may itinatago sa kanyang likod?',
    flavorText: 'Ang mga pakpak ng paniki na nakatago sa balabal.',
  },
  // Bakunawa
  {
    id: 'pah_bakunawa_1',
    deck: 'pahiwatig',
    title: 'Pahiwatig ng Kabilugan',
    matchingSumpaId: 'sumpa_bakunawa',
    category: 'clue',
    question: 'Sino ang hindi makatulog sa ilalim ng kabilugan ng buwan?',
    flavorText: 'Ang tawag ng dagat at ng gutom na dragon.',
  },
  {
    id: 'pah_bakunawa_2',
    deck: 'pahiwatig',
    title: 'Pahiwatig ng Ahas',
    matchingSumpaId: 'sumpa_bakunawa',
    category: 'clue',
    question: 'Sino ang nananaginip ng ahas na lumalamon sa buwan?',
    flavorText: 'Ang anino ng Bakunawa na humahalik sa kalangitan.',
  },
  {
    id: 'pah_bakunawa_3',
    deck: 'pahiwatig',
    title: 'Pahiwatig ng Kaldero',
    matchingSumpaId: 'sumpa_bakunawa',
    category: 'clue',
    question: 'Sino ang napapayapa ng kalansing ng kaldero at kawali?',
    flavorText: 'Ang ingay ng bayan upang iligtas ang huling tanglaw.',
  },
  // Kapre
  {
    id: 'pah_kapre_1',
    deck: 'pahiwatig',
    title: 'Pahiwatig ng Hininga',
    matchingSumpaId: 'sumpa_kapre',
    category: 'clue',
    question: 'Sino ang amoy usok ang hininga?',
    flavorText: 'Ang tabako ng higante sa sanga ng punong balete.',
  },
  {
    id: 'pah_kapre_2',
    deck: 'pahiwatig',
    title: 'Pahiwatig ng Sanga',
    matchingSumpaId: 'sumpa_kapre',
    category: 'clue',
    question: 'Sino ang mas gustong tumira sa sanga ng puno?',
    flavorText: 'Ang pugad ng mapagmasid na bantay ng dilim.',
  },
  {
    id: 'pah_kapre_3',
    deck: 'pahiwatig',
    title: 'Pahiwatig ng Ligaw na Isip',
    matchingSumpaId: 'sumpa_kapre',
    category: 'clue',
    question: 'Sino ang dahilan ng pagkaligaw ng mga manlalakbay dahil sa usok?',
    flavorText: 'Ang makapal na abuhing hamog na bumabalot sa paningin.',
  },
  // Nuno sa Punso
  {
    id: 'pah_nuno_1',
    deck: 'pahiwatig',
    title: 'Pahiwatig ng Paggalang',
    matchingSumpaId: 'sumpa_nuno',
    category: 'clue',
    question: 'Sino ang sumasakit ang katawan kapag walang nagpaalam sa lupa?',
    flavorText: 'Ang kaparusahan ng pagyapak sa tirahan ng nuno.',
  },
  {
    id: 'pah_nuno_2',
    deck: 'pahiwatig',
    title: 'Pahiwatig ng Punso',
    matchingSumpaId: 'sumpa_nuno',
    category: 'clue',
    question: 'Sino ang nag-iiwan ng punso saan man humiga?',
    flavorText: 'Ang lupa na kumakapit at bumabangon sa kanyang balat.',
  },
  {
    id: 'pah_nuno_3',
    deck: 'pahiwatig',
    title: 'Pahiwatig ng Matanda',
    matchingSumpaId: 'sumpa_nuno',
    category: 'clue',
    question: 'Sino ang sinusundan ng matandang bata lamang ang nakakakita?',
    flavorText: 'Ang espiritu ng punso na may mahabang puting balbas.',
  },
  // Tiyanak
  {
    id: 'pah_tiyanak_1',
    deck: 'pahiwatig',
    title: 'Pahiwatig ng Gubat',
    matchingSumpaId: 'sumpa_tiyanak',
    category: 'clue',
    question: 'Sino ang pinagmumulan ng iyak sa gubat?',
    flavorText: 'Ang tinig na umaakit sa mga nag-iisa sa gabi.',
  },
  {
    id: 'pah_tiyanak_2',
    deck: 'pahiwatig',
    title: 'Pahiwatig ng Awa',
    matchingSumpaId: 'sumpa_tiyanak',
    category: 'clue',
    question: 'Sino ang nanlilinlang sa mga maawain?',
    flavorText: 'Ang pagsamo ng sanggol na nagtatapos sa matatalim na kuko.',
  },
  {
    id: 'pah_tiyanak_3',
    deck: 'pahiwatig',
    title: 'Pahiwatig ng Kabataan',
    matchingSumpaId: 'sumpa_tiyanak',
    category: 'clue',
    question: 'Sino ang hindi tumatanda at nakakulong sa anyo ng sanggol?',
    flavorText: 'Ang walang-hanggang sumpa ng ligaw na sanggol.',
  },
];

// 60 Canonical Pagsubok Cards across 6 categories from GDD
export const CANONICAL_PAGSUBOK_CARDS: GameCard[] = [
  // 1. Bugtong (10)
  {
    id: 'pag_bugtong_1',
    deck: 'pagsubok',
    category: 'bugtong',
    title: 'Bugtong: May Dahon',
    question: 'May dahon ay hindi halaman, may buhay ay walang tiyan. Ano ako?',
    answer: 'Libro / Aklat',
    options: ['Libro', 'Saging', 'Gunting', 'Kandila'],
  },
  {
    id: 'pag_bugtong_2',
    deck: 'pagsubok',
    category: 'bugtong',
    title: 'Bugtong: Butil ng Palay',
    question: 'Isang butil ng palay, sakop ang buong bahay. Ano ako?',
    answer: 'Ilaw / Kandila / Sulo',
    options: ['Ilaw', 'Unan', 'Banig', 'Bintana'],
  },
  {
    id: 'pag_bugtong_3',
    deck: 'pagsubok',
    category: 'bugtong',
    title: 'Bugtong: Baging at Matsing',
    question: 'Nang hilahin ko ang baging, nagkakagulo ang matsing. Ano ako?',
    answer: 'Kampana',
    options: ['Kampana', 'Lambat', 'Kalesa', 'Gitara'],
  },
  {
    id: 'pag_bugtong_4',
    deck: 'pagsubok',
    category: 'bugtong',
    title: 'Bugtong: Dala Mo',
    question: 'Dala mo, dala ka, dala ka pa ng iyong dala. Ano ako?',
    answer: 'Sapatos / Tsinelas',
    options: ['Sapatos', 'Payong', 'Sombrero', 'Bagpack'],
  },
  {
    id: 'pag_bugtong_5',
    deck: 'pagsubok',
    category: 'bugtong',
    title: 'Bugtong: Haba ng Buhay',
    question: 'Kung kailan mo pinatay, saka lalong humaba ang buhay. Ano ako?',
    answer: 'Kandila',
    options: ['Kandila', 'Posporo', 'Baga', 'Kalan'],
  },
  {
    id: 'pag_bugtong_6',
    deck: 'pagsubok',
    category: 'bugtong',
    title: 'Bugtong: Langit sa Itaas',
    question: 'Langit sa itaas, langit sa ibaba, may tubig sa gitna. Ano ako?',
    answer: 'Niyog',
    options: ['Niyog', 'Pakwan', 'Langka', 'Pinya'],
  },
  {
    id: 'pag_bugtong_7',
    deck: 'pagsubok',
    category: 'bugtong',
    title: 'Bugtong: Si Nene',
    question: 'Maliit pa si Nene, marunong nang mamalengke. Ano ako?',
    answer: 'Langgam',
    options: ['Langgam', 'Bubuyog', 'Gagamba', 'Ipis'],
  },
  {
    id: 'pag_bugtong_8',
    deck: 'pagsubok',
    category: 'bugtong',
    title: 'Bugtong: Si Pedro',
    question: 'Nagtago si Pedro, nakalabas ang ulo. Ano ako?',
    answer: 'Pako',
    options: ['Pako', 'Kutsilyo', 'Kandado', 'Karayom'],
  },
  {
    id: 'pag_bugtong_9',
    deck: 'pagsubok',
    category: 'bugtong',
    title: 'Bugtong: Mataas kung Nakaupo',
    question: 'Mataas kung nakaupo, mababa kung nakatayo. Ano ako?',
    answer: 'Aso',
    options: ['Aso', 'Pusa', 'Manok', 'Kabayo'],
  },
  {
    id: 'pag_bugtong_10',
    deck: 'pagsubok',
    category: 'bugtong',
    title: 'Bugtong: Kabiyak-biyak',
    question: 'Heto na si Kaka, kabiyak-biyak ang baka. Ano ako?',
    answer: 'Gunting',
    options: ['Gunting', 'Lagari', 'Itak', 'Sipit'],
  },

  // 2. Pambansang Sagisag (10)
  {
    id: 'pag_sagisag_1',
    deck: 'pagsubok',
    category: 'sagisag',
    title: 'Sagisag: Pambansang Puno',
    question: 'Ano ang Pambansang Puno ng Pilipinas?',
    answer: 'Narra',
    options: ['Narra', 'Molave', 'Mahogany', 'Acacia'],
  },
  {
    id: 'pag_sagisag_2',
    deck: 'pagsubok',
    category: 'sagisag',
    title: 'Sagisag: Pambansang Ibon',
    question: 'Ano ang Pambansang Ibon ng Pilipinas?',
    answer: 'Agila ng Pilipinas (Philippine Eagle)',
    options: ['Agila ng Pilipinas', 'Maya', 'Pipit', 'Kalapati'],
  },
  {
    id: 'pag_sagisag_3',
    deck: 'pagsubok',
    category: 'sagisag',
    title: 'Sagisag: Pambansang Bulaklak',
    question: 'Ano ang Pambansang Bulaklak ng Pilipinas?',
    answer: 'Sampaguita',
    options: ['Sampaguita', 'Gumamela', 'Rosas', 'Waling-Waling'],
  },
  {
    id: 'pag_sagisag_4',
    deck: 'pagsubok',
    category: 'sagisag',
    title: 'Sagisag: Pambansang Hayop',
    question: 'Ano ang Pambansang Hayop sa Lupa ng Pilipinas?',
    answer: 'Kalabaw',
    options: ['Kalabaw', 'Tamaraw', 'Tarsier', 'Baka'],
  },
  {
    id: 'pag_sagisag_5',
    deck: 'pagsubok',
    category: 'sagisag',
    title: 'Sagisag: Pambansang Isda',
    question: 'Ano ang Pambansang Isda ng Pilipinas?',
    answer: 'Bangus',
    options: ['Bangus', 'Tilapia', 'Tuna', 'Galunggong'],
  },
  {
    id: 'pag_sagisag_6',
    deck: 'pagsubok',
    category: 'sagisag',
    title: 'Sagisag: Pambansang Prutas',
    question: 'Ano ang Pambansang Prutas ng Pilipinas?',
    answer: 'Mangga',
    options: ['Mangga', 'Saging', 'Durian', 'Lanzones'],
  },
  {
    id: 'pag_sagisag_7',
    deck: 'pagsubok',
    category: 'sagisag',
    title: 'Sagisag: Pambansang Laro',
    question: 'Ano ang Pambansang Laro o Martial Art ng Pilipinas?',
    answer: 'Arnis',
    options: ['Arnis', 'Sipa', 'Patintero', 'Dumog'],
  },
  {
    id: 'pag_sagisag_8',
    deck: 'pagsubok',
    category: 'sagisag',
    title: 'Sagisag: Pambansang Bahay',
    question: 'Ano ang Pambansang Bahay ng Pilipinas?',
    answer: 'Bahay Kubo',
    options: ['Bahay Kubo', 'Bahay na Bato', 'Torogan', 'Kubo'],
  },
  {
    id: 'pag_sagisag_9',
    deck: 'pagsubok',
    category: 'sagisag',
    title: 'Sagisag: Pambansang Bayani',
    question: 'Sino ang Pambansang Bayani ng Pilipinas?',
    answer: 'Dr. Jose Rizal',
    options: ['Dr. Jose Rizal', 'Andres Bonifacio', 'Apolinario Mabini', 'Emilio Aguinaldo'],
  },
  {
    id: 'pag_sagisag_10',
    deck: 'pagsubok',
    category: 'sagisag',
    title: 'Sagisag: Pambansang Sayaw',
    question: 'Ano ang Pambansang Sayaw ng Pilipinas na gumagamit ng kawayan?',
    answer: 'Tinikling',
    options: ['Tinikling', 'Singkil', 'Cariñosa', 'Maglalatik'],
  },

  // 3. Kasabihan (Fill in the blank) (10)
  {
    id: 'pag_kasabihan_1',
    deck: 'pagsubok',
    category: 'kasabihan',
    title: 'Kasabihan: Lumingon',
    question: 'Ang hindi marunong lumingon sa pinanggalingan ay hindi makakarating sa ________.',
    answer: 'Paroroonan',
    options: ['Paroroonan', 'Tagumpay', 'Langit', 'Bukas'],
  },
  {
    id: 'pag_kasabihan_2',
    deck: 'pagsubok',
    category: 'kasabihan',
    title: 'Kasabihan: Awa at Gawa',
    question: 'Nasa Diyos ang awa, nasa tao ang ________.',
    answer: 'Gawa',
    options: ['Gawa', 'Dasal', 'Kilos', 'Pag-asa'],
  },
  {
    id: 'pag_kasabihan_3',
    deck: 'pagsubok',
    category: 'kasabihan',
    title: 'Kasabihan: Tiyaga',
    question: 'Pag may tiyaga, may ________.',
    answer: 'Nilaga',
    options: ['Nilaga', 'Sinigang', 'Biyaya', 'Yaman'],
  },
  {
    id: 'pag_kasabihan_4',
    deck: 'pagsubok',
    category: 'kasabihan',
    title: 'Kasabihan: Damo at Kabayo',
    question: 'Aanhin pa ang damo kung patay na ang ________.',
    answer: 'Kabayo',
    options: ['Kabayo', 'Kalabaw', 'Tupa', 'Baka'],
  },
  {
    id: 'pag_kasabihan_5',
    deck: 'pagsubok',
    category: 'kasabihan',
    title: 'Kasabihan: Kalingkingan',
    question: 'Ang sakit ng kalingkingan, damdam ng buong ________.',
    answer: 'Katawan',
    options: ['Katawan', 'Bayan', 'Tahanan', 'Puso'],
  },
  {
    id: 'pag_kasabihan_6',
    deck: 'pagsubok',
    category: 'kasabihan',
    title: 'Kasabihan: Itinanim',
    question: 'Kung ano ang itinanim, siya ring ________.',
    answer: 'Aanihin',
    options: ['Aanihin', 'Kakainin', 'Ibibigay', 'Itatapon'],
  },
  {
    id: 'pag_kasabihan_7',
    deck: 'pagsubok',
    category: 'kasabihan',
    title: 'Kasabihan: Maikling Kumot',
    question: 'Habang maikli ang kumot, matutong ________.',
    answer: 'Mamaluktot',
    options: ['Mamaluktot', 'Matulog', 'Magtipid', 'Umiyak'],
  },
  {
    id: 'pag_kasabihan_8',
    deck: 'pagsubok',
    category: 'kasabihan',
    title: 'Kasabihan: Taong Nagigipit',
    question: 'Ang taong nagigipit, sa ________ kumakapit.',
    answer: 'Patalim',
    options: ['Patalim', 'Patpat', 'Kumpare', 'Pader'],
  },
  {
    id: 'pag_kasabihan_9',
    deck: 'pagsubok',
    category: 'kasabihan',
    title: 'Kasabihan: Tunay na Kaibigan',
    question: 'Ang tunay na kaibigan, nakikilala sa oras ng ________.',
    answer: 'Pangangailangan / Kagipitan',
    options: ['Pangangailangan', 'Kasayahan', 'Kainan', 'Kamatayan'],
  },
  {
    id: 'pag_kasabihan_10',
    deck: 'pagsubok',
    category: 'kasabihan',
    title: 'Kasabihan: Puno at Bunga',
    question: 'Kung ano ang puno, siya ring ________.',
    answer: 'Bunga',
    options: ['Bunga', 'Dahon', 'Sanga', 'Ugat'],
  },

  // 4. 3 Tagalog Names in 5 Seconds (10)
  {
    id: 'pag_speed_1',
    deck: 'pagsubok',
    category: 'speed_trivia',
    title: 'Mabilisang Pagsubok: 3 Prutas',
    question: 'Pumili ng tamang pangkat ng 3 Prutas sa Tagalog:',
    answer: 'Mangga, Saging, Niyog',
    options: ['Mangga, Saging, Niyog', 'Mansanas, Karot, Patatas', 'Gatas, Karne, Itlog', 'Bigas, Mais, Asukal'],
  },
  {
    id: 'pag_speed_2',
    deck: 'pagsubok',
    category: 'speed_trivia',
    title: 'Mabilisang Pagsubok: 3 Gulay',
    question: 'Pumili ng tamang pangkat ng 3 Gulay sa Tagalog:',
    answer: 'Talong, Kalabasa, Sitaw',
    options: ['Talong, Kalabasa, Sitaw', 'Pinya, Pakwan, Papaya', 'Manok, Baboy, Isda', 'Gulay, Prutas, Karneng Baka'],
  },
  {
    id: 'pag_speed_3',
    deck: 'pagsubok',
    category: 'speed_trivia',
    title: 'Mabilisang Pagsubok: 3 Bahagi ng Katawan',
    question: 'Pumili ng 3 Bahagi ng Katawan sa Tagalog:',
    answer: 'Ulo, Kamay, Paa',
    options: ['Ulo, Kamay, Paa', 'T-shirt, Pantalon, Sapatos', 'Puno, Damo, Bulaklak', 'Bato, Lupa, Tubig'],
  },
  {
    id: 'pag_speed_4',
    deck: 'pagsubok',
    category: 'speed_trivia',
    title: 'Mabilisang Pagsubok: 3 Kulay',
    question: 'Pumili ng 3 Kulay sa Tagalog:',
    answer: 'Pula, Asul, Dilaw',
    options: ['Pula, Asul, Dilaw', 'Malamig, Mainit, Maalinsangan', 'Masaya, Malungkot, Galit', 'Maliit, Malaki, Katamtaman'],
  },
  {
    id: 'pag_speed_5',
    deck: 'pagsubok',
    category: 'speed_trivia',
    title: 'Mabilisang Pagsubok: 3 Hayop sa Gubat',
    question: 'Pumili ng 3 Hayop sa Gubat ng Pilipinas:',
    answer: 'Baboy-ramo, Usa, Matsing',
    options: ['Baboy-ramo, Usa, Matsing', 'Pating, Balisong, Bangus', 'Aso, Pusa, Daga', 'Elepante, Leon, Giraffe'],
  },
  {
    id: 'pag_speed_6',
    deck: 'pagsubok',
    category: 'speed_trivia',
    title: 'Mabilisang Pagsubok: 3 Kagamitan sa Kusina',
    question: 'Pumili ng 3 Kagamitan sa Kusina sa Tagalog:',
    answer: 'Kutsara, Tinidor, Kaldero',
    options: ['Kutsara, Tinidor, Kaldero', 'Kama, Unan, Kumot', 'Lapis, Papel, Kwaderno', 'Walang-tigil, Bintana, Pinto'],
  },
  {
    id: 'pag_speed_7',
    deck: 'pagsubok',
    category: 'speed_trivia',
    title: 'Mabilisang Pagsubok: 3 Lalawigan',
    question: 'Pumili ng 3 Lalawigan sa Luzon / Pilipinas:',
    answer: 'Batangas, Laguna, Quezon',
    options: ['Batangas, Laguna, Quezon', 'Maynila, Tokyo, Seoul', 'Pasig, Makati, QC', 'Lupa, Apoy, Tubig'],
  },
  {
    id: 'pag_speed_8',
    deck: 'pagsubok',
    category: 'speed_trivia',
    title: 'Mabilisang Pagsubok: 3 Nilalang sa Mitolohiya',
    question: 'Pumili ng 3 Nilalang sa Mitolohiyang Pilipino:',
    answer: 'Tikbalang, Kapre, Manananggal',
    options: ['Tikbalang, Kapre, Manananggal', 'Bampira, Werewolf, Zombie', 'Elf, Dwarf, Goblin', 'Sirena, Darna, Panday'],
  },
  {
    id: 'pag_speed_9',
    deck: 'pagsubok',
    category: 'speed_trivia',
    title: 'Mabilisang Pagsubok: 3 Araw sa Isang Linggo',
    question: 'Pumili ng 3 Araw sa Tagalog:',
    answer: 'Lunes, Martes, Miyerkules',
    options: ['Lunes, Martes, Miyerkules', 'Enero, Pebrero, Marso', 'Umaga, Hapon, Gabi', 'Kahapon, Ngayon, Bukas'],
  },
  {
    id: 'pag_speed_10',
    deck: 'pagsubok',
    category: 'speed_trivia',
    title: 'Mabilisang Pagsubok: 3 Damdamin',
    question: 'Pumili ng 3 Damdamin o Emosyon sa Tagalog:',
    answer: 'Saya, Lungkot, Galit',
    options: ['Saya, Lungkot, Galit', 'Gutom, Uhaw, Busog', 'Tayo, Upo, Higa', 'Puti, Itim, Abo'],
  },

  // 5. Tongue Twister (10)
  {
    id: 'pag_tongue_1',
    deck: 'pagsubok',
    category: 'tongue_twister',
    title: 'Pabilisan ng Dila: Minimini',
    question: 'Piliin ang wastong pagkakasunod: "Minimini maynini mo, ako\'y may alagang ______."',
    answer: 'Aso',
    options: ['Aso', 'Pusa', 'Kabayo', 'Manok'],
  },
  {
    id: 'pag_tongue_2',
    deck: 'pagsubok',
    category: 'tongue_twister',
    title: 'Pabilisan ng Dila: Pitong Tupa',
    question: 'Kumpletuhin ang kilalang tongue twister: "Pitong puting ________."',
    answer: 'Tupa',
    options: ['Tupa', 'Kambing', 'Bibe', 'Kalabaw'],
  },
  {
    id: 'pag_tongue_3',
    deck: 'pagsubok',
    category: 'tongue_twister',
    title: 'Pabilisan ng Dila: Monico at Monica',
    question: '"Minekaniko ni Monico ang makina ng manika ni ________."',
    answer: 'Monica',
    options: ['Monica', 'Maria', 'Monina', 'Monique'],
  },
  {
    id: 'pag_tongue_4',
    deck: 'pagsubok',
    category: 'tongue_twister',
    title: 'Pabilisan ng Dila: Kakabakaba',
    question: '"Kakabakaba ka ba?" Ano ang ibig sabihin ng salitang "kaba"?',
    answer: 'Pangamba o kabog ng dibdib',
    options: ['Pangamba o kabog ng dibdib', 'Saya', 'Katakawan', 'Katalinuhan'],
  },
  {
    id: 'pag_tongue_5',
    deck: 'pagsubok',
    category: 'tongue_twister',
    title: 'Pabilisan ng Dila: Kalabaw sa Kakahuyan',
    question: '"Ang kalabaw ay tumatawid sa ________."',
    answer: 'Kakahuyan',
    options: ['Kakahuyan', 'Kalsada', 'Kagubatan', 'Kapatagan'],
  },
  {
    id: 'pag_tongue_6',
    deck: 'pagsubok',
    category: 'tongue_twister',
    title: 'Pabilisan ng Dila: Buwaya at Baka',
    question: 'Apat na hayop sa twister: "Buwaya, baka, ________, kabayo."',
    answer: 'Kalabaw',
    options: ['Kalabaw', 'Kambing', 'Kuneho', 'Baboy'],
  },
  {
    id: 'pag_tongue_7',
    deck: 'pagsubok',
    category: 'tongue_twister',
    title: 'Pabilisan ng Dila: Kababayan',
    question: '"Kababayan, bakit ka nagkakaganyan?" Aling titik ang paulit-ulit na tunog?',
    answer: 'Titik K at B',
    options: ['Titik K at B', 'Titik S at T', 'Titik L at M', 'Titik P at G'],
  },
  {
    id: 'pag_tongue_8',
    deck: 'pagsubok',
    category: 'tongue_twister',
    title: 'Pabilisan ng Dila: Susan at Sapatos',
    question: '"Sinusi ni Susan ang susi sa ________."',
    answer: 'Sapatos',
    options: ['Sapatos', 'Silid', 'Silyon', 'Simbahan'],
  },
  {
    id: 'pag_tongue_9',
    deck: 'pagsubok',
    category: 'tongue_twister',
    title: 'Pabilisan ng Dila: Pating sa Dalampasigan',
    question: '"Pang-panga ng ________ sa dalampasigan."',
    answer: 'Pating',
    options: ['Pating', 'Pagi', 'Pusit', 'Paa'],
  },
  {
    id: 'pag_tongue_10',
    deck: 'pagsubok',
    category: 'tongue_twister',
    title: 'Pabilisan ng Dila: Reloj ni Leroy',
    question: '"Ang reloj ni Leroy ay ________."',
    answer: 'Rolex',
    options: ['Rolex', 'Relos', 'Rosas', 'Renta'],
  },

  // 6. Idioms / Sawikain (10)
  {
    id: 'pag_idiom_1',
    deck: 'pagsubok',
    category: 'idiom',
    title: 'Sawikain: Balat-sibuyas',
    question: 'Ano ang kahulugan ng sawikain na "Balat-sibuyas"?',
    answer: 'Sensitibo / Mabilis masaktan ang damdamin',
    options: ['Sensitibo / Mabilis masaktan ang damdamin', 'Maputi ang balat', 'Mabaho ang amoy', 'Mahilig magluto'],
  },
  {
    id: 'pag_idiom_2',
    deck: 'pagsubok',
    category: 'idiom',
    title: 'Sawikain: Nagbibilang ng Poste',
    question: 'Ano ang kahulugan ng sawikain na "Nagbibilang ng poste"?',
    answer: 'Walang trabaho',
    options: ['Walang trabaho', 'Inhinyero', 'Mabilis maglakad', 'Elektrisyan'],
  },
  {
    id: 'pag_idiom_3',
    deck: 'pagsubok',
    category: 'idiom',
    title: 'Sawikain: Bukas ang Palad',
    question: 'Ano ang kahulugan ng sawikain na "Bukas ang palad"?',
    answer: 'Matulungin / Mapagbigay',
    options: ['Matulungin / Mapagbigay', 'Nagnanakaw', 'Tamad kumilos', 'Nanghihingi'],
  },
  {
    id: 'pag_idiom_4',
    deck: 'pagsubok',
    category: 'idiom',
    title: 'Sawikain: Ilaw ng Tahanan',
    question: 'Sino ang tinutukoy ng sawikaing "Ilaw ng tahanan"?',
    answer: 'Ina / Nanay',
    options: ['Ina / Nanay', 'Ama / Tatay', 'Ate / Kapatid', 'Bumbilya'],
  },
  {
    id: 'pag_idiom_5',
    deck: 'pagsubok',
    category: 'idiom',
    title: 'Sawikain: Haligi ng Tahanan',
    question: 'Sino ang tinutukoy ng sawikaing "Haligi ng tahanan"?',
    answer: 'Ama / Tatay',
    options: ['Ama / Tatay', 'Ina / Nanay', 'Lolo', 'Karpintero'],
  },
  {
    id: 'pag_idiom_6',
    deck: 'pagsubok',
    category: 'idiom',
    title: 'Sawikain: Kurus sa Dibdib',
    question: 'Ano ang kahulugan ng sawikain na "Kurus sa dibdib"?',
    answer: 'Saloobin o alaalang nagdudulot ng sakit sa damdamin',
    options: ['Saloobin o alaalang nagdudulot ng sakit sa damdamin', 'Madasalin', 'May sakit sa puso', 'Paring Katoliko'],
  },
  {
    id: 'pag_idiom_7',
    deck: 'pagsubok',
    category: 'idiom',
    title: 'Sawikain: Mabigat ang Kamay',
    question: 'Ano ang kahulugan ng sawikain na "Mabigat ang kamay"?',
    answer: 'Tamad magtrabaho',
    options: ['Tamad magtrabaho', 'Matipuno', 'Mapanakit', 'Masipag'],
  },
  {
    id: 'pag_idiom_8',
    deck: 'pagsubok',
    category: 'idiom',
    title: 'Sawikain: Naningkit ang Mata',
    question: 'Ano ang kahulugan ng sawikain na "Naningkit ang mata"?',
    answer: 'Naghinala o nagalit',
    options: ['Naghinala o nagalit', 'Inantok', 'Lumabo ang paningin', 'Natakot'],
  },
  {
    id: 'pag_idiom_9',
    deck: 'pagsubok',
    category: 'idiom',
    title: 'Sawikain: Basag ang Pula',
    question: 'Ano ang kahulugan ng sawikain na "Basag ang pula"?',
    answer: 'Loko-loko / May kaunting kalokohan',
    options: ['Loko-loko / May kaunting kalokohan', 'Nabigla', 'Nalugi', 'Sugatan'],
  },
  {
    id: 'pag_idiom_10',
    deck: 'pagsubok',
    category: 'idiom',
    title: 'Sawikain: Taingang-kawali',
    question: 'Ano ang kahulugan ng sawikain na "Taingang-kawali"?',
    answer: 'Nagbibingi-bingihan',
    options: ['Nagbibingi-bingihan', 'Malaki ang tainga', 'Magaling magluto', 'Matigas ang ulo'],
  },
];

// 30 Uno-Style Biyaya Utility Action Cards from GDD
export const CANONICAL_BIYAYA_CARDS: GameCard[] = [
  {
    id: 'biyaya_abante_1',
    deck: 'biyaya',
    title: 'Abante (Pasulong)',
    subtitle: 'Hangin ni Amihan',
    flavorText: 'Sumakay sa hanging amihan at lumipad nang 2 hakbang pasulong.',
    effects: [
      {
        type: 'MOVE_FORWARD',
        value: 2,
        target: 'self',
        description: 'Sumulong ng 2 espasyo pasulong agad.',
      },
    ],
  },
  {
    id: 'biyaya_abante_2',
    deck: 'biyaya',
    title: 'Abante (Pasulong)',
    subtitle: 'Bilis ng Habagat',
    flavorText: 'Sumulong ng 3 espasyo pasulong sa tulong ng malakas na simoy.',
    effects: [
      {
        type: 'MOVE_FORWARD',
        value: 3,
        target: 'self',
        description: 'Sumulong ng 3 espasyo pasulong agad.',
      },
    ],
  },
  {
    id: 'biyaya_abante_3',
    deck: 'biyaya',
    title: 'Abante (Pasulong)',
    subtitle: 'Bilis ng Kidlat',
    flavorText: 'Kidlat ng Himaraya ang magtutulak sa iyo.',
    effects: [
      {
        type: 'MOVE_FORWARD',
        value: 2,
        target: 'self',
        description: 'Sumulong ng 2 espasyo pasulong agad.',
      },
    ],
  },
  {
    id: 'biyaya_abante_4',
    deck: 'biyaya',
    title: 'Abante (Pasulong)',
    subtitle: 'Agos ng Alonawon',
    flavorText: 'Mabilis na daloy ng tubig ang magdadala sa iyo.',
    effects: [
      {
        type: 'MOVE_FORWARD',
        value: 2,
        target: 'self',
        description: 'Sumulong ng 2 espasyo pasulong.',
      },
    ],
  },
  {
    id: 'biyaya_baliktad_1',
    deck: 'biyaya',
    title: 'Baliktad (Urong)',
    subtitle: 'Maling Hakbang',
    flavorText: 'Ipatid ang kalabang nakalampas sa iyo at pabalikin ng 2 hakbang.',
    effects: [
      {
        type: 'MOVE_BACKWARD',
        value: 2,
        target: 'target_player',
        description: 'Paurungin ang kalaban ng 2 espasyo.',
      },
    ],
  },
  {
    id: 'biyaya_baliktad_2',
    deck: 'biyaya',
    title: 'Baliktad (Urong)',
    subtitle: 'Trapa sa Putik',
    flavorText: 'Ibaon ang paa ng katunggali sa putik ng Talvaris.',
    effects: [
      {
        type: 'MOVE_BACKWARD',
        value: 2,
        target: 'target_player',
        description: 'Paurungin ang kalaban ng 2 espasyo.',
      },
    ],
  },
  {
    id: 'biyaya_baliktad_3',
    deck: 'biyaya',
    title: 'Baliktad (Urong)',
    subtitle: 'Ihip Pabalik',
    flavorText: 'Bugso ng hangin na nagtutulak pabalik ng 3 hakbang.',
    effects: [
      {
        type: 'MOVE_BACKWARD',
        value: 3,
        target: 'target_player',
        description: 'Paurungin ang kalaban ng 3 espasyo.',
      },
    ],
  },
  {
    id: 'biyaya_harang_1',
    deck: 'biyaya',
    title: 'Harang / Laktaw',
    subtitle: 'Makapal na Hamog',
    flavorText: 'Palibutan ng hamog ang isang kalaban upang mawala ang kanyang sunod na tira.',
    effects: [
      {
        type: 'SKIP_TURN',
        target: 'target_player',
        description: 'Ipa-skip ang susunod na tira ng piniling kalaban.',
      },
    ],
  },
  {
    id: 'biyaya_harang_2',
    deck: 'biyaya',
    title: 'Harang / Laktaw',
    subtitle: 'Gayuma ng Engkanto',
    flavorText: 'Patulugin ang katabi dahil sa mahiwagang gayuma.',
    effects: [
      {
        type: 'SKIP_TURN',
        target: 'target_player',
        description: 'Ipa-skip ang susunod na tira ng piniling kalaban.',
      },
    ],
  },
  {
    id: 'biyaya_harang_3',
    deck: 'biyaya',
    title: 'Harang / Laktaw',
    subtitle: 'Gulo sa Isip',
    flavorText: 'Iligaw ang kalaban sa mga anino ng gubat.',
    effects: [
      {
        type: 'SKIP_TURN',
        target: 'target_player',
        description: 'Ipa-skip ang susunod na tira ng piniling kalaban.',
      },
    ],
  },
  {
    id: 'biyaya_kalasag_1',
    deck: 'biyaya',
    title: 'Kalasag (Shield)',
    subtitle: 'Anting-Anting ng Babaylan',
    flavorText: 'Proteksyon mula sa anumang pinsala, sumpa, o masamang kapalaran.',
    effects: [
      {
        type: 'ANTING_ANTING_SHIELD',
        target: 'self',
        description: 'Pawalang-bisa ang susunod na atake o parusa laban sa iyo.',
      },
    ],
  },
  {
    id: 'biyaya_kalasag_2',
    deck: 'biyaya',
    title: 'Kalasag (Shield)',
    subtitle: 'Bato ng Nuno',
    flavorText: 'Mahiwagang bato na sumasangga sa maruming lason.',
    effects: [
      {
        type: 'ANTING_ANTING_SHIELD',
        target: 'self',
        description: 'Pawalang-bisa ang susunod na atake o parusa laban sa iyo.',
      },
    ],
  },
  {
    id: 'biyaya_kalasag_3',
    deck: 'biyaya',
    title: 'Kalasag (Shield)',
    subtitle: 'Liwanag ng Diwa',
    flavorText: 'Dalisay na tanglaw na humahawi sa bawat Karimlan.',
    effects: [
      {
        type: 'ANTING_ANTING_SHIELD',
        target: 'self',
        description: 'Pawalang-bisa ang susunod na atake o parusa laban sa iyo.',
      },
    ],
  },
  {
    id: 'biyaya_kalasag_4',
    deck: 'biyaya',
    title: 'Kalasag (Shield)',
    subtitle: 'Bakas ng Baybayin',
    flavorText: 'Banal na ukit ng proteksyon mula sa sinaunang ninuno.',
    effects: [
      {
        type: 'ANTING_ANTING_SHIELD',
        target: 'self',
        description: 'Pawalang-bisa ang susunod na atake o parusa laban sa iyo.',
      },
    ],
  },
  {
    id: 'biyaya_dagdag_1',
    deck: 'biyaya',
    title: 'Dagdag-Bilis',
    subtitle: 'Agimat ng Bilis',
    flavorText: 'Magpagulong ng dice nang dalawang beses at piliin ang mas mataas.',
    effects: [
      {
        type: 'EXTRA_TURN',
        target: 'self',
        description: 'Magkaroon ng karagdagang tira agad matapos ang turn na ito.',
      },
    ],
  },
  {
    id: 'biyaya_dagdag_2',
    deck: 'biyaya',
    title: 'Dagdag-Bilis',
    subtitle: 'Paa ng Usa',
    flavorText: 'Mabilis na paglundag sa susunod na espasyo.',
    effects: [
      {
        type: 'EXTRA_TURN',
        target: 'self',
        description: 'Magkaroon ng karagdagang tira agad.',
      },
    ],
  },
  {
    id: 'biyaya_swap_1',
    deck: 'biyaya',
    title: 'Palit-Pwesto (Swap)',
    subtitle: 'Salamin ng Engkanto',
    flavorText: 'Makipagpalit ng pwesto sa sinumang manlalaro sa loob ng parehong realm!',
    effects: [
      {
        type: 'SWAP_PLAYERS_SAME_REALM',
        target: 'target_player',
        description: 'Magpalit ng pwesto sa manlalaro sa parehong lupain.',
      },
    ],
  },
  {
    id: 'biyaya_swap_2',
    deck: 'biyaya',
    title: 'Palit-Pwesto (Swap)',
    subtitle: 'Taksil na Anino',
    flavorText: 'Palitan ang iyong posisyon sa katunggaling nasa unahan mo sa parehong lupain.',
    effects: [
      {
        type: 'SWAP_PLAYERS_SAME_REALM',
        target: 'target_player',
        description: 'Magpalit ng pwesto sa manlalaro sa parehong lupain.',
      },
    ],
  },
  {
    id: 'biyaya_bunot_1',
    deck: 'biyaya',
    title: 'Agaw-Biyaya',
    subtitle: 'Kamay ng Duwende',
    flavorText: 'Kumuha ng 1 random Biyaya card mula sa kamay ng isang kalaban.',
    effects: [
      {
        type: 'DRAW_BIYAYA',
        value: 1,
        target: 'self',
        description: 'Kumuha ng 1 karagdagang Biyaya card sa deck.',
      },
    ],
  },
  {
    id: 'biyaya_bunot_2',
    deck: 'biyaya',
    title: 'Biyaya ng Lupa',
    subtitle: 'Ani ni Ikapatar',
    flavorText: 'Bumunot ng 2 bagong Biyaya cards mula sa sagradong baul.',
    effects: [
      {
        type: 'DRAW_BIYAYA',
        value: 2,
        target: 'self',
        description: 'Bumunot ng 2 bagong Biyaya cards.',
      },
    ],
  },
  {
    id: 'biyaya_bunot_3',
    deck: 'biyaya',
    title: 'Alay ng Apoy',
    subtitle: 'Siklab ni Sinukalab',
    flavorText: 'Ang init ng apoy ay nagbibigay lakas ng 1 Biyaya card at 1 hakbang pasulong.',
    effects: [
      {
        type: 'MOVE_FORWARD',
        value: 1,
        target: 'self',
        description: 'Sumulong ng 1 espasyo.',
      },
      {
        type: 'DRAW_BIYAYA',
        value: 1,
        target: 'self',
        description: 'Bumunot ng 1 Biyaya card.',
      },
    ],
  },
  {
    id: 'biyaya_peek_1',
    deck: 'biyaya',
    title: 'Pagsilip sa Pahiwatig',
    subtitle: 'Mata ng Lawin',
    flavorText: 'Palihim na silipin ang susunod na Pahiwatig card sa deck ng Diwaling.',
    effects: [
      {
        type: 'PEEK_PAHIWATIG',
        target: 'self',
        description: 'Silipin ang susunod na pahiwatig card sa deck.',
      },
    ],
  },
  {
    id: 'biyaya_auto_1',
    deck: 'biyaya',
    title: 'Dunong ng Babaylan',
    subtitle: 'Lihim ng Ninuno',
    flavorText: 'Ang iyong susunod na Pagsubok ay awtomatikong tama nang walang pagsusulit.',
    effects: [
      {
        type: 'AUTO_CORRECT_PAGSUBOK',
        target: 'self',
        description: 'Awtomatikong maging tama ang susunod na Pagsubok.',
      },
    ],
  },
  {
    id: 'biyaya_stop_1',
    deck: 'biyaya',
    title: 'Tigil (Stop)',
    subtitle: 'Gapos ng Baging',
    flavorText: 'Pigilan ang kalaban na gumamit ng Biyaya card hanggang sa kanyang susunod na tira.',
    effects: [
      {
        type: 'SKIP_TURN',
        target: 'target_player',
        description: 'Hindi maaaring maglaro ng Biyaya card ang kalaban.',
      },
    ],
  },
  {
    id: 'biyaya_reverse_action_1',
    deck: 'biyaya',
    title: 'Patalbog (Reflect)',
    subtitle: 'Kalasag na Salamin',
    flavorText: 'Ibalik ang ginamit na negatibong card pabalik sa nagtangkang gumamit nito!',
    effects: [
      {
        type: 'ANTING_ANTING_SHIELD',
        target: 'self',
        description: 'Ipanangga at ibalik ang epekto sa kalaban.',
      },
    ],
  },
  {
    id: 'biyaya_speed_run_1',
    deck: 'biyaya',
    title: 'Pasulong ng Barkada',
    subtitle: 'Sama-samang Bayanihan',
    flavorText: 'Sumulong ng 2 hakbang; ang katabing kakampi ay susulong din ng 1 hakbang.',
    effects: [
      {
        type: 'MOVE_FORWARD',
        value: 2,
        target: 'self',
        description: 'Sumulong ng 2 hakbang pasulong.',
      },
    ],
  },
  {
    id: 'biyaya_discard_foe_1',
    deck: 'biyaya',
    title: 'Puksa ng Biyaya',
    subtitle: 'Sunog ng Alabarya',
    flavorText: 'Pilitin ang nangungunang manlalaro na magtapon ng 1 Biyaya card.',
    effects: [
      {
        type: 'DISCARD_BIYAYA',
        value: 1,
        target: 'target_player',
        description: 'Magpatapon ng 1 Biyaya card sa kalaban.',
      },
    ],
  },
  {
    id: 'biyaya_draw_choice_1',
    deck: 'biyaya',
    title: 'Dalawang Pagpipilian',
    subtitle: 'Pala-palagay',
    flavorText: 'Bumunot ng 2 Biyaya card, itago ang isa at itapon ang isa.',
    effects: [
      {
        type: 'DRAW_BIYAYA',
        value: 1,
        target: 'self',
        description: 'Bumunot ng 1 Biyaya card.',
      },
    ],
  },
  {
    id: 'biyaya_leap_1',
    deck: 'biyaya',
    title: 'Luksong-Tinik',
    subtitle: 'Talon ng Tikbalang',
    flavorText: 'Lumundag ng 4 na espasyo lampas sa anumang panganib sa daan.',
    effects: [
      {
        type: 'MOVE_FORWARD',
        value: 4,
        target: 'self',
        description: 'Lumundag ng 4 na espasyo pasulong.',
      },
    ],
  },
  {
    id: 'biyaya_final_step_1',
    deck: 'biyaya',
    title: 'Tanglaw sa Aetherya',
    subtitle: 'Biyaya ni Varyndor',
    flavorText: 'Sumulong ng 1 hakbang sa bawat Biyaya card na hawak sa kamay (max 3).',
    effects: [
      {
        type: 'MOVE_FORWARD',
        value: 3,
        target: 'self',
        description: 'Sumulong ng hanggang 3 espasyo ayon sa dami ng baraha.',
      },
    ],
  },
];

// 30 Canonical Kapalaran Risk-or-Reward Cards from GDD (15 Risks, 15 Rewards)
export const CANONICAL_KAPALARAN_CARDS: GameCard[] = [
  // 15 Risks
  {
    id: 'kap_risk_1',
    deck: 'kapalaran',
    title: 'Ang Tabi sa Punso',
    flavorText: 'Nakatapak ka sa sagradong punso sa kakahuyan.',
    choices: [
      {
        label: 'Mag-iwan ng alay',
        text: 'Ligtas na makadaan at bumunot ng 1 Biyaya card.',
        effects: [{ type: 'DRAW_BIYAYA', value: 1, target: 'self', description: 'Bumunot ng 1 Biyaya card.' }],
      },
      {
        label: 'Tumakbo nang mabilis',
        text: 'Sumulong ng 2 hakbang, ngunit mawawala ang susunod mong tira.',
        effects: [
          { type: 'MOVE_FORWARD', value: 2, target: 'self', description: 'Sumulong ng 2 hakbang.' },
          { type: 'SKIP_TURN', target: 'self', description: 'Skip ang susunod na tira.' },
        ],
      },
    ],
  },
  {
    id: 'kap_risk_2',
    deck: 'kapalaran',
    title: 'Ang Babala ng Tikbalang',
    flavorText: 'Nakaharang ang isang matangkad na nilalang sa iyong daanan.',
    choices: [
      {
        label: 'Tahakin ang makitid na bangin',
        text: 'Sumulong ng 3 espasyo sa madulas na daan.',
        effects: [{ type: 'MOVE_FORWARD', value: 3, target: 'self', description: 'Sumulong ng 3 espasyo.' }],
      },
      {
        label: 'Umiwas sa gilid ng ilog',
        text: 'Umatras ng 1 espasyo upang makatiyak sa kaligtasan.',
        effects: [{ type: 'MOVE_BACKWARD', value: 1, target: 'self', description: 'Umatras ng 1 espasyo.' }],
      },
    ],
  },
  {
    id: 'kap_risk_3',
    deck: 'kapalaran',
    title: 'Ang Pabuya ng Engkanto',
    flavorText: 'May kumikinang na bato na iniaabot ang isang mapanlinlang na nilalang.',
    choices: [
      {
        label: 'Tanggapin nang buong paggalang',
        text: 'Bumunot ng 1 Biyaya action card.',
        effects: [{ type: 'DRAW_BIYAYA', value: 1, target: 'self', description: 'Bumunot ng 1 Biyaya card.' }],
      },
      {
        label: 'Tanggihan at magpatuloy',
        text: 'Walang mangyayari at maglakbay nang ligtas.',
        effects: [{ type: 'MOVE_FORWARD', value: 1, target: 'self', description: 'Sumulong ng 1 espasyo.' }],
      },
    ],
  },
  {
    id: 'kap_risk_4',
    deck: 'kapalaran',
    title: 'Ang Alay sa Alon',
    flavorText: 'Inabot ka ng unos sa maalong tubig ng Alonawon.',
    choices: [
      {
        label: 'Mag-alay ng hiyas sa dagat',
        text: 'Skip ang susunod na tira, ngunit bumunot ng 2 Biyaya cards.',
        effects: [
          { type: 'SKIP_TURN', target: 'self', description: 'Skip susunod na tira.' },
          { type: 'DRAW_BIYAYA', value: 2, target: 'self', description: 'Bumunot ng 2 Biyaya.' },
        ],
      },
      {
        label: 'Sagwanan nang buong lakas',
        text: 'Umatras ng 2 espasyo dahil sa malakas na agos.',
        effects: [{ type: 'MOVE_BACKWARD', value: 2, target: 'self', description: 'Umatras ng 2 espasyo.' }],
      },
    ],
  },
  {
    id: 'kap_risk_5',
    deck: 'kapalaran',
    title: 'Ang Salubong sa Daan',
    flavorText: 'May matandang pulubi na humihingi ng tulong sa gilid ng trail.',
    choices: [
      {
        label: 'Bahaginan ng baong pagkain',
        text: 'Gantimpalaan ng 1 Biyaya card agad.',
        effects: [{ type: 'DRAW_BIYAYA', value: 1, target: 'self', description: 'Bumunot ng 1 Biyaya.' }],
      },
      {
        label: 'Ipagpatuloy ang paglakad',
        text: 'Umatras ng 1 hakbang dahil sa bigat ng konsensya.',
        effects: [{ type: 'MOVE_BACKWARD', value: 1, target: 'self', description: 'Umatras ng 1 hakbang.' }],
      },
    ],
  },
  {
    id: 'kap_risk_6',
    deck: 'kapalaran',
    title: 'Silaw ng Sirena',
    flavorText: 'Isang misteryosong tinig ang umaalingawngaw sa ilog na humihila sa iyo.',
    choices: [
      {
        label: 'Makinig at sundan ang tinig',
        text: 'Umatras ng 2 espasyo, ngunit bumunot ng 1 Biyaya card.',
        effects: [
          { type: 'MOVE_BACKWARD', value: 2, target: 'self', description: 'Umatras ng 2 espasyo.' },
          { type: 'DRAW_BIYAYA', value: 1, target: 'self', description: 'Bumunot ng 1 Biyaya card.' },
        ],
      },
      {
        label: 'Takpan ang tainga at lumayo',
        text: 'Sumulong ng 1 espasyo nang ligtas.',
        effects: [{ type: 'MOVE_FORWARD', value: 1, target: 'self', description: 'Sumulong ng 1 espasyo.' }],
      },
    ],
  },
  {
    id: 'kap_risk_7',
    deck: 'kapalaran',
    title: 'Lihim ng Lumang Libingan',
    flavorText: 'May lumot na lapida na may ukit na sinaunang Baybayin.',
    choices: [
      {
        label: 'Basahin nang malakas ang panalangin',
        text: 'Parangalan ang mga yumao at bumunot ng 1 Biyaya card.',
        effects: [{ type: 'DRAW_BIYAYA', value: 1, target: 'self', description: 'Bumunot ng 1 Biyaya card.' }],
      },
      {
        label: 'Halukayin ang paligid para sa ginto',
        text: 'Umatras ng 3 espasyo at mawalan ng 1 tira dahil sa sumpa.',
        effects: [
          { type: 'MOVE_BACKWARD', value: 3, target: 'self', description: 'Umatras ng 3 espasyo.' },
          { type: 'SKIP_TURN', target: 'self', description: 'Skip ang susunod na tira.' },
        ],
      },
    ],
  },
  {
    id: 'kap_risk_8',
    deck: 'kapalaran',
    title: 'Pulang Alitaptap',
    flavorText: 'Kumpol ng mapupulang alitaptap ang nagliliwanag sa paligid mo.',
    choices: [
      {
        label: 'Sundan ang kanilang paglipad',
        text: 'Sumulong ng 3 espasyo pasulong.',
        effects: [{ type: 'MOVE_FORWARD', value: 3, target: 'self', description: 'Sumulong ng 3 espasyo.' }],
      },
      {
        label: 'Tabuyin sila at magparikit ng sulo',
        text: 'Magtapon ng 1 Biyaya card dahil sa alitan.',
        effects: [{ type: 'DISCARD_BIYAYA', value: 1, target: 'self', description: 'Magtapon ng 1 Biyaya card.' }],
      },
    ],
  },
  {
    id: 'kap_risk_9',
    deck: 'kapalaran',
    title: 'Ang Talahibang Ligaw',
    flavorText: 'Matalim na damong talahib ang humaharang sa daanan.',
    choices: [
      {
        label: 'Tahakin nang dahan-dahan',
        text: 'Sumulong ng 1 hakbang nang ligtas.',
        effects: [{ type: 'MOVE_FORWARD', value: 1, target: 'self', description: 'Sumulong ng 1 hakbang.' }],
      },
      {
        label: 'Sumugod nang mabilis',
        text: 'Umatras ng 2 hakbang dahil sa mga sugat.',
        effects: [{ type: 'MOVE_BACKWARD', value: 2, target: 'self', description: 'Umatras ng 2 hakbang.' }],
      },
    ],
  },
  {
    id: 'kap_risk_10',
    deck: 'kapalaran',
    title: 'Ang Sumpa ng Alikabok',
    flavorText: 'Tigang na hangin ang nagdala ng nakabubulag na alikabok.',
    choices: [
      {
        label: 'Tumigil at manalangin',
        text: 'Skip susunod na tira, ngunit bumunot ng 1 Biyaya.',
        effects: [
          { type: 'SKIP_TURN', target: 'self', description: 'Skip susunod na tira.' },
          { type: 'DRAW_BIYAYA', value: 1, target: 'self', description: 'Bumunot ng 1 Biyaya.' },
        ],
      },
      {
        label: 'Tumakbo sa gitna ng unos',
        text: 'Umatras ng 2 hakbang pabalik.',
        effects: [{ type: 'MOVE_BACKWARD', value: 2, target: 'self', description: 'Umatras ng 2 hakbang.' }],
      },
    ],
  },
  {
    id: 'kap_risk_11',
    deck: 'kapalaran',
    title: 'Tahanan ng Mangkukulam',
    flavorText: 'May maliit na dampa na may pumapailanlang na usok sa libis.',
    choices: [
      {
        label: 'Humingi ng gayumang pampalakas',
        text: 'Bumunot ng 1 Biyaya card.',
        effects: [{ type: 'DRAW_BIYAYA', value: 1, target: 'self', description: 'Bumunot ng 1 Biyaya.' }],
      },
      {
        label: 'Tumakas bago ka mapansin',
        text: 'Sumulong ng 1 hakbang pasulong.',
        effects: [{ type: 'MOVE_FORWARD', value: 1, target: 'self', description: 'Sumulong ng 1 hakbang.' }],
      },
    ],
  },
  {
    id: 'kap_risk_12',
    deck: 'kapalaran',
    title: 'Lason sa Tubig',
    flavorText: 'Mapait at maruming tubig ang natagpuan ng iyong pangkat.',
    choices: [
      {
        label: 'Pakuluan ang tubig gamit ang kahoy',
        text: 'Makalampas nang ligtas at bumunot ng 1 Biyaya.',
        effects: [{ type: 'DRAW_BIYAYA', value: 1, target: 'self', description: 'Bumunot ng 1 Biyaya.' }],
      },
      {
        label: 'Inumin agad dahil sa labis na uhaw',
        text: 'Mawalan ng susunod na tira dahil sa karamdaman.',
        effects: [{ type: 'SKIP_TURN', target: 'self', description: 'Skip ang susunod na tira.' }],
      },
    ],
  },
  {
    id: 'kap_risk_13',
    deck: 'kapalaran',
    title: 'Anino sa Balete',
    flavorText: 'Higanteng hugis ang dahan-dahang humihiwalay sa sanga ng lumang puno.',
    choices: [
      {
        label: 'Yumukod nang may buong paggalang',
        text: 'Bumunot ng 1 Biyaya card mula sa kapre.',
        effects: [{ type: 'DRAW_BIYAYA', value: 1, target: 'self', description: 'Bumunot ng 1 Biyaya.' }],
      },
      {
        label: 'Tumakbo nang buong takot',
        text: 'Umatras ng 3 espasyo pabalik.',
        effects: [{ type: 'MOVE_BACKWARD', value: 3, target: 'self', description: 'Umatras ng 3 espasyo.' }],
      },
    ],
  },
  {
    id: 'kap_risk_14',
    deck: 'kapalaran',
    title: 'Bigat ng Dala',
    flavorText: 'Nalaslas ang iyong supot habang umaakyat sa matarik na talampas.',
    choices: [
      {
        label: 'Pulutin isa-isa ang mga gamit',
        text: 'Skip ang susunod na tira sa pag-aayos.',
        effects: [{ type: 'SKIP_TURN', target: 'self', description: 'Skip susunod na tira.' }],
      },
      {
        label: 'Iwan ang mga gamit at magpatuloy',
        text: 'Sumulong ng 2 hakbang ngunit magtapon ng 1 Biyaya card.',
        effects: [
          { type: 'MOVE_FORWARD', value: 2, target: 'self', description: 'Sumulong ng 2 hakbang.' },
          { type: 'DISCARD_BIYAYA', value: 1, target: 'self', description: 'Magtapon ng 1 Biyaya card.' },
        ],
      },
    ],
  },
  {
    id: 'kap_risk_15',
    deck: 'kapalaran',
    title: 'Bagsak ng Sigwa',
    flavorText: 'Madilim na hamog ng Karimlan ang sumasalubong sa hangganan.',
    choices: [
      {
        label: 'Sambitin ang dasal ng Babaylan',
        text: 'Bumunot ng 1 Biyaya card sa lakas ng loob.',
        effects: [{ type: 'DRAW_BIYAYA', value: 1, target: 'self', description: 'Bumunot ng 1 Biyaya.' }],
      },
      {
        label: 'Umatras sa silungan',
        text: 'Umatras ng 3 hakbang pabalik.',
        effects: [{ type: 'MOVE_BACKWARD', value: 3, target: 'self', description: 'Umatras ng 3 hakbang.' }],
      },
    ],
  },

  // 15 Rewards
  {
    id: 'kap_reward_1',
    deck: 'kapalaran',
    title: 'Basbas ng Diwa',
    flavorText: 'Mahiwagang sinag ng liwanag ang nagbigay tanglaw sa landas.',
    choices: [
      {
        label: 'Magpasalamat sa liwanag',
        text: 'Sumulong agad ng 3 hakbang pasulong!',
        effects: [{ type: 'MOVE_FORWARD', value: 3, target: 'self', description: 'Sumulong ng 3 hakbang.' }],
      },
      {
        label: 'Ipunin ang liwanag sa anting-anting',
        text: 'Bumunot ng 1 Biyaya card at sumulong ng 1 hakbang.',
        effects: [
          { type: 'DRAW_BIYAYA', value: 1, target: 'self', description: 'Bumunot ng 1 Biyaya.' },
          { type: 'MOVE_FORWARD', value: 1, target: 'self', description: 'Sumulong ng 1 hakbang.' },
        ],
      },
    ],
  },
  {
    id: 'kap_reward_2',
    deck: 'kapalaran',
    title: 'Gintong Butil',
    flavorText: 'May natagpuang kumikinang na ginintuang butil sa ilalim ng kahoy.',
    choices: [
      {
        label: 'Ingatan bilang sagradong agimat',
        text: 'Bumunot ng 1 Biyaya card.',
        effects: [{ type: 'DRAW_BIYAYA', value: 1, target: 'self', description: 'Bumunot ng 1 Biyaya card.' }],
      },
      {
        label: 'Itanim sa lupa',
        text: 'Sumulong ng 2 hakbang pasulong sa tulong ng kalikasan.',
        effects: [{ type: 'MOVE_FORWARD', value: 2, target: 'self', description: 'Sumulong ng 2 hakbang.' }],
      },
    ],
  },
  {
    id: 'kap_reward_3',
    deck: 'kapalaran',
    title: 'Batis ng Katotohanan',
    flavorText: 'Nakarating ka sa malinaw na batis na sumasalamin sa iyong diwa.',
    choices: [
      {
        label: 'Uminom upang luminaw ang isip',
        text: 'Bumunot ng 1 Biyaya card.',
        effects: [{ type: 'DRAW_BIYAYA', value: 1, target: 'self', description: 'Bumunot ng 1 Biyaya.' }],
      },
      {
        label: 'Hugasan ang mga paa',
        text: 'Sumulong ng 2 hakbang nang may bagong sigla.',
        effects: [{ type: 'MOVE_FORWARD', value: 2, target: 'self', description: 'Sumulong ng 2 hakbang.' }],
      },
    ],
  },
  {
    id: 'kap_reward_4',
    deck: 'kapalaran',
    title: 'Ang Hinto ng Manghuhula',
    flavorText: 'Isang manghuhula ang lumapit upang basahin ang iyong palad.',
    choices: [
      {
        label: 'Makinig sa kanyang hula',
        text: 'Bumunot ng 2 Biyaya cards mula sa deck.',
        effects: [{ type: 'DRAW_BIYAYA', value: 2, target: 'self', description: 'Bumunot ng 2 Biyaya cards.' }],
      },
      {
        label: 'Magpatuloy sa paglalakbay',
        text: 'Sumulong ng 1 hakbang.',
        effects: [{ type: 'MOVE_FORWARD', value: 1, target: 'self', description: 'Sumulong ng 1 hakbang.' }],
      },
    ],
  },
  {
    id: 'kap_reward_5',
    deck: 'kapalaran',
    title: 'Puno ng Pagpili',
    flavorText: 'Nahahati ang daan sa paligid ng dambuhalang akasya.',
    choices: [
      {
        label: 'Dumaan sa kaliwang ugat',
        text: 'Sumulong ng 2 hakbang pasulong.',
        effects: [{ type: 'MOVE_FORWARD', value: 2, target: 'self', description: 'Sumulong ng 2 hakbang.' }],
      },
      {
        label: 'Umakyat sa mataas na sanga',
        text: 'Bumunot ng 1 Biyaya card at sumulong ng 1 hakbang.',
        effects: [
          { type: 'DRAW_BIYAYA', value: 1, target: 'self', description: 'Bumunot ng 1 Biyaya.' },
          { type: 'MOVE_FORWARD', value: 1, target: 'self', description: 'Sumulong ng 1 hakbang.' },
        ],
      },
    ],
  },
  {
    id: 'kap_reward_6',
    deck: 'kapalaran',
    title: 'Haplos ng Amihan',
    flavorText: 'Sariwang simoy mula sa kabundukan ang pumawi sa iyong pagod.',
    choices: [
      {
        label: 'Sumayaw kasabay ng hangin',
        text: 'Sumulong ng 4 na hakbang pasulong!',
        effects: [{ type: 'MOVE_FORWARD', value: 4, target: 'self', description: 'Sumulong ng 4 na hakbang.' }],
      },
      {
        label: 'Magpahinga sa lilim',
        text: 'Bumunot ng 1 Biyaya card.',
        effects: [{ type: 'DRAW_BIYAYA', value: 1, target: 'self', description: 'Bumunot ng 1 Biyaya card.' }],
      },
    ],
  },
  {
    id: 'kap_reward_7',
    deck: 'kapalaran',
    title: 'Agimat ng Ligtas',
    flavorText: 'Isang mahiwagang medalya ang sumabit sa iyong kamay.',
    choices: [
      {
        label: 'Gamitin ang kalasag',
        text: 'Bumunot ng 1 Kalasag / Shield card.',
        effects: [{ type: 'ANTING_ANTING_SHIELD', target: 'self', description: 'Magkaroon ng kalasag na proteksyon.' }],
      },
      {
        label: 'Ibahagi ang bisa',
        text: 'Sumulong ng 2 hakbang pasulong.',
        effects: [{ type: 'MOVE_FORWARD', value: 2, target: 'self', description: 'Sumulong ng 2 hakbang.' }],
      },
    ],
  },
  {
    id: 'kap_reward_8',
    deck: 'kapalaran',
    title: 'Susi ng Diwaling',
    flavorText: 'Isang lihim na ukit ang nagbigay pahiwatig sa pagbubukas ng tarangkahan.',
    choices: [
      {
        label: 'Silipin ang lihim ng gate',
        text: 'Silipin ang susunod na Pahiwatig card.',
        effects: [{ type: 'PEEK_PAHIWATIG', target: 'self', description: 'Silipin ang pahiwatig card.' }],
      },
      {
        label: 'Ipagpatuloy ang paglakad',
        text: 'Sumulong ng 2 hakbang.',
        effects: [{ type: 'MOVE_FORWARD', value: 2, target: 'self', description: 'Sumulong ng 2 hakbang.' }],
      },
    ],
  },
  {
    id: 'kap_reward_9',
    deck: 'kapalaran',
    title: 'Talim ng Arnis',
    flavorText: 'Nagsanay ka sa sinaunang sining ng pakikipaglaban.',
    choices: [
      {
        label: 'Hasain ang liksi',
        text: 'Kumuha ng 1 dagdag na tira agad!',
        effects: [{ type: 'EXTRA_TURN', target: 'self', description: 'Magkaroon ng karagdagang tira agad.' }],
      },
      {
        label: 'Mag-ipon ng lakas',
        text: 'Bumunot ng 1 Biyaya card.',
        effects: [{ type: 'DRAW_BIYAYA', value: 1, target: 'self', description: 'Bumunot ng 1 Biyaya.' }],
      },
    ],
  },
  {
    id: 'kap_reward_10',
    deck: 'kapalaran',
    title: 'Kapatiran ng Aninag',
    flavorText: 'Naramdaman mo ang init ng pakikisama ng iyong mga kasama.',
    choices: [
      {
        label: 'Makipagpalit ng pwesto sa kakampi sa realm',
        text: 'Magpalit ng pwesto sa manlalaro sa parehong lupain.',
        effects: [{ type: 'SWAP_PLAYERS_SAME_REALM', target: 'target_player', description: 'Magpalit ng pwesto.' }],
      },
      {
        label: 'Sumulong nang sabay',
        text: 'Sumulong ng 2 hakbang pasulong.',
        effects: [{ type: 'MOVE_FORWARD', value: 2, target: 'self', description: 'Sumulong ng 2 hakbang.' }],
      },
    ],
  },
  {
    id: 'kap_reward_11',
    deck: 'kapalaran',
    title: 'Lakas ng Apo',
    flavorText: 'Binasbasan ka ng dakilang bundok ng apoy at bato.',
    choices: [
      {
        label: 'Sumulong nang 3 hakbang',
        text: 'Sumulong ng 3 espasyo at bumunot ng 1 Biyaya.',
        effects: [
          { type: 'MOVE_FORWARD', value: 3, target: 'self', description: 'Sumulong ng 3 hakbang.' },
          { type: 'DRAW_BIYAYA', value: 1, target: 'self', description: 'Bumunot ng 1 Biyaya.' },
        ],
      },
      {
        label: 'Paurungin ang nangunguna',
        text: 'Pumili ng kalaban na aatras ng 2 espasyo.',
        effects: [{ type: 'MOVE_BACKWARD', value: 2, target: 'target_player', description: 'Paurungin ang kalaban ng 2 espasyo.' }],
      },
    ],
  },
  {
    id: 'kap_reward_12',
    deck: 'kapalaran',
    title: 'Buntot ng Bakunawa',
    flavorText: 'Malakas na alon ang nagtulak sa iyong balsa patungo sa dalampasigan.',
    choices: [
      {
        label: 'Sumakay sa taluktok ng alon',
        text: 'Sumulong ng 3 hakbang pasulong!',
        effects: [{ type: 'MOVE_FORWARD', value: 3, target: 'self', description: 'Sumulong ng 3 hakbang.' }],
      },
      {
        label: 'Mangisda ng biyaya',
        text: 'Bumunot ng 2 Biyaya cards.',
        effects: [{ type: 'DRAW_BIYAYA', value: 2, target: 'self', description: 'Bumunot ng 2 Biyaya cards.' }],
      },
    ],
  },
  {
    id: 'kap_reward_13',
    deck: 'kapalaran',
    title: 'Liwanag sa Karimlan',
    flavorText: 'Nahawi ang itim na usok at lumitaw ang malinis na daanan.',
    choices: [
      {
        label: 'Mabilis na maglakbay',
        text: 'Sumulong ng 2 hakbang at gumulong muli ng dice.',
        effects: [
          { type: 'MOVE_FORWARD', value: 2, target: 'self', description: 'Sumulong ng 2 hakbang.' },
          { type: 'EXTRA_TURN', target: 'self', description: 'Karagdagang tira agad.' },
        ],
      },
      {
        label: 'Mag-alay ng dasal sa Bathala',
        text: 'Awtomatikong maging tama ang susunod na Pagsubok.',
        effects: [{ type: 'AUTO_CORRECT_PAGSUBOK', target: 'self', description: 'Awtomatikong tama ang susunod na Pagsubok.' }],
      },
    ],
  },
  {
    id: 'kap_reward_14',
    deck: 'kapalaran',
    title: 'Dilig ng Hamog',
    flavorText: 'Napakagandang hamog sa dapit-umaga na nagpagaling sa iyong sugat.',
    choices: [
      {
        label: 'Luminis ang diwa',
        text: 'Bumunot ng 1 Biyaya card at sumulong ng 1 hakbang.',
        effects: [
          { type: 'DRAW_BIYAYA', value: 1, target: 'self', description: 'Bumunot ng 1 Biyaya.' },
          { type: 'MOVE_FORWARD', value: 1, target: 'self', description: 'Sumulong ng 1 hakbang.' },
        ],
      },
      {
        label: 'Ipagpag ang antok',
        text: 'Sumulong ng 2 hakbang pasulong.',
        effects: [{ type: 'MOVE_FORWARD', value: 2, target: 'self', description: 'Sumulong ng 2 hakbang.' }],
      },
    ],
  },
  {
    id: 'kap_reward_15',
    deck: 'kapalaran',
    title: 'Tarangkahan ng Aetherya',
    flavorText: 'Natanaw mo ang gintong tulay patungo sa dambana ni Varyndor.',
    choices: [
      {
        label: 'Tumakbo patungo sa tulay',
        text: 'Sumulong ng 3 hakbang pasulong at kumuha ng 1 Biyaya card!',
        effects: [
          { type: 'MOVE_FORWARD', value: 3, target: 'self', description: 'Sumulong ng 3 hakbang.' },
          { type: 'DRAW_BIYAYA', value: 1, target: 'self', description: 'Bumunot ng 1 Biyaya card.' },
        ],
      },
      {
        label: 'Maghanda para sa Huling Hamon',
        text: 'Bumunot ng 2 Biyaya cards para sa huling laban.',
        effects: [{ type: 'DRAW_BIYAYA', value: 2, target: 'self', description: 'Bumunot ng 2 Biyaya cards.' }],
      },
    ],
  },
];

// Helper to construct the 50-tile Serpentine Board Layout
export function buildCanonicalBoard(): BoardTile[] {
  const tiles: BoardTile[] = [];

  // Start tile (Index 0)
  tiles.push({
    index: 0,
    realm: 'talvaris',
    shape: 'triangle',
    type: 'daan',
    title: 'Simula ng Lakbayin',
    description: 'Ang paanan ng sagradong lupain ng Talvaris.',
    gridX: 0,
    gridY: 0,
  });

  let currentTileIndex = 1;

  // 1. TALVARIS (Earth) - 17 tiles: 1 gate, 8 daan, 4 pagsubok, 4 kapalaran
  // Pattern: Gate at 1, then alternating daan, pagsubok, kapalaran
  const talvarisPattern: TileType[] = [
    'pintuan', // 1: Gate of Ikapatar
    'daan', 'pagsubok', 'daan', 'kapalaran',
    'daan', 'pagsubok', 'daan', 'kapalaran',
    'daan', 'pagsubok', 'daan', 'kapalaran',
    'daan', 'pagsubok', 'daan', 'kapalaran'
  ];

  for (let i = 0; i < talvarisPattern.length; i++) {
    const type = talvarisPattern[i];
    const shape = type === 'pintuan' ? 'pentagon' : 'triangle';
    // Serpentine coordinate: Row 0 going East (X: 1 to 17)
    tiles.push({
      index: currentTileIndex,
      realm: 'talvaris',
      shape,
      type,
      title: type === 'pintuan' 
        ? 'Pintuan ng Talvaris (Ikapatar)' 
        : type === 'pagsubok' ? `Pagsubok sa Lupa #${currentTileIndex}` 
        : type === 'kapalaran' ? `Kapalaran sa Lupa #${currentTileIndex}` 
        : `Daan ng Talvaris #${currentTileIndex}`,
      guardianName: type === 'pintuan' ? 'Ikapatar (Ikapati)' : undefined,
      description: type === 'pintuan' ? 'Unang tarangkahan na binabantayan ng diwata ng lupa at ani.' : undefined,
      gridX: i + 1,
      gridY: 0,
    });
    currentTileIndex++;
  }

  // 2. ALABARYA (Fire) - 14 tiles: 1 gate, 7 daan, 3 pagsubok, 3 kapalaran
  const alabaryaPattern: TileType[] = [
    'pintuan', // 18: Gate of Sinukalab
    'daan', 'pagsubok', 'daan', 'kapalaran',
    'daan', 'pagsubok', 'daan', 'kapalaran',
    'daan', 'pagsubok', 'daan', 'kapalaran',
    'daan'
  ];

  for (let i = 0; i < alabaryaPattern.length; i++) {
    const type = alabaryaPattern[i];
    const shape = type === 'pintuan' ? 'pentagon' : 'triangle';
    // Serpentine coordinate: Drop to Row 1 going West (X: 17 - i)
    tiles.push({
      index: currentTileIndex,
      realm: 'alabarya',
      shape,
      type,
      title: type === 'pintuan' 
        ? 'Pintuan ng Alabarya (Sinukalab)' 
        : type === 'pagsubok' ? `Pagsubok sa Apoy #${currentTileIndex}` 
        : type === 'kapalaran' ? `Kapalaran sa Apoy #${currentTileIndex}` 
        : `Daan ng Alabarya #${currentTileIndex}`,
      guardianName: type === 'pintuan' ? 'Sinukalab (Sinukuan)' : undefined,
      description: type === 'pintuan' ? 'Ikalawang tarangkahan ng naglalagablab na bulkan.' : undefined,
      gridX: 17 - i,
      gridY: 1,
    });
    currentTileIndex++;
  }

  // 3. ALONAWON (Water) - 11 tiles: 1 gate, 5 daan, 3 pagsubok, 2 kapalaran
  const alonawonPattern: TileType[] = [
    'pintuan', // 32: Gate of Sinayalon
    'daan', 'pagsubok', 'daan', 'kapalaran',
    'daan', 'pagsubok', 'daan', 'kapalaran',
    'daan', 'pagsubok'
  ];

  for (let i = 0; i < alonawonPattern.length; i++) {
    const type = alonawonPattern[i];
    const shape = type === 'pintuan' ? 'pentagon' : 'triangle';
    // Serpentine coordinate: Row 2 going East (X: 4 + i)
    tiles.push({
      index: currentTileIndex,
      realm: 'alonawon',
      shape,
      type,
      title: type === 'pintuan' 
        ? 'Pintuan ng Alonawon (Sinayalon)' 
        : type === 'pagsubok' ? `Pagsubok sa Tubig #${currentTileIndex}` 
        : type === 'kapalaran' ? `Kapalaran sa Tubig #${currentTileIndex}` 
        : `Daan ng Alonawon #${currentTileIndex}`,
      guardianName: type === 'pintuan' ? 'Sinayalon (Aman Sinaya)' : undefined,
      description: type === 'pintuan' ? 'Ikatlong tarangkahan ng kailaliman ng karagatan.' : undefined,
      gridX: 4 + i,
      gridY: 2,
    });
    currentTileIndex++;
  }

  // 4. HIMARAYA (Air) - 8 tiles: 1 gate, 4 daan, 2 pagsubok, 1 kapalaran
  const himarayaPattern: TileType[] = [
    'pintuan', // 43: Gate of Lihamihan
    'daan', 'pagsubok', 'daan', 'kapalaran',
    'daan', 'pagsubok', 'daan'
  ];

  for (let i = 0; i < himarayaPattern.length; i++) {
    const type = himarayaPattern[i];
    const shape = type === 'pintuan' ? 'pentagon' : 'triangle';
    // Serpentine coordinate: Row 3 going West (X: 14 - i)
    tiles.push({
      index: currentTileIndex,
      realm: 'himaraya',
      shape,
      type,
      title: type === 'pintuan' 
        ? 'Pintuan ng Himaraya (Lihamihan)' 
        : type === 'pagsubok' ? `Pagsubok sa Hangin #${currentTileIndex}` 
        : type === 'kapalaran' ? `Kapalaran sa Hangin #${currentTileIndex}` 
        : `Daan ng Himaraya #${currentTileIndex}`,
      guardianName: type === 'pintuan' ? 'Lihamihan (Amihan)' : undefined,
      description: type === 'pintuan' ? 'Ikaapat na tarangkahan sa matatayog na ulap ng Kaluwalhatian.' : undefined,
      gridX: 14 - i,
      gridY: 3,
    });
    currentTileIndex++;
  }

  // 5. AETHERYA (Sanctuary) - Tile 50
  tiles.push({
    index: 50,
    realm: 'aetherya',
    shape: 'sanctuary',
    type: 'aetherya',
    title: 'Aetherya — Ang Dambana ni Varyndor',
    guardianName: 'Varyndor (Huling Hamon)',
    description: 'Ang ginintuang dambana kung saan muling ibabalik ang Diwa at tatapusin ang Karimlan.',
    gridX: 6,
    gridY: 4,
  });

  return tiles;
}

export const CANONICAL_BOARD_TILES = buildCanonicalBoard();

export const DEFAULT_CHARACTER_AVATARS = [
  { id: 'char_babaylan', name: 'Babaylan Tala', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  { id: 'char_mandirigma', name: 'Mandirigma Urduja', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'char_datu', name: 'Datu Lapu', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 'char_albularyo', name: 'Albularyo Mang Selo', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
  { id: 'char_manlalakbay', name: 'Manlalakbay Amihan', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'char_tagabantay', name: 'Tagabantay Kawayan', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
];

export const DEFAULT_REALM_BACKGROUNDS: Record<RealmType, string> = {
  talvaris: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&auto=format&fit=crop&q=80',
  alabarya: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80',
  alonawon: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&auto=format&fit=crop&q=80',
  himaraya: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
  aetherya: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
};

export const INITIAL_ALL_CARDS: GameCard[] = [
  ...CANONICAL_SUMPA_CARDS,
  ...CANONICAL_PAHIWATIG_CARDS,
  ...CANONICAL_PAGSUBOK_CARDS,
  ...CANONICAL_BIYAYA_CARDS,
  ...CANONICAL_KAPALARAN_CARDS,
];

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  systemPassword: 'diwa_admin_2026',
  characterAvatars: DEFAULT_CHARACTER_AVATARS,
  realmBackgrounds: DEFAULT_REALM_BACKGROUNDS,
  cardFrameStyle: 'ancient',
  cards: INITIAL_ALL_CARDS,
};
