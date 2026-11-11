/**
 * Authentic Adhkar Collection for SUKOON
 *
 * TODO: A qualified scholar or Arabic language reviewer should carefully verify
 * the exact wording, voweling (tashkeel), transliterations, and hadith source citations
 * before final production distribution.
 */

import { DhikrItem, DhikrCategory } from '@/types/dhikr';

export const AUTHENTIC_ADHKAR: DhikrItem[] = [
  // -------------------------------------------------------------
  // ISTIGHFAR
  // -------------------------------------------------------------
  {
    id: 'sayyid-al-istighfar',
    arabic:
      'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration:
      'Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana ‘abduka, wa ana ‘ala ‘ahdika wa wa‘dika mastata‘tu, a‘udhu bika min sharri ma sana‘tu, abu’u laka bi ni‘matika ‘alayya, wa abu’u laka bi dhanbi faghfir li, fa innahu la yaghfiru al-dhunuba illa Anta.',
    translation: {
      ar: 'سيد الاستغفار: إقرار بالربوبية والعبودية والاعتراف بالنعم والذنوب وطلب المغفرة.',
      en: 'O Allah, You are my Lord, none has the right to be worshipped but You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for none forgives sins except You.',
    },
    targetCount: 3,
    category: 'istighfar',
    source: 'Sahih al-Bukhari 6306',
  },
  {
    id: 'astaghfirullah-wa-atubu-ilayh',
    arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullah wa atubu ilayh',
    translation: {
      ar: 'أستغفر الله العظيم وأتوب إليه من كل ذنب وخطيئة.',
      en: 'I seek the forgiveness of Allah and turn to Him in repentance.',
    },
    targetCount: 100,
    category: 'istighfar',
    source: 'Sahih al-Bukhari 6307, Sahih Muslim 2702',
  },
  {
    id: 'astaghfirullah-al-azeem',
    arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ ٱلْعَظِيمَ ٱلَّذِي لَا إِلَٰهَ إِلَّا هُوَ ٱلْحَيُّ ٱلْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    transliteration:
      'Astaghfirullaha al-‘Azeem alladhi la ilaha illa Huwa al-Hayyu al-Qayyumu wa atubu ilayh',
    translation: {
      ar: 'طلب المغفرة والتوبة متوسلاً بأسماء الله الحسنى وصفاته العلى.',
      en: 'I seek forgiveness from Allah the Almighty, whom there is no deity worthy of worship except Him, the Ever-Living, the Sustainer, and I repent unto Him.',
    },
    targetCount: 33,
    category: 'istighfar',
    source: 'Sunan Abi Dawud 1517, Jami` at-Tirmidhi 3577',
  },

  // -------------------------------------------------------------
  // TASBIH
  // -------------------------------------------------------------
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ ٱللَّٰهِ',
    transliteration: 'SubhanAllah',
    translation: {
      ar: 'تنزيه الله تعالى عن كل نقص وعيب وسوء.',
      en: 'Glory be to Allah above any deficiency.',
    },
    targetCount: 33,
    category: 'tasbih',
    source: 'Sahih Muslim 597',
  },
  {
    id: 'subhanallahi-wa-bihamdihi',
    arabic: 'سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ',
    transliteration: 'SubhanAllahi wa bihamdih',
    translation: {
      ar: 'تسبيح الله وحمده، حطت خطاياه وإن كانت مثل زبد البحر.',
      en: 'Glory be to Allah and His is the praise.',
    },
    targetCount: 100,
    category: 'tasbih',
    source: 'Sahih al-Bukhari 6405, Sahih Muslim 2691',
  },
  {
    id: 'kalimatan-habibatan',
    arabic: 'سُبْحَانَ ٱللَّٰهِ وَبِحَمْدِهِ، سُبْحَانَ ٱللَّٰهِ ٱلْعَظِيمِ',
    transliteration: 'SubhanAllahi wa bihamdihi, SubhanAllahil-‘Azeem',
    translation: {
      ar: 'كلمتان خفيفتان على اللسان ثقيلتان في الميزان حبيبتان إلى الرحمن.',
      en: 'Glory be to Allah and His is the praise; Glory be to Allah the Almighty.',
    },
    targetCount: 33,
    category: 'tasbih',
    source: 'Sahih al-Bukhari 6682, Sahih Muslim 2694',
  },

  // -------------------------------------------------------------
  // HAMD
  // -------------------------------------------------------------
  {
    id: 'alhamdulillah',
    arabic: 'ٱلْحَمْدُ لِلَّٰهِ',
    transliteration: 'Alhamdulillah',
    translation: {
      ar: 'الثناء المطلق لله على جميع النعم الظاهرة والباطنة.',
      en: 'All praise and gratitude belong solely to Allah.',
    },
    targetCount: 33,
    category: 'hamd',
    source: 'Sahih Muslim 597',
  },
  {
    id: 'alhamdulillah-hamdan-katheeran',
    arabic: 'ٱلْحَمْدُ لِلَّٰهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
    transliteration: 'Alhamdulillahi hamdan katheeran tayyiban mubarakan feeh',
    translation: {
      ar: 'حمد وفير طيب ومبارك يستبق إليه الملائكة لكتابته.',
      en: 'Praise be to Allah, abundant, pure, and blessed praise.',
    },
    targetCount: 33,
    category: 'hamd',
    source: 'Sahih al-Bukhari 799',
  },
  {
    id: 'allahu-akbar',
    arabic: 'ٱللَّٰهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    translation: {
      ar: 'الله أجل وأعظم وأكبر من كل شيء في الوجود.',
      en: 'Allah is the Greatest, supreme above all creation.',
    },
    targetCount: 33,
    category: 'hamd',
    source: 'Sahih Muslim 597',
  },

  // -------------------------------------------------------------
  // SALAWAT
  // -------------------------------------------------------------
  {
    id: 'salawat-short',
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ',
    transliteration: "Allahumma salli wa sallim 'ala Nabiyyina Muhammad",
    translation: {
      ar: 'الدعاء بالصلاة والسلام على خير الأنام نبي الرحمة محمد صلى الله عليه وسلم.',
      en: 'O Allah, send blessings and peace upon our Prophet Muhammad.',
    },
    targetCount: 10,
    category: 'salawat',
    source: 'Sunan an-Nasa’i 1297, At-Tabarani',
  },
  {
    id: 'salawat-ibrahimiya',
    arabic:
      'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration:
      "Allahumma salli 'ala Muhammad wa 'ala ali Muhammad, kama sallayta 'ala Ibrahim wa 'ala ali Ibrahim, innaka Hamidun Majid. Allahumma barik 'ala Muhammad wa 'ala ali Muhammad, kama barakta 'ala Ibrahim wa 'ala ali Ibrahim, innaka Hamidun Majid.",
    translation: {
      ar: 'الصلاة الإبراهيمية المباركة الجامعة بين الصلاة والبركة على آل النبي وآل إبراهيم.',
      en: 'O Allah, bestow Your favor on Muhammad and the family of Muhammad, as You bestowed favor on Ibrahim and the family of Ibrahim. You are Praiseworthy and Glorious.',
    },
    targetCount: 10,
    category: 'salawat',
    source: 'Sahih al-Bukhari 3370, Sahih Muslim 406',
  },

  // -------------------------------------------------------------
  // MORNING ADHKAR (Suggested 04:00 - 12:00)
  // -------------------------------------------------------------
  {
    id: 'morning-asbahna',
    arabic:
      'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      'Asbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa Huwa ‘ala kulli shay’in Qadeer.',
    translation: {
      ar: 'افتتاح الصباح بالشهادة والحمد والتفويض لملكوت الله تعالى.',
      en: 'We have entered the morning and the dominion belongs to Allah, all praise is due to Allah, none has the right to be worshipped but Allah alone, without partner.',
    },
    targetCount: 1,
    category: 'morning',
    source: 'Sahih Muslim 2723',
  },
  {
    id: 'morning-bismillah-alladhi',
    arabic: 'بِسْمِ ٱللَّٰهِ ٱلَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration:
      'Bismillahilladhi la yadurru ma‘asmihi shay’un fil-ardi wa la fis-sama’i wa Huwas-Sami‘ul-‘Aleem',
    translation: {
      ar: 'حرز وحماية من كل سوء وضر بالتحصن باسم الله تعالى ثلاث مرات صباحاً ومساءً.',
      en: 'In the Name of Allah, with Whose Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.',
    },
    targetCount: 3,
    category: 'morning',
    source: 'Sunan Abi Dawud 5088, Jami` at-Tirmidhi 3388',
  },
  {
    id: 'morning-raditu-billah',
    arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    transliteration:
      'Raditu billahi Rabba, wa bil-Islami deena, wa bi-Muhammadin salla Allahu ‘alayhi wa sallama Nabiyya',
    translation: {
      ar: 'إعلان الرضا بالله رباً وبالإسلام ديناً وبمحمد نبياً، كان حقاً على الله أن يرضيه.',
      en: 'I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad (peace and blessings be upon him) as my Prophet.',
    },
    targetCount: 3,
    category: 'morning',
    source: 'Sunan Abi Dawud 5072, Jami` at-Tirmidhi 3889',
  },

  // -------------------------------------------------------------
  // EVENING ADHKAR (Suggested 16:00 - 04:00)
  // -------------------------------------------------------------
  {
    id: 'evening-amsayna',
    arabic:
      'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      'Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa Huwa ‘ala kulli shay’in Qadeer.',
    translation: {
      ar: 'استقبال المساء بالحمد والتوحيد واللجوء إلى حماية الله من شرور الليل.',
      en: 'We have reached the evening and the kingdom belongs to Allah, all praise is due to Allah, none has the right to be worshipped but Allah alone, without partner.',
    },
    targetCount: 1,
    category: 'evening',
    source: 'Sahih Muslim 2723',
  },
  {
    id: 'evening-a‘udhu-bikalimatillah',
    arabic: 'أَعُوذُ بِكَلِمَاتِ ٱللَّٰهِ ٱلتَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'A‘udhu bi kalimatillahit-tammati min sharri ma khalaq',
    translation: {
      ar: 'الاستعاذة بكلمات الله التامات من كل شر وخلق، لا يضره شيء حتى يرتحل.',
      en: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    },
    targetCount: 3,
    category: 'evening',
    source: 'Sahih Muslim 2709',
  },
  {
    id: 'evening-hasbiyallah',
    arabic: 'حَسْبِيَ ٱللَّٰهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ ٱلْعَرْشِ ٱلْعَظِيمِ',
    transliteration:
      'Hasbiyallahu la ilaha illa Huwa ‘alayhi tawakkaltu wa Huwa Rabbul-‘Arshil-‘Azeem',
    translation: {
      ar: 'كفاية الله للمؤمن في ما أهمه من أمر دنياه وآخرته عند قولها سبع مرات.',
      en: 'Allah is sufficient for me; there is no deity worthy of worship except Him; in Him I put my trust and He is Lord of the Mighty Throne.',
    },
    targetCount: 7,
    category: 'evening',
    source: 'Sunan Abi Dawud 5081',
  },
];

/**
 * Suggests the ideal Dhikr category automatically based on local time:
 * - 04:00 to 12:00 -> 'morning'
 * - 16:00 to 03:59 -> 'evening'
 * - 12:00 to 16:00 -> 'tasbih'
 */
export function getSuggestedCategory(date: Date = new Date()): DhikrCategory {
  const hours = date.getHours();
  if (hours >= 4 && hours < 12) {
    return 'morning';
  } else if (hours >= 16 || hours < 4) {
    return 'evening';
  }
  return 'tasbih';
}
