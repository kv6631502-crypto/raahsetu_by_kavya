import { City, SupportedLanguage } from "./routeData";

export const getSpeechRecognitionLocale = (lang: SupportedLanguage): string => {
  switch (lang) {
    case "hi":
      return "hi-IN";
    case "bn":
      return "bn-IN";
    case "as":
      return "as-IN";
    case "en":
    default:
      return "en-IN";
  }
};

export const MULTILINGUAL_ALIASES: Record<string, string[]> = {
  guwahati: ["guwahati", "gauhati", "गुवाहाटी", "গোৱাহাটী", "গুয়াহাটি", "गौहाटी", "gowahati", "guhati"],
  dispur: ["dispur", "दिसपुर", "দিছপুৰ", "দিসপুর"],
  tawang: ["tawang", "तवांग", "তাৱাং", "তাওয়াং", "tavang"],
  gangtok: ["gangtok", "गंगटोक", "গ্যাংটক", "গেংটক", "gangtokk"],
  itanagar: ["itanagar", "ईटानगर", "ইটানগৰ", "ইটানগর", "ita nagar"],
  shillong: ["shillong", "शिलांग", "শ্বিলং", "শিলং", "silong"],
  kohima: ["kohima", "कोहिमा", "কহিমা", "কোহিমা"],
  imphal: ["imphal", "इम्फाल", "ইম্ফল", "ইম্ফাল", "imfal"],
  aizawl: ["aizawl", "आइजोल", "আইজল", "aizwal", "ijol"],
  agartala: ["agartala", "अगरतला", "আগৰতলা", "আগরতলা", "agartalla"],
  dibrugarh: ["dibrugarh", "डिब्रूगढ़", "ডিব্ৰুগড়", "ডিব্রুগড়", "dibrugar"],
  silchar: ["silchar", "सिलचर", "শিলচৰ", "শিলচর"],
  jorhat: ["jorhat", "जोरहाट", "যোৰহাট", "জোরহাট"],
  tezpur: ["tezpur", "तेजपुर", "তেজপুৰ", "তেজপুর"],
  dimapur: ["dimapur", "दीमापुर", "দিমাপুর", "দীমাপুর", "দিমাপুৰ"],
  nagaon: ["nagaon", "नगांव", "নগাঁও", "nowgong"],
  bongaigaon: ["bongaigaon", "बोंगाईगांव", "বঙাইগাঁও"],
  goalpara: ["goalpara", "गोलपारा", "গোৱালপাৰা", "গোয়ালপাড়া"],
  dhubri: ["dhubri", "धुबरी", "ধুবুৰী", "ধুবড়ী"],
  kokrajhar: ["kokrajhar", "कोकराझार", "কোকৰাঝাৰ", "কোকড়াঝাড়"],
  tinsukia: ["tinsukia", "तिनसुकिया", "তিনিচুকীয়া", "তিনসুকিয়া"],
  sivasagar: ["sivasagar", "शिवसागर", "শিৱসাগৰ", "শিবসাগর", "sibsagar"],
  barpeta: ["barpeta", "बरपेटा", "বৰপেটা", "বরপেটা"],
  nalbari: ["nalbari", "नलबाड़ी", "নলবাৰী", "নলবাড়ি"],
  mangaldai: ["mangaldai", "मंगलदै", "মঙলদৈ", "মঙ্গলদৈ"],
  north_lakhimpur: ["north lakhimpur", "lakhimpur", "उत्तर लखीमपुर", "উত্তৰ লখিমপুৰ", "লখিমপুর"],
  diphu: ["diphu", "दीफू", "ডিফু"],
  haflong: ["haflong", "हाफलोंग", "হাফলং"],
  karimganj: ["karimganj", "करीमगंज", "কৰিমগঞ্জ", "করিমগঞ্জ"],
  hailakandi: ["hailakandi", "हेलाकांडी", "হাইলাকান্দি"],
  bomdila: ["bomdila", "बोमडिला", "বোমডিলা"],
  dirang: ["dirang", "दिरांग", "দিৰাং"],
  ziro: ["ziro", "जीरो", "জিৰো"],
  pasighat: ["pasighat", "पासीघाट", "পাছিঘাট", "পাসিঘাট"],
  aalo: ["aalo", "along", "आलो", "আলো"],
  roing: ["roing", "रोइंग", "ৰয়িং"],
  tezu: ["tezu", "तेज़ू", "তেজু"],
  namsai: ["namsai", "नामसाई", "নামছাই"],
  changlang: ["changlang", "चांगलांग", "চাংলাং"],
  khonsa: ["khonsa", "खोंसा", "খোন্সা"],
  churachandpur: ["churachandpur", "चुराचांदपुर", "চুৰাচান্দপুৰ"],
  ukhrul: ["ukhrul", "उखरुल", "উখৰুল"],
  senapati: ["senapati", "सेनापति", "সেনাপতি"],
  tamenglong: ["tamenglong", "तामेंगलोंग", "তামেংলং"],
  thoubal: ["thoubal", "थौबल", "থৌবাল"],
  bishnupur: ["bishnupur", "विष्णुपुर", "বিষ্ণুপুৰ"],
  kakching: ["kakching", "ककचिंग", "কাকচিং"],
  jiribam: ["jiribam", "जिरीबाम", "জিৰিবাম"],
  moreh: ["moreh", "मोरेह", "মোৰে"],
  mokokchung: ["mokokchung", "मोकोकचुंग", "মককচাং"],
  tuensang: ["tuensang", "तुएनसांग", "টুৱেনচাং"],
  mon: ["mon", "मोन", "মন"],
  wokha: ["wokha", "वोखा", "ৱখা"],
  zunheboto: ["zunheboto", "जुन्हेबोतो", "জুনহেব'ট'"],
  phek: ["phek", "फेक", "ফেক"],
  kiphire: ["kiphire", "किफिरे", "কিফিৰে"],
  longleng: ["longleng", "लोंगलेंग", "লংলেং"],
  peren: ["peren", "पेरेन", "পেৰেন"],
  lunglei: ["lunglei", "लुंगलेई", "লুংলেই"],
  champhai: ["champhai", "चम्फाई", "চম্ফাই"],
  kolasib: ["kolasib", "कोलासिब", "ক'লাশিব"],
  serchhip: ["serchhip", "सेरछिप", "চেৰচিপ"],
  lawngtlai: ["lawngtlai", "लॉन्गत्लाई", "লংতলাই"],
  saiha: ["saiha", "साइहा", "ছাইহা"],
  mamit: ["mamit", "मामित", "মামিত"],
  hnahthial: ["hnahthial", "हनाथियाल", "হনাতিয়াল"],
  saitual: ["saitual", "सैतुल", "ছাইতুৱাল"],
  khawzawl: ["khawzawl", "खाव्ज़ावल", "খাওজল"],
  udaipur: ["udaipur", "उदयपुर", "উদয়পুর"],
  dharmanagar: ["dharmanagar", "धर्मनगर", "ধৰ্মনগৰ", "ধর্মনগর"],
  kailashahar: ["kailashahar", "कैलाशहर", "কৈলাসহৰ", "কৈলাশহর"],
  ambassa: ["ambassa", "अंबासा", "আম্বাসা"],
  belonia: ["belonia", "बेलोनीया", "বিলোনিয়া"],
  khowai: ["khowai", "खोवाई", "খোয়াই"],
  teliamura: ["teliamura", "तेलियामुरा", "তেলিয়ামুড়া"],
  bishalgarh: ["bishalgarh", "विशालगढ़", "বিশালগড়"],
  santirbazar: ["santirbazar", "शांतिरबाज़ार", "শান্তিরবাজার"],
  sabroom: ["sabroom", "सबरूम", "সাব্রুম"],
  namchi: ["namchi", "नामची", "নামচি"],
  pelling: ["pelling", "पेलिंग", "পেলিং"],
  mangan: ["mangan", "मंगन", "মংগন"],
  rangpo: ["rangpo", "रंगपो", "ৰাংপো"],
  singtam: ["singtam", "सिंगतम", "সিংটাম"],
  ravangla: ["ravangla", "रवांगला", "ৰাভাংলা"],
  chungthang: ["chungthang", "चुंगथांग", "চুংথাং"],
  tura: ["tura", "तुरा", "তুৰা"],
  jowai: ["jowai", "जोवाई", "জোৱাই"],
  nongpoh: ["nongpoh", "नोंगपोह", "নংপোহ"],
  williamnagar: ["williamnagar", "विलियमनगर", "উইলিয়ামনগৰ"],
  baghmara: ["baghmara", "बाघमारा", "বাঘমাৰা"],
  resubelpara: ["resubelpara", "रेसुबेलपारा", "ৰেচুবিলপাৰা"],
  ampati: ["ampati", "अंपाती", "আমপাতি"],
  khliehriat: ["khliehriat", "ख्लिहरियात", "ক্লিহৰিয়াত"],
  mairang: ["mairang", "मैरांग", "মাইৰাং"],
  mawkyrwat: ["mawkyrwat", "मॉकिरवाट", "মাওকিৰৱাত"],
  cherrapunji: ["cherrapunji", "sohra", "चेरापूंजी", "सोहरा", "চেৰাপুঞ্জী"],
  dawki: ["dawki", "डावकी", "ডাউকি", "ডাওকি"],
};

