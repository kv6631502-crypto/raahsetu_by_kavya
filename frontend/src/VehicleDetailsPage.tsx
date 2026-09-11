import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Container,
  Gauge,
  Info,
  MapPin,
  Phone,
  Scale,
  Shield,
  ShieldAlert,
  Sparkles,
  Truck,
  User,
} from "lucide-react";
import { DriverProfile } from "./App";
import { CommodityType, VehicleType } from "./routeData";
import { SupportedLanguage } from "./translations";

export interface VehicleDetailsPageProps {
  lang?: SupportedLanguage;
  initialProfile: DriverProfile;
  onSave: (updated: DriverProfile) => void;
  onSkip: () => void;
  onBack?: () => void;
}

// Translations for Vehicle Details Page
const VEHICLE_TRANSLATIONS: Record<
  SupportedLanguage,
  {
    step1Text: string;
    step2Text: string;
    stepVerified: string;
    badge: string;
    title: string;
    subtitle: string;
    quickPresetsTitle: string;
    quickPresetsSubtitle: string;
    presetHeavy: string;
    presetHeavyDesc: string;
    presetMedical: string;
    presetMedicalDesc: string;
    presetFuel: string;
    presetFuelDesc: string;
    presetPickup: string;
    presetPickupDesc: string;
    presetAgro: string;
    presetAgroDesc: string;
    specsTitle: string;
    regLabel: string;
    regPlaceholder: string;
    regHint: string;
    classLabel: string;
    classHeavy: string;
    classHeavyDesc: string;
    classStandard: string;
    classStandardDesc: string;
    classLight: string;
    classLightDesc: string;
    gvwLabel: string;
    gvwUnit: string;
    bridgeSafe: string;
    bridgeCaution: string;
    bridgeRestricted: string;
    axleLabel: string;
    axle2: string;
    axle3: string;
    axleMulti: string;
    dimensionsTitle: string;
    heightLabel: string;
    widthLabel: string;
    tunnelClearanceNotice: string;
    cargoTitle: string;
    cargoLabel: string;
    cargoMedical: string;
    cargoMedicalDesc: string;
    cargoAgro: string;
    cargoAgroDesc: string;
    cargoPds: string;
    cargoPdsDesc: string;
    cargoFuel: string;
    cargoFuelDesc: string;
    cargoConstruction: string;
    cargoConstructionDesc: string;
    driverTitle: string;
    driverNameLabel: string;
    driverMobileLabel: string;
    fleetDepotLabel: string;
    emergencyContactLabel: string;
    safetyChecklistTitle: string;
    safetyBrakes: string;
    safetyChains: string;
    safetyGps: string;
    skipBtn: string;
    confirmBtn: string;
    backBtn: string;
    customPresetApplied: string;
  }
