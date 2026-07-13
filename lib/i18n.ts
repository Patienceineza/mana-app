export type Language = 'en' | 'af' | 'zu';

export const LANGUAGES: { key: Language; label: string; nativeLabel: string }[] = [
  { key: 'en', label: 'English', nativeLabel: 'English' },
  { key: 'af', label: 'Afrikaans', nativeLabel: 'Afrikaans' },
  { key: 'zu', label: 'isiZulu', nativeLabel: 'isiZulu' },
];

const dict = {
  // common
  logOut: { en: 'Log Out', af: 'Meld Af', zu: 'Phuma' },
  logIn: { en: 'Log In', af: 'Meld Aan', zu: 'Ngena' },
  cancel: { en: 'Cancel', af: 'Kanselleer', zu: 'Khansela' },
  save: { en: 'Save', af: 'Stoor', zu: 'Londoloza' },
  settings: { en: 'Settings', af: 'Instellings', zu: 'Izilungiselelo' },
  language: { en: 'Language', af: 'Taal', zu: 'Ulimi' },
  appearance: { en: 'Appearance', af: 'Voorkoms', zu: 'Ukubukeka' },
  darkMode: { en: 'Dark Mode', af: 'Donker Modus', zu: 'Imodi Emnyama' },
  light: { en: 'Light', af: 'Lig', zu: 'Ukukhanya' },
  dark: { en: 'Dark', af: 'Donker', zu: 'Mnyama' },
  system: { en: 'System', af: 'Stelsel', zu: 'Isistimu' },
  account: { en: 'Account', af: 'Rekening', zu: 'I-akhawunti' },
  buyer: { en: 'Buyer', af: 'Koper', zu: 'Umthengi' },
  farmer: { en: 'Farmer', af: 'Boer', zu: 'Umlimi' },
  coordinator: { en: 'Coordinator', af: 'Koördineerder', zu: 'Umxhumanisi' },
  driver: { en: 'Driver', af: 'Bestuurder', zu: 'Umshayeli' },
  admin: { en: 'Admin', af: 'Administrateur', zu: 'Umqondisi' },
  finance: { en: 'Finance', af: 'Finansies', zu: 'Ezezimali' },

  // buyer
  goodMorning: { en: 'Good morning', af: 'Goeie môre', zu: 'Sawubona' },
  searchPlaceholder: { en: 'Search tomatoes, spinach, onions…', af: 'Soek tamaties, spinasie, uie…', zu: 'Sesha utamatisi, isipinashi, u-anyanisi…' },
  todaysMarket: { en: "Today's Market", af: 'Vandag se Mark', zu: 'Imakethe Yanamuhla' },
  weeklyRoute: { en: 'Weekly Route', af: 'Weeklikse Roete', zu: 'Umzila Wamasonto' },
  subtotal: { en: 'Subtotal', af: 'Subtotaal', zu: 'Isamba Esincane' },
  proceedToCheckout: { en: 'Proceed to Checkout', af: 'Gaan voort na Uitbetaal', zu: 'Qhubeka Uye Ekukhokheni' },
  checkout: { en: 'Checkout', af: 'Uitbetaal', zu: 'Ukukhokha' },
  placeOrder: { en: 'Place Order', af: 'Plaas Bestelling', zu: 'Beka I-oda' },
  deliveryDate: { en: 'Delivery Date', af: 'Afleweringsdatum', zu: 'Usuku Lokulethwa' },
  deliveryAddress: { en: 'Delivery Address', af: 'Afleweringsadres', zu: 'Ikheli Lokulethwa' },
  farmTraceability: { en: 'Farm Traceability', af: 'Plaas Naspeurbaarheid', zu: 'Ukulandelelwa Kwepulazi' },
  savedProduce: { en: 'Saved Produce', af: 'Gestoorde Produkte', zu: 'Imikhiqizo Egciniwe' },
  orders: { en: 'Orders', af: 'Bestellings', zu: 'Ama-oda' },
  saved: { en: 'Saved', af: 'Gestoor', zu: 'Kugciniwe' },
  farmsSourced: { en: 'Farms Sourced', af: 'Plase Verkry', zu: 'Amapulazi Atholakele' },
  addToRoute: { en: 'Add to Route', af: 'Voeg by Roete', zu: 'Engeza Emzileni' },

  // farmer
  myHarvestLog: { en: 'My Harvest Log', af: 'My Oesregister', zu: 'Irekhodi Lami Lesivuno' },
  logNewCrop: { en: '+ Log New Crop', af: '+ Registreer Nuwe Gewas', zu: '+ Bhalisa Isitshalo Esisha' },
  nextCollection: { en: 'Next Collection', af: 'Volgende Versameling', zu: 'Ukuqoqwa Okulandelayo' },
  cropType: { en: 'Crop Type', af: 'Gewastipe', zu: 'Uhlobo Lwesitshalo' },
  quantityKg: { en: 'Quantity (kg)', af: 'Hoeveelheid (kg)', zu: 'Isamba (kg)' },
  expectedHarvestDate: { en: 'Expected Harvest Date', af: 'Verwagte Oesdatum', zu: 'Usuku Olulindelekile Lokuvuna' },
  submitCropLog: { en: 'Submit Crop Log', af: 'Dien Gewasregister In', zu: 'Thumela Irekhodi Lesitshalo' },
  todaysMarketPrices: { en: "Today's Market Prices", af: 'Vandag se Markpryse', zu: 'Amanani Emakethe Namuhla' },
  myEarnings: { en: 'My Earnings', af: 'My Verdienste', zu: 'Imali Yami Engenayo' },
  pendingPayout: { en: 'Pending Payout', af: 'Hangende Uitbetaling', zu: 'Inkokhelo Elindile' },
  completedPayouts: { en: 'Completed Payouts', af: 'Voltooide Uitbetalings', zu: 'Izinkokhelo Eziqediwe' },
  trustRating: { en: 'Trust Rating', af: 'Vertrouegradering', zu: 'Izinga Lokwethenjwa' },
  myListings: { en: 'My Listings', af: 'My Lyste', zu: 'Uhlu Lwami' },
  newListing: { en: '+ New Listing', af: '+ Nuwe Lys', zu: '+ Uhlu Olusha' },
  productName: { en: 'Product Name', af: 'Produknaam', zu: 'Igama Lomkhiqizo' },
  pricePerUnit: { en: 'Price per unit (R)', af: 'Prys per eenheid (R)', zu: 'Intengo ngeyunithi (R)' },
  stockStatus: { en: 'Stock Status', af: 'Voorraadstatus', zu: 'Isimo Sesitoko' },
  submitListing: { en: 'Publish Listing', af: 'Publiseer Lys', zu: 'Shicilela Uhlu' },
  noListingsYet: { en: "You haven't listed any produce yet.", af: 'Jy het nog geen produkte gelys nie.', zu: 'Awukabhalisi mikhiqizo okwamanje.' },

  // coordinator
  todaysFieldOperations: { en: "Today's Field Operations", af: "Vandag se Veldwerksaamhede", zu: 'Imisebenzi Yasensimini Namuhla' },
  pendingInspections: { en: 'Pending Inspections', af: 'Hangende Inspeksies', zu: 'Ukuhlolwa Okulindile' },
  passedToday: { en: 'Passed Today', af: 'Geslaag Vandag', zu: 'Kuphumelele Namuhla' },
  rejectedToday: { en: 'Rejected Today', af: 'Verwerp Vandag', zu: 'Kwenqatshiwe Namuhla' },
  totalWeightQueued: { en: 'Total Weight Queued', af: 'Totale Gewig in Wagtou', zu: 'Isisindo Esilindile' },
  goToInspections: { en: 'Go to Inspections →', af: 'Gaan na Inspeksies →', zu: 'Yiya Ekuhlolweni →' },
  viewTodaysRoute: { en: "View Today's Route →", af: 'Bekyk Vandag se Roete →', zu: 'Buka Umzila Wanamuhla →' },
  dropOffSequence: { en: 'Drop-off Sequence', af: 'Aflaai Volgorde', zu: 'Ukulandelana Kokulethwa' },
  noRouteToday: { en: 'No route planned for today yet', af: 'Nog geen roete vir vandag beplan nie', zu: 'Akukho mzila ohlelwe namuhla okwamanje' },
  qualityPhotos: { en: 'Quality Photos', af: 'Kwaliteitfoto\'s', zu: 'Izithombe Zekhwalithi' },
  weightVerification: { en: 'Weight Verification', af: 'Gewigsverifikasie', zu: 'Ukuqinisekiswa Kwesisindo' },
  decision: { en: 'Decision', af: 'Besluit', zu: 'Isinqumo' },
  accept: { en: 'Accept', af: 'Aanvaar', zu: 'Yamukela' },
  reject: { en: 'Reject', af: 'Verwerp', zu: 'Yenqaba' },
  notes: { en: 'Notes', af: 'Notas', zu: 'Amanothi' },
  submitInspection: { en: 'Submit Inspection', af: 'Dien Inspeksie In', zu: 'Thumela Ukuhlolwa' },

  // driver
  myDeliveries: { en: 'My Deliveries', af: 'My Aflewerings', zu: 'Ukulethwa Kwami' },
  assignedDeliveries: { en: 'Assigned Deliveries', af: 'Toegewysde Aflewerings', zu: 'Ukulethwa Okwabelwe' },
  noDeliveriesAssigned: { en: 'No deliveries assigned yet', af: 'Nog geen aflewerings toegewys nie', zu: 'Akukho okulethwa okwabelwe okwamanje' },
  markPickedUp: { en: 'Mark Picked Up', af: 'Merk as Opgelaai', zu: 'Phawula Njengokuthathiwe' },
  markInTransit: { en: 'Mark In Transit', af: 'Merk as Onderweg', zu: 'Phawula Njengokusendleleni' },
  markDelivered: { en: 'Mark Delivered', af: 'Merk as Afgelewer', zu: 'Phawula Njengokulethiwe' },
  reportIssue: { en: 'Report Issue', af: 'Rapporteer Probleem', zu: 'Bika Inkinga' },
  deliveryNotes: { en: 'Delivery Notes', af: 'Afleweringsnotas', zu: 'Amanothi Okulethwa' },
  saveNotes: { en: 'Save Notes', af: 'Stoor Notas', zu: 'Londoloza Amanothi' },
  backToDeliveries: { en: '← Back to deliveries', af: '← Terug na aflewerings', zu: '← Buyela ekuLethweni' },
  deliveryAddressLabel: { en: 'Delivery Address', af: 'Afleweringsadres', zu: 'Ikheli Lokulethwa' },
} as const;

export type TranslationKey = keyof typeof dict;

export function translate(key: TranslationKey, lang: Language): string {
  return dict[key][lang] ?? dict[key].en;
}