function cleanSpeechToken(str: string): string {
  return str
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_'~`()?"!|।]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchCityFromVoice(rawText: string, cities: City[]): City | null {
  if (!rawText) return null;
  const clean = cleanSpeechToken(rawText);

  // 1. Direct match with aliases
  for (const [cityId, aliases] of Object.entries(MULTILINGUAL_ALIASES)) {
    for (const alias of aliases) {
      if (clean === alias || clean.includes(alias) || alias.includes(clean)) {
        const found = cities.find((c) => c.id === cityId);
        if (found) return found;
      }
    }
  }

  // 2. Direct name or ID matching
  for (const city of cities) {
    const cityNameLower = city.name.toLowerCase();
    const cityIdLower = city.id.toLowerCase();
    if (clean === cityNameLower || clean === cityIdLower) {
      return city;
    }
    if (clean.includes(cityNameLower) || cityNameLower.includes(clean)) {
      return city;
    }
  }

  // 3. Word token matching
  const tokens = clean.split(" ").filter((t) => t.length >= 3);
  for (const token of tokens) {
    for (const [cityId, aliases] of Object.entries(MULTILINGUAL_ALIASES)) {
      for (const alias of aliases) {
        if (token === alias || alias.includes(token)) {
          const found = cities.find((c) => c.id === cityId);
          if (found) return found;
        }
      }
    }
    for (const city of cities) {
      const cLower = city.name.toLowerCase();
      if (cLower === token || cLower.startsWith(token)) {
        return city;
      }
    }
  }

  return null;
}