> = {
  en: {
    step1Text: "Driver Authentication",
    step2Text: "Vehicle & Logistics Manifest",
    stepVerified: "Verified",
    badge: "Operational Manifest Configuration",
    title: "Vehicle & Freight Specifications",
    subtitle:
      "Configure your vehicle dimensions, gross axle weight, and cargo sensitivity to ensure bridge clearance, tunnel passage, and slope-safe routing across Northeast mountain corridors.",
    quickPresetsTitle: "Quick Vehicle Presets",
    quickPresetsSubtitle: "One-click load templates for common Northeast transport archetypes",
    presetHeavy: "Heavy 12-Wheeler Truck",
    presetHeavyDesc: "16.5T GVW • 3 Axles • General / Infrastructure Cargo",
    presetMedical: "Rapid Medical Carrier",
    presetMedicalDesc: "5.2T GVW • 2 Axles • Oxygen & Life-Saving Pharma",
    presetFuel: "POL / Petroleum Tanker",
    presetFuelDesc: "14.2T GVW • 3 Axles • Hazardous Fuel & LPG Transit",
    presetPickup: "Mountain 4x4 Bolero Pickup",
    presetPickupDesc: "2.8T GVW • 2 Axles • High-clearance Hill Courier",
    presetAgro: "Cold-Chain Produce Carrier",
    presetAgroDesc: "9.5T GVW • 2 Axles • Perishable Food & Produce",
    specsTitle: "Vehicle Specifications & Structural Limits",
    regLabel: "Vehicle Registration Plate (RC Number)",
    regPlaceholder: "e.g. AS 01 EC 4421",
    regHint: "Official VAHAN registration format used for highway checkpoint clearance",
    classLabel: "Vehicle Classification",
    classHeavy: "Heavy Multi-Axle",
    classHeavyDesc: "> 12 Tonnes GVW, Commercial Hauler",
    classStandard: "Standard 2-Axle Truck",
    classStandardDesc: "7.5T - 12 Tonnes GVW, Rigid Freight",
    classLight: "Light Commercial (LCV)",
    classLightDesc: "< 7.5 Tonnes, Pickup / 4x4 Bolero",
    gvwLabel: "Gross Vehicle Weight (GVW / Axle Load)",
    gvwUnit: "Tonnes",
    bridgeSafe: "🟢 Cleared for all Northeast Bailey Bridges & river spans (Class 18/24)",
    bridgeCaution: "🟡 Caution: Approaching 12T - 18T load rating on older suspension bridges",
    bridgeRestricted: "🔴 Restricted: Re-routes away from sub-18T Bailey bridges & single-lane spans",
    axleLabel: "Axle Configuration",
    axle2: "2-Axle (4-6 Wheels)",
    axle3: "3-Axle (10 Wheels)",
    axleMulti: "Multi-Axle (12+ Wheels)",
    dimensionsTitle: "Physical Dimensions & Clearances",
    heightLabel: "Max Height Clearance (m)",
    widthLabel: "Vehicle Width (m)",
    tunnelClearanceNotice: "Standard clearance for Sonapur tunnel is 4.5m; Sela Tunnel is 5.2m.",
    cargoTitle: "Cargo & Commodity Manifest",
    cargoLabel: "Select active freight classification to optimize safety sensitivity",
    cargoMedical: "Medical & Oxygen Supplies",
    cargoMedicalDesc: "High urgency, vibration-sensitive, lowest slope prioritization",
    cargoAgro: "Perishable Agriculture",
    cargoAgroDesc: "Time-critical fresh produce, minimizes transit delay",
    cargoPds: "PDS Grain & Civil Rations",
    cargoPdsDesc: "Essential public distribution, reliable all-weather corridor",
    cargoFuel: "Petroleum & Hazardous Goods",
    cargoFuelDesc: "Strict rockfall & steep descent avoidance; avoids populated detours",
    cargoConstruction: "Heavy Infrastructure Material",
    cargoConstructionDesc: "Bridge load compliance, avoids narrow switchbacks",
    driverTitle: "Driver & Dispatch Base Details",
    driverNameLabel: "Driver Full Name",
    driverMobileLabel: "Driver Registered Mobile",
    fleetDepotLabel: "Assigned Logistics Depot / Hub",
    emergencyContactLabel: "Trusted Fleet / Emergency Contact",
    safetyChecklistTitle: "Mountain Pre-Departure Safety Checklist",
    safetyBrakes: "Auxiliary exhaust brake & hill retarder inspected and functional",
    safetyChains: "High-pass wheel chains and heavy recovery tow cables equipped",
    safetyGps: "Emergency cellular / satellite SOS beacon operational",
    skipBtn: "Skip & Use Default Profile",
    confirmBtn: "Confirm Vehicle & Plan Safe Route →",
    backBtn: "Back to Login",
    customPresetApplied: "Preset applied successfully!",
  },
  hi: {
    step1Text: "चालक प्रमाणीकरण",
    step2Text: "वाहन एवं माल घोषणा",
    stepVerified: "सत्यापित",
    badge: "परिचालन घोषणा विनिर्देश",
    title: "वाहन एवं माल विनिर्देश (Vehicle Details)",
    subtitle:
      "पूर्वोत्तर पर्वतीय गलियारों में पुल क्षमता, सुरंग निकास और ढलान-सुरक्षित मार्ग सुनिश्चित करने के लिए अपने वाहन के आयाम, सकल भार और माल संवेदनशीलता को कॉन्फ़िगर करें।",
    quickPresetsTitle: "त्वरित वाहन प्रीसेट",
    quickPresetsSubtitle: "पूर्वोत्तर परिवहन के प्रमुख वाहन प्रकारों के लिए एक-क्लिक टेम्पलेट",
    presetHeavy: "भारी 12-पहिया ट्रक",
    presetHeavyDesc: "16.5T भार • 3 एक्सल • सामान्य / बुनियादी ढांचा माल",
    presetMedical: "त्वरित मेडिकल वाहक",
    presetMedicalDesc: "5.2T भार • 2 एक्सल • ऑक्सीजन एवं जीवन रक्षक दवाएं",
    presetFuel: "पेट्रोलियम / ईंधन टैंकर",
    presetFuelDesc: "14.2T भार • 3 एक्सल • खतरनाक ईंधन एवं गैस ढुलाई",
    presetPickup: "पहाड़ी 4x4 बोलेरो पिकअप",
    presetPickupDesc: "2.8T भार • 2 एक्सल • ऊंचे ग्राउंड क्लीयरेंस वाला वाहन",
    presetAgro: "शीत-श्रृंखला कृषि वाहक",
    presetAgroDesc: "9.5T भार • 2 एक्सल • खराब होने वाले खाद्य उत्पाद",
    specsTitle: "वाहन विनिर्देश एवं संरचनात्मक सीमाएं",
    regLabel: "वाहन पंजीकरण संख्या (RC नंबर)",
    regPlaceholder: "उदा. AS 01 EC 4421",
    regHint: "राजमार्ग जांच चौकी निकासी के लिए आधिकारिक वाहन पंजीकरण प्रारूप",
    classLabel: "वाहन वर्गीकरण",
    classHeavy: "भारी मल्टी-एक्सल ट्रक",
    classHeavyDesc: "> 12 टन सकल भार, भारी वाणिज्यिक",
    classStandard: "मानक 2-एक्सल ट्रक",
    classStandardDesc: "7.5T - 12 टन भार, मध्यम मालवाहक",
    classLight: "हल्का वाणिज्यिक वाहन (LCV)",
    classLightDesc: "< 7.5 टन, पिकअप / 4x4 बोलेरो",
    gvwLabel: "सकल वाहन भार (GVW / एक्सल लोड)",
    gvwUnit: "टन",
    bridgeSafe: "🟢 सभी पूर्वोत्तर बेली पुलों और नदी स्पैन के लिए सुरक्षित (क्लास 18/24)",
    bridgeCaution: "🟡 सावधानी: पुराने पुलों पर 12T - 18T भार सीमा के समीप",
    bridgeRestricted: "🔴 प्रतिबंधित: 18T से कम क्षमता वाले कमजोर बेली पुलों से दूर पुनः मार्ग निर्धारण",
    axleLabel: "एक्सल कॉन्फ़िगरेशन",
    axle2: "2-एक्सल (4-6 पहिए)",
    axle3: "3-एक्सल (10 पहिए)",
    axleMulti: "मल्टी-एक्सल (12+ पहिए)",
    dimensionsTitle: "भौतिक आयाम एवं सुरंग क्लीयरेंस",
    heightLabel: "अधिकतम ऊंचाई क्लीयरेंस (मीटर)",
    widthLabel: "वाहन चौड़ाई (मीटर)",
    tunnelClearanceNotice: "सोनापुर सुरंग मानक ऊंचाई 4.5 मी; सेला सुरंग 5.2 मी है।",
    cargoTitle: "कार्गो एवं माल घोषणा",
    cargoLabel: "मार्ग सुरक्षा अनुकूलन हेतु सक्रिय माल का प्रकार चुनें",
    cargoMedical: "चिकित्सा एवं ऑक्सीजन आपूर्ति",
    cargoMedicalDesc: "अति आवश्यक, न्यूनतम ढलान एवं चिकनी सड़क प्राथमिकता",
    cargoAgro: "नाशवान कृषि उत्पाद",
    cargoAgroDesc: "समय-संवेदनशील उत्पाद, न्यूनतम यात्रा समय",
    cargoPds: "PDS खाद्यान्न एवं सरकारी राशन",
    cargoPdsDesc: "आवश्यक सार्वजनिक वितरण, विश्वसनीय बारहमासी गलियारा",
    cargoFuel: "पेट्रोलियम एवं ज्वलनशील ईंधन",
    cargoFuelDesc: "भूस्खलन और खड़ी ढलानों से पूर्ण बचाव",
    cargoConstruction: "भारी निर्माण सामग्री एवं मशीनरी",
    cargoConstructionDesc: "पुल भार अनुपालन, संकीर्ण मोड़ों से बचाव",
    driverTitle: "चालक एवं डिपो विवरण",
    driverNameLabel: "चालक का पूरा नाम",
    driverMobileLabel: "पंजीकृत मोबाइल नंबर",
    fleetDepotLabel: "आवंटित लॉजिस्टिक्स डिपो / बेस",
    emergencyContactLabel: "विश्वस्त आपातकालीन संपर्क व्यक्ति",
    safetyChecklistTitle: "पर्वतीय प्रस्थान-पूर्व सुरक्षा जांच",
    safetyBrakes: "सहायक एग्जॉस्ट ब्रेक एवं हिल रिटार्डर जांचा गया एवं चालू है",
    safetyChains: "बर्फ/कीचड़ रोधी चेन और भारी टो केबल सुसज्जित हैं",
    safetyGps: "आपातकालीन GPS / सैटेलाइट SOS ट्रांसपोंडर चालू है",
    skipBtn: "छोड़ें एवं डिफ़ॉल्ट प्रोफ़ाइल उपयोग करें",
    confirmBtn: "वाहन विवरण सहेजें एवं सुरक्षित मार्ग चुनें →",
    backBtn: "लॉगिन पर वापस जाएं",
    customPresetApplied: "प्रीसेट सफलतापूर्वक लागू हुआ!",
  },
  as: {
    step1Text: "চালক প্ৰমাণীকৰণ",
    step2Text: "বাহন আৰু মালবাহী বিৱৰণ",
    stepVerified: "সত্যাাপিত",
    badge: "কাৰ্য্যকৰী ঘোষণাপত্ৰ",
    title: "বাহন আৰু মালবাহী বিৱৰণ (Vehicle Details)",
    subtitle:
      "উত্তৰ-পূবৰ পাহাৰীয়া ৰাজপথত দলঙৰ ক্ষমতা, সুৰংগ ক্লিয়াৰেন্স আৰু ঢাল-সুৰক্ষিত পথ বাছনিৰ বাবে বাহনৰ জোখ, ভাৰ আৰু সামগ্ৰী নিৰ্ধাৰণ কৰক।",
    quickPresetsTitle: "দ্ৰুত বাহন প্ৰিসেট",
    quickPresetsSubtitle: "উত্তৰ-পূবৰ পৰিবহনৰ মুখ্য বাহনৰ বাবে এক-ক্লিক টেমপ্লেট",
    presetHeavy: "গধুৰ ১২-চকীয়া ট্ৰাক",
    presetHeavyDesc: "১৬.৫ টন ভাৰ • ৩ এক্সেল • সাধাৰণ / নিৰ্মাণ সামগ্ৰী",
    presetMedical: "জৰুৰীকালীন মেডিকেল বাহন",
    presetMedicalDesc: "৫.২ টন ভাৰ • ২ এক্সেল • অক্সিজেন আৰু জীৱনৰক্ষী ঔষধ",
    presetFuel: "পেট্ৰ'লিয়াম / ইন্ধন টেংকাৰ",
    presetFuelDesc: "১৪.২ টন ভাৰ • ৩ এক্সেল • বিপদজনক ইন্ধন আৰু গেছ",
    presetPickup: "পাহাৰীয়া ৪x৪ বলেৰ' পিকআপ",
    presetPickupDesc: "২.৮ টন ভাৰ • ২ এক্সেল • উচ্চ গ্ৰাউণ্ড ক্লিয়াৰেন্স",
    presetAgro: "শীতল-শৃংখল কৃষি বাহন",
    presetAgroDesc: "৯.৫ টন ভাৰ • ২ এক্সেল • ফল-মূল আৰু শাক-পাচলি",
    specsTitle: "বাহনৰ বিৱৰণ আৰু গাঁথনিগত সীমা",
    regLabel: "বাহন পঞ্জীয়ন নম্বৰ (RC Number)",
    regPlaceholder: "যেনে AS 01 EC 4421",
    regHint: "ৰাজপথ তালাচী চকীৰ ক্লিয়াৰেন্সৰ বাবে আনুষ্ঠানিক বাহন নম্বৰ",
    classLabel: "বাহনৰ শ্ৰেণীবিভাজন",
    classHeavy: "গধুৰ মালবাহী ট্ৰাক",
    classHeavyDesc: "> ১২ টন মুঠ ভাৰ, বাণিজ্যিক মালবাহী",
    classStandard: "মানক ২-এক্সেল ট্ৰাক",
    classStandardDesc: "৭.৫ - ১২ টন ভাৰ, মধ্যম মালবাহী",
    classLight: "পাতল বাণিজ্যিক বাহন (LCV)",
    classLightDesc: "< ৭.৫ টন, পিকআপ / ৪x৪",
    gvwLabel: "মুঠ বাহন ভাৰ (GVW / এক্সল লোড)",
    gvwUnit: "টন",
    bridgeSafe: "🟢 উত্তৰ-পূবৰ সকলো বেইলি দলঙৰ বাবে নিৰাপদ (Class 18/24)",
    bridgeCaution: "🟡 সাৱধান: পুৰণি ওলোমা দলঙত ১২-১৮ টন ভাৰৰ সীমা",
    bridgeRestricted: "🔴 নিষিদ্ধ: ১৮ টনতকৈ কম ক্ষমতাৰ দুৰ্বল বেইলি দলং পৰিহাৰ কৰা হ'ব",
    axleLabel: "এক্সেল বিন্যাস",
    axle2: "২-এক্সেল (৪-৬ চকা)",
    axle3: "৩-এক্সেল (১০ চকা)",
    axleMulti: "মাল্টি-এক্সেল (১২+ চকা)",
    dimensionsTitle: "দৈহিক জোখ আৰু সুৰংগ ক্লিয়াৰেন্স",
    heightLabel: "সৰ্বোচ্চ উচ্চতা (মিটাৰ)",
    widthLabel: "বাহনৰ প্ৰস্থ (মিটাৰ)",
    tunnelClearanceNotice: "সোণাপুৰ সুৰংগৰ মানক উচ্চতা ৪.৫ মিটাৰ; ছেলা সুৰংগ ৫.২ মিটাৰ।",
    cargoTitle: "সামগ্ৰী আৰু পণ্য ঘোষণা",
    cargoLabel: "সুৰক্ষিত পথৰ বাবে পণ্যৰ প্ৰকাৰ বাছনি কৰক",
    cargoMedical: "চিকিৎসা আৰু অক্সিজেন যোগান",
    cargoMedicalDesc: "অতি প্ৰয়োজনীয়, মসৃণ পথ আৰু কম ঢাল অগ্ৰাধিকাৰ",
    cargoAgro: "কৃষি সামগ্ৰী",
    cargoAgroDesc: "সময়-সংবেদনশীল, দ্ৰুত পৰিবহন অগ্ৰাধিকাৰ",
    cargoPds: "PDS খাদ্য শস্য আৰু ৰেচন",
    cargoPdsDesc: "অত্যাৱশ্যকীয় ৰাজহুৱা বিতৰণ, নিৰ্ভৰযোগ্য পথ",
    cargoFuel: "পেট্ৰ'লিয়াম আৰু বিপদজনক ইন্ধন",
    cargoFuelDesc: "ভূমিস্খলন আৰু ঠিয় পাহাৰীয়া পথ সম্পূৰ্ণ পৰিহাৰ",
    cargoConstruction: "গধুৰ নিৰ্মাণ সামগ্ৰী",
    cargoConstructionDesc: "দলঙৰ ভাৰ ক্ষমতা অনুসৰণ",
    driverTitle: "চালক আৰু ডিপোৰ তথ্য",
    driverNameLabel: "চালকৰ সম্পূৰ্ণ নাম",
    driverMobileLabel: "পঞ্জীয়নভুক্ত মোবাইল নম্বৰ",
    fleetDepotLabel: "লজিষ্টিক্স ডিপো / কেন্দ্ৰ",
    emergencyContactLabel: "বিশ্বস্ত জৰুৰীকালীন যোগাযোগ নম্বৰ",
    safetyChecklistTitle: "যাত্ৰাৰ পূৰ্বৰ সুৰক্ষা পৰীক্ষা",
    safetyBrakes: "সহায়ক এক্সহষ্ট ব্ৰেক আৰু হিল ৰিটাৰ্ডাৰ পৰীক্ষা কৰা হৈছে",
    safetyChains: "বৰফ/বোকাৰ চেইন আৰু টো-কেবল লগত আছে",
    safetyGps: "জৰুৰীকালীন GPS / ছেটেলাইট SOS সংকেত কাৰ্যক্ষম",
    skipBtn: "এৰি চলক আৰু পূৰ্বনিৰ্ধাৰিত ব্যৱহাৰ কৰক",
    confirmBtn: "বাহনৰ তথ্য সাঁচক আৰু নিৰাপদ পথ বাছক →",
    backBtn: "লগইনলৈ উভতি যাওক",
    customPresetApplied: "প্ৰিসেট সফলভাৱে প্ৰয়োগ কৰা হ'ল!",
  },
  bn: {
    step1Text: "চালক প্রমাণীকরণ",
    step2Text: "যানবাহন ও মালবাহী বিবরণ",
    stepVerified: "যাচাইকৃত",
    badge: "অপারেশনাল মেনিফেস্ট কনফিগারেশন",
    title: "যানবাহন ও মালবাহী বিবরণ (Vehicle Details)",
    subtitle:
      "উত্তর-পূর্বের পাহাড়ি করিডোরে সেতুর ভার ক্ষমতা, টানেল ক্লিয়ারেন্স এবং ঢাল-নিরাপদ রুট নিশ্চিত করতে আপনার যানবাহনের মাপ, ওজন ও পণ্যের সংবেদনশীলতা নির্দিষ্ট করুন।",
    quickPresetsTitle: "দ্রুত যানবাহন প্রিসেট",
    quickPresetsSubtitle: "উত্তর-পূর্ব পরিবহনের প্রধান যানবাহনের জন্য এক-ক্লিক টেমপ্লেট",
    presetHeavy: "ভারী ১২-চাকার ট্রাক",
    presetHeavyDesc: "১৬.৫ টন ওজন • ৩ এক্সেল • সাধারণ / নির্মাণ সামগ্রী",
    presetMedical: "জরুরি মেডিকেল বাহক",
    presetMedicalDesc: "৫.২ টন ওজন • ২ এক্সেল • অক্সিজেন ও জীবনরক্ষাকারী ওষুধ",
    presetFuel: "পেট্রোলিয়াম / জ্বালানি ট্যাঙ্কার",
    presetFuelDesc: "১৪.২ টন ওজন • ৩ এক্সেল • বিপজ্জনক জ্বালানি ও গ্যাস",
    presetPickup: "পাহাড়ি ৪x৪ বোলেরো পিকআপ",
    presetPickupDesc: "২.৮ টন ওজন • ২ এক্সেল • উচ্চ গ্রাউন্ড ক্লিয়ারেন্স",
    presetAgro: "কোল্ড-চেইন কৃষি বাহক",
    presetAgroDesc: "৯.৫ টন ওজন • ২ এক্সেল • পচনশীল ফল ও সবজি",
    specsTitle: "যানবাহনের স্পেসিফিকেশন ও কাঠামোগত সীমা",
    regLabel: "যানবাহন নিবন্ধন নম্বর (RC Number)",
    regPlaceholder: "যেমন AS 01 EC 4421",
    regHint: "হাইওয়ে চেকপোস্ট ছাড়পত্রের জন্য অফিসিয়াল যানবাহন নম্বর",
    classLabel: "যানবাহনের শ্রেণীবিভাগ",
    classHeavy: "ভারী মাল্টি-এক্সেল ট্রাক",
    classHeavyDesc: "> ১২ টন মোট ওজন, ভারী বাণিজ্যিক",
    classStandard: "মানক ২-এক্সেল ট্রাক",
    classStandardDesc: "৭.৫ - ১২ টন ওজন, মাঝারি মালবাহী",
    classLight: "হালকা বাণিজ্যিক বাহন (LCV)",
    classLightDesc: "< ৭.৫ টন, পিকআপ / ৪x৪",
    gvwLabel: "মোট যানবাহনের ওজন (GVW / এক্সেল লোড)",
    gvwUnit: "টন",
    bridgeSafe: "🟢 উত্তর-পূর্বের সমস্ত বেইলি সেতুর জন্য নিরাপদ (Class 18/24)",
    bridgeCaution: "🟡 সতর্কতা: পুরানো ঝুলন্ত সেতুতে ১২-১৮ টন লোড সীমা",
    bridgeRestricted: "🔴 সীমাবদ্ধ: ১৮ টনের কম ক্ষমতার দুর্বল বেইলি সেতু পরিহার করা হবে",
    axleLabel: "এক্সেল কনফিগারেশন",
    axle2: "২-এক্সেল (৪-৬ চাকা)",
    axle3: "৩-এক্সেল (১০ চাকা)",
    axleMulti: "মাল্টি-এক্সেল (১২+ চাকা)",
    dimensionsTitle: "শারীরিক মাত্রা ও টানেল ক্লিয়ারেন্স",
    heightLabel: "সর্বোচ্চ উচ্চতা (মিটার)",
    widthLabel: "যানবাহনের প্রস্থ (মিটার)",
    tunnelClearanceNotice: "সোনাপুর টানেলের মানক উচ্চতা ৪.৫ মিটার; সেলা টানেল ৫.২ মিটার।",
    cargoTitle: "কার্গো ও পণ্যের বিবরণ",
    cargoLabel: "নিরাপদ রুটের জন্য পণ্যের ধরণ নির্বাচন করুন",
    cargoMedical: "চিকিৎসা ও অক্সিজেন সরবরাহ",
    cargoMedicalDesc: "জরুরি, মসৃণ রাস্তা এবং কম ঢাল অগ্রাধিকার",
    cargoAgro: "পচনশীল কৃষি পণ্য",
    cargoAgroDesc: "সময়-সংবেদনশীল, দ্রুত পরিবহন অগ্রাধিকার",
    cargoPds: "PDS খাদ্যশস্য ও রেশনের চাল",
    cargoPdsDesc: "জরুরি জনবণ্টন সামগ্রী, নির্ভরযোগ্য করিডোর",
    cargoFuel: "পেট্রোলিয়াম ও বিপজ্জনক জ্বালানি",
    cargoFuelDesc: "ভূমিধস এবং খাড়া পাহাড়ি পথ সম্পূর্ণ পরিহার",
    cargoConstruction: "ভারী নির্মাণ সামগ্রী",
    cargoConstructionDesc: "সেতুর ভার ক্ষমতা মেনে চলা",
    driverTitle: "চালক ও ডিপো বিবরণ",
    driverNameLabel: "চালকের সম্পূর্ণ নাম",
    driverMobileLabel: "নিবন্ধিত মোবাইল নম্বর",
    fleetDepotLabel: "নির্ধারিত লজিস্টিক ডিপো / কেন্দ্র",
    emergencyContactLabel: "বিশ্বস্ত জরুরি যোগাযোগ নম্বর",
    safetyChecklistTitle: "যাত্রাপূর্ব পাহাড়ি সুরক্ষা পরীক্ষা",
    safetyBrakes: "সহায়ক এক্সহস্ট ব্রেক এবং হিল রিটার্ডার পরীক্ষিত ও সক্রিয়",
    safetyChains: "বরফ/কাদার চেইন এবং ভারী টো কেবল যুক্ত আছে",
    safetyGps: "জরুরি GPS / স্যাটেলাইট SOS সংকেত সক্রিয়",
    skipBtn: "এড়িয়ে যান এবং ডিফল্ট প্রোফাইল ব্যবহার করুন",
    confirmBtn: "যানবাহন তথ্য সংরক্ষণ করুন ও নিরাপদ রুট দেখুন →",
    backBtn: "লগইনে ফিরে যান",
    customPresetApplied: "প্রিসেট সফলভাবে প্রয়োগ করা হয়েছে!",
  },
};

export const VehicleDetailsPage: React.FC<VehicleDetailsPageProps> = ({
  lang = "en",
  initialProfile,
  onSave,
  onSkip,
  onBack,
}) => {
  const t = VEHICLE_TRANSLATIONS[lang] || VEHICLE_TRANSLATIONS.en;

  // Form State initialized from initialProfile
  const [driverName, setDriverName] = useState(initialProfile.driverName || "Rajesh Kumar Das");
  const [driverMobile, setDriverMobile] = useState(initialProfile.driverMobile || "+91 98640 12345");
  const [vehicleNo, setVehicleNo] = useState(initialProfile.vehicleNo || "AS 01 EC 4421");
  const [vehicleType, setVehicleType] = useState<VehicleType>(initialProfile.vehicleType || "heavy");
  const [commodity, setCommodity] = useState<CommodityType>(initialProfile.commodity || "medical");
  const [trustedContactName, setTrustedContactName] = useState(
    initialProfile.trustedContactName || "Fleet Dispatch Base"
  );
  const [trustedContactMobile, setTrustedContactMobile] = useState(
    initialProfile.trustedContactMobile || "+91 94350 98765"
  );

  // Extended mountain specs state
  const [grossWeightTonnes, setGrossWeightTonnes] = useState<number>(
    initialProfile.grossWeightTonnes || (initialProfile.vehicleType === "light" ? 2.8 : 16.5)
  );
  const [axleCount, setAxleCount] = useState<number>(initialProfile.axleCount || 3);
  const [heightMetres, setHeightMetres] = useState<number>(initialProfile.heightMetres || 3.8);
  const [widthMetres, setWidthMetres] = useState<number>(initialProfile.widthMetres || 2.5);
  const [fleetDepot, setFleetDepot] = useState<string>(
    initialProfile.fleetDepot || "Guwahati Inland Logistics Park"
  );

  // Safety checklist state
  const [brakesChecked, setBrakesChecked] = useState(true);
  const [chainsEquipped, setChainsEquipped] = useState(true);
  const [gpsActive, setGpsActive] = useState(true);

  // Feedback banner
  const [presetNotice, setPresetNotice] = useState<string | null>(null);

  // Quick preset handler
  const applyPreset = (preset: {
    type: VehicleType;
    commodity: CommodityType;
    weight: number;
    axles: number;
    height: number;
    width: number;
    regPrefix: string;
    depot: string;
  }) => {
    setVehicleType(preset.type);
    setCommodity(preset.commodity);
    setGrossWeightTonnes(preset.weight);
    setAxleCount(preset.axles);
    setHeightMetres(preset.height);
    setWidthMetres(preset.width);
    setFleetDepot(preset.depot);
    setPresetNotice(t.customPresetApplied);
    setTimeout(() => setPresetNotice(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: DriverProfile = {
      driverName: driverName.trim() || "Fleet Driver",
      driverMobile: driverMobile.trim() || "+91 98640 12345",
      vehicleNo: vehicleNo.trim() || "AS 01 EC 4421",
      vehicleType,
      commodity,
      trustedContactName: trustedContactName.trim() || "Fleet Dispatch Base",
      trustedContactMobile: trustedContactMobile.trim() || "+91 94350 98765",
      isRegistered: true,
      grossWeightTonnes,
      axleCount,
      heightMetres,
      widthMetres,
      fleetDepot,
      brakeCheckPassed: brakesChecked,
      chainsEquipped,
    };
    onSave(updated);
  };

  return (
    <div className="min-h-[85vh] py-4 sm:py-8 space-y-6">
      {/* 2-Step Progress Header */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Step 1: Verified */}
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center text-xs font-bold">
                <Check className="size-4" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Step 1
                </div>
                <div className="text-xs font-bold text-foreground flex items-center gap-1">
                  <span>{t.step1Text}</span>
                  <span className="text-[10px] text-emerald-500 font-semibold">({t.stepVerified})</span>
                </div>
              </div>
            </div>

            <div className="hidden sm:block w-8 h-px bg-border" />

            {/* Step 2: Active */}
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-xs">
                2
              </div>
              <div>
                <div className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  Step 2 (Active)
                </div>
                <div className="text-xs font-bold text-foreground">{t.step2Text}</div>
              </div>
            </div>
          </div>

          {/* Back to Login Button */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium cursor-pointer transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>{t.backBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Title & Information Callout */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
          <Truck className="size-3.5" />
          <span>{t.badge}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">{t.title}</h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">{t.subtitle}</p>
      </div>

      {/* Quick 1-Click Archetype Presets */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">{t.quickPresetsTitle}</h2>
          </div>
          {presetNotice && (
            <span className="text-xs text-emerald-500 font-semibold animate-pulse">
              ✓ {presetNotice}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{t.quickPresetsSubtitle}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
          {/* Preset 1: Heavy Truck */}
          <button
            type="button"
            onClick={() =>
              applyPreset({
                type: "heavy",
                commodity: "construction",
                weight: 16.5,
                axles: 3,
                height: 3.8,
                width: 2.5,
                regPrefix: "AS",
                depot: "Guwahati Inland Logistics Park",
              })
            }
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all hover:border-primary/60 hover:shadow-xs ${
              vehicleType === "heavy" && commodity === "construction"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-secondary/60 text-foreground"
            }`}
          >
            <div className="font-bold text-xs flex items-center justify-between">
              <span>🚚 {t.presetHeavy}</span>
              {vehicleType === "heavy" && commodity === "construction" && (
                <CheckCircle2 className="size-3.5 text-primary" />
              )}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 leading-snug">{t.presetHeavyDesc}</div>
          </button>

          {/* Preset 2: Medical Carrier */}
          <button
            type="button"
            onClick={() =>
              applyPreset({
                type: "standard",
                commodity: "medical",
                weight: 5.2,
                axles: 2,
                height: 2.8,
                width: 2.2,
                regPrefix: "AS",
                depot: "Tezpur Forward Logistics Base",
              })
            }
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all hover:border-primary/60 hover:shadow-xs ${
              commodity === "medical"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-secondary/60 text-foreground"
            }`}
          >
            <div className="font-bold text-xs flex items-center justify-between">
              <span>💊 {t.presetMedical}</span>
              {commodity === "medical" && <CheckCircle2 className="size-3.5 text-primary" />}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 leading-snug">{t.presetMedicalDesc}</div>
          </button>

          {/* Preset 3: Fuel Tanker */}
          <button
            type="button"
            onClick={() =>
              applyPreset({
                type: "heavy",
                commodity: "fuel",
                weight: 14.2,
                axles: 3,
                height: 3.4,
                width: 2.5,
                regPrefix: "AS",
                depot: "Digboi / Numaligarh Refinery Depot",
              })
            }
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all hover:border-primary/60 hover:shadow-xs ${
              commodity === "fuel"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-secondary/60 text-foreground"
            }`}
          >
            <div className="font-bold text-xs flex items-center justify-between">
              <span>🛢️ {t.presetFuel}</span>
              {commodity === "fuel" && <CheckCircle2 className="size-3.5 text-primary" />}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 leading-snug">{t.presetFuelDesc}</div>
          </button>

          {/* Preset 4: 4x4 Bolero Pickup */}
          <button
            type="button"
            onClick={() =>
              applyPreset({
                type: "light",
                commodity: "pds",
                weight: 2.8,
                axles: 2,
                height: 2.1,
                width: 1.9,
                regPrefix: "ML",
                depot: "Shillong Mountain Transit Hub",
              })
            }
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all hover:border-primary/60 hover:shadow-xs ${
              vehicleType === "light"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-secondary/60 text-foreground"
            }`}
          >
            <div className="font-bold text-xs flex items-center justify-between">
              <span>🚙 {t.presetPickup}</span>
              {vehicleType === "light" && <CheckCircle2 className="size-3.5 text-primary" />}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 leading-snug">{t.presetPickupDesc}</div>
          </button>

          {/* Preset 5: Cold Chain Agro */}
          <button
            type="button"
            onClick={() =>
              applyPreset({
                type: "standard",
                commodity: "agro",
                weight: 9.5,
                axles: 2,
                height: 3.2,
                width: 2.4,
                regPrefix: "AS",
                depot: "Siliguri Northern Freight Gateway",
              })
            }
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all hover:border-primary/60 hover:shadow-xs ${
              commodity === "agro"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-secondary/60 text-foreground"
            }`}
          >
            <div className="font-bold text-xs flex items-center justify-between">
              <span>🥦 {t.presetAgro}</span>
              {commodity === "agro" && <CheckCircle2 className="size-3.5 text-primary" />}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 leading-snug">{t.presetAgroDesc}</div>
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Vehicle Specs & Dimensions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Box 1: Vehicle RC & Classification */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Truck className="size-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">{t.specsTitle}</h2>
              </div>

              {/* RC Number */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  {t.regLabel} <span className="text-destructive">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 px-1.5 py-0.5 rounded bg-primary/20 text-primary font-mono font-bold text-[10px] tracking-wider border border-primary/30">
                    IND
                  </span>
                  <input
                    type="text"
                    required
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
                    placeholder={t.regPlaceholder}
                    className="w-full pl-13 pr-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground font-mono font-bold text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{t.regHint}</p>
              </div>

              {/* Classification 3-pill toggle */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">
                  {t.classLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVehicleType("heavy");
                      if (grossWeightTonnes < 12) setGrossWeightTonnes(16.5);
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      vehicleType === "heavy"
                        ? "border-primary bg-primary/10 text-primary shadow-xs"
                        : "border-border bg-secondary/50 text-foreground hover:bg-secondary"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>🚚 {t.classHeavy}</span>
                      {vehicleType === "heavy" && <Check className="size-3.5 text-primary" />}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{t.classHeavyDesc}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setVehicleType("standard");
                      if (grossWeightTonnes > 12 || grossWeightTonnes < 7.5) setGrossWeightTonnes(9.5);
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      vehicleType === "standard"
                        ? "border-primary bg-primary/10 text-primary shadow-xs"
                        : "border-border bg-secondary/50 text-foreground hover:bg-secondary"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>🚛 {t.classStandard}</span>
                      {vehicleType === "standard" && <Check className="size-3.5 text-primary" />}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{t.classStandardDesc}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setVehicleType("light");
                      setGrossWeightTonnes(2.8);
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      vehicleType === "light"
                        ? "border-primary bg-primary/10 text-primary shadow-xs"
                        : "border-border bg-secondary/50 text-foreground hover:bg-secondary"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>🚙 {t.classLight}</span>
                      {vehicleType === "light" && <Check className="size-3.5 text-primary" />}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{t.classLightDesc}</div>
                  </button>
                </div>
              </div>

              {/* Gross Vehicle Weight (GVW) with Bridge Clearance Gauge */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Scale className="size-3.5 text-primary" />
                    <span>{t.gvwLabel}</span>
                  </label>
                  <span className="font-mono font-bold text-sm text-primary">
                    {grossWeightTonnes.toFixed(1)} {t.gvwUnit}
                  </span>
                </div>

                <input
                  type="range"
                  min="2.0"
                  max="32.0"
                  step="0.5"
                  value={grossWeightTonnes}
                  onChange={(e) => setGrossWeightTonnes(parseFloat(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />

                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>2.0T (Pickup)</span>
                  <span>12.0T (Bailey Class 18)</span>
                  <span>18.0T (Bailey Class 24)</span>
                  <span>32.0T (Multi-Axle)</span>
                </div>

                {/* Real-time Mountain Bridge Status Banner */}
                <div
                  className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                    grossWeightTonnes <= 12.0
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : grossWeightTonnes <= 18.0
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "border-destructive/30 bg-destructive/10 text-destructive dark:text-red-400"
                  }`}
                >
                  <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                  <span className="font-medium leading-snug">
                    {grossWeightTonnes <= 12.0
                      ? t.bridgeSafe
                      : grossWeightTonnes <= 18.0
                      ? t.bridgeCaution
                      : t.bridgeRestricted}
                  </span>
                </div>
              </div>

              {/* Axle Configuration */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  {t.axleLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { count: 2, label: t.axle2 },
                    { count: 3, label: t.axle3 },
                    { count: 4, label: t.axleMulti },
                  ].map((item) => (
                    <button
                      key={item.count}
                      type="button"
                      onClick={() => setAxleCount(item.count)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-semibold text-center cursor-pointer transition-all ${
                        axleCount === item.count
                          ? "border-primary bg-primary text-primary-foreground shadow-xs"
                          : "border-border bg-secondary/60 text-foreground hover:bg-secondary"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Box 2: Dimensional Clearances (Height / Width) */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Gauge className="size-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">{t.dimensionsTitle}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {t.heightLabel}
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      step="0.1"
                      min="1.5"
                      max="5.0"
                      value={heightMetres}
                      onChange={(e) => setHeightMetres(parseFloat(e.target.value) || 3.8)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary font-mono font-bold"
                    />
                    <span className="absolute right-3 text-xs text-muted-foreground font-semibold">
                      metres
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {t.widthLabel}
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      step="0.1"
                      min="1.5"
                      max="3.5"
                      value={widthMetres}
                      onChange={(e) => setWidthMetres(parseFloat(e.target.value) || 2.5)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary font-mono font-bold"
                    />
                    <span className="absolute right-3 text-xs text-muted-foreground font-semibold">
                      metres
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-secondary/50 p-2.5 rounded-xl border border-border">
                <Info className="size-4 text-primary shrink-0" />
                <span>{t.tunnelClearanceNotice}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Cargo Profile, Driver & Safety Checklist (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Box 3: Cargo & Commodity Manifest */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Container className="size-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">{t.cargoTitle}</h2>
              </div>
              <p className="text-xs text-muted-foreground">{t.cargoLabel}</p>

              <div className="space-y-2 pt-1">
                {[
                  {
                    id: "medical" as CommodityType,
                    icon: "💊",
                    title: t.cargoMedical,
                    desc: t.cargoMedicalDesc,
                  },
                  {
                    id: "agro" as CommodityType,
                    icon: "🥦",
                    title: t.cargoAgro,
                    desc: t.cargoAgroDesc,
                  },
                  {
                    id: "pds" as CommodityType,
                    icon: "🌾",
                    title: t.cargoPds,
                    desc: t.cargoPdsDesc,
                  },
                  {
                    id: "fuel" as CommodityType,
                    icon: "🛢️",
                    title: t.cargoFuel,
                    desc: t.cargoFuelDesc,
                  },
                  {
                    id: "construction" as CommodityType,
                    icon: "🏗️",
                    title: t.cargoConstruction,
                    desc: t.cargoConstructionDesc,
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCommodity(item.id)}
                    className={`w-full p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                      commodity === item.id
                        ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                        : "border-border bg-secondary/40 text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>{item.title}</span>
                        {commodity === item.id && <Check className="size-3.5 text-primary" />}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Box 4: Driver & Fleet Identity */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <User className="size-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">{t.driverTitle}</h2>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    {t.driverNameLabel}
                  </label>
                  <div className="relative flex items-center">
                    <User className="size-3.5 text-muted-foreground absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    {t.driverMobileLabel}
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="size-3.5 text-muted-foreground absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={driverMobile}
                      onChange={(e) => setDriverMobile(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    {t.fleetDepotLabel}
                  </label>
                  <div className="relative flex items-center">
                    <MapPin className="size-3.5 text-muted-foreground absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      value={fleetDepot}
                      onChange={(e) => setFleetDepot(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    {t.emergencyContactLabel} (Name)
                  </label>
                  <div className="relative flex items-center">
                    <User className="size-3.5 text-muted-foreground absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      value={trustedContactName}
                      onChange={(e) => setTrustedContactName(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    {t.emergencyContactLabel} (Mobile)
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="size-3.5 text-muted-foreground absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      value={trustedContactMobile}
                      onChange={(e) => setTrustedContactMobile(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Box 5: Mountain Safety Checklist */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Shield className="size-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">{t.safetyChecklistTitle}</h2>
              </div>

              <div className="space-y-2.5 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={brakesChecked}
                    onChange={(e) => setBrakesChecked(e.target.checked)}
                    className="mt-0.5 rounded text-primary focus:ring-primary"
                  />
                  <span className="text-muted-foreground leading-snug">{t.safetyBrakes}</span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chainsEquipped}
                    onChange={(e) => setChainsEquipped(e.target.checked)}
                    className="mt-0.5 rounded text-primary focus:ring-primary"
                  />
                  <span className="text-muted-foreground leading-snug">{t.safetyChains}</span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gpsActive}
                    onChange={(e) => setGpsActive(e.target.checked)}
                    className="mt-0.5 rounded text-primary focus:ring-primary"
                  />
                  <span className="text-muted-foreground leading-snug">{t.safetyGps}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Controls */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onSkip}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground font-semibold text-xs cursor-pointer transition-colors"
          >
            {t.skipBtn}
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:opacity-95 text-primary-foreground font-bold text-xs sm:text-sm shadow-md hover:shadow-lg cursor-pointer transition-all"
            >
              <span>{t.confirmBtn}</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