export function parseRouteVoiceCommand(
  rawText: string,
  cities: City[]
): { origin: City | null; destination: City | null; isRoute: boolean } {
  const clean = cleanSpeechToken(rawText);

  const routeSplitters = [
    /\s+(?:to|towards|into|unto|2)\s+/i,
    /\s+(?:से|तक|को|की ओर)\s+/i,
    /\s+(?:থেকে|হতে|পর্যন্ত)\s+/i,
    /\s+(?:ৰ পৰা|লৈ|লৈকে)\s+/i,
    /\s+(?:se|tak)\s+/i,
  ];

  for (const splitter of routeSplitters) {
    const parts = clean.split(splitter);
    if (parts.length >= 2) {
      const partOrigin = parts[0].trim();
      const partDest = parts[1].trim();

      const originCity = matchCityFromVoice(partOrigin, cities);
      const destCity = matchCityFromVoice(partDest, cities);

      if (originCity || destCity) {
        return {
          origin: originCity,
          destination: destCity,
          isRoute: true,
        };
      }
    }
  }

  const singleCity = matchCityFromVoice(clean, cities);
  return {
    origin: singleCity,
    destination: null,
    isRoute: false,
  };
}

export function speakMultilingual(
  text: string,
  lang: SupportedLanguage,
  isMuted: boolean = false
): void {
  if (isMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = getSpeechRecognitionLocale(lang);
    window.speechSynthesis.speak(utterance);
  } catch {
    // Fail silently if speech synthesis not available
  }
}
