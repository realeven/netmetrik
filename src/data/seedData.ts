// ============================================================================
// NetMetrik Student App - Curated Seed Data & Domain Types
// ============================================================================

export interface SubjectItem {
  code: string;
  name: string;
  category: 'TYT' | 'AYT';
  color: string;
  defaultQuestions: number;
  topics: string[];
}

export interface ExamSubjectResult {
  subjectCode: string;
  subjectName: string;
  correct: number;
  wrong: number;
  blank: number;
  net: number;
}

export interface Exam {
  id: string;
  title: string;
  type: 'TYT' | 'AYT' | 'BRANS';
  publisher: string;
  difficulty?: 'kolay' | 'orta' | 'osym' | 'zor';
  date: string;
  totalNet: number;
  durationMinutes: number;
  subjectResults: ExamSubjectResult[];
}

export interface DailyTask {
  id: string;
  subjectCode: string;
  subjectName: string;
  topicName: string;
  targetQuestions: number;
  solvedQuestions: number;
  targetMinutes: number;
  spentMinutes: number;
  isCompleted: boolean;
  date: string;
}

export interface QuestionLog {
  id: string;
  date: string;
  subjectName: string;
  sourceBook: string;
  count: number;
  durationMinutes: number;
}

export type QuestionDifficulty = 'Kolay' | 'Orta' | 'Zor' | 'ÖSYM Seviyesi';

export interface QuestionVaultItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  topicName: string;
  imageUrl?: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
  difficulty: QuestionDifficulty;
  note: string;
  reason?: 'bilgi' | 'dikkat' | 'sure' | 'soru_koku';
  isResolved: boolean;
  date: string;
  reviewStage?: number; // 1: 1. Gün, 2: 3. Gün, 3: 7. Gün, 4: Kalıcı Hafıza
  nextReviewDate?: string;
}

export interface FlashcardItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  category: 'TYT' | 'AYT';
  title: string;
  front: string;
  back: string;
  formulaNote?: string;
  isMastered?: boolean;
}

export interface BookTrackerItem {
  id: string;
  title: string;
  publisher: string;
  subjectName: string;
  totalTests: number;
  completedTests: number;
}

export interface DepartmentBenchmark {
  id: string;
  university: string;
  department: string;
  city: string;
  type: 'Devlet' | 'Vakıf';
  track: 'sayisal' | 'esit_agirlik' | 'sozel' | 'dil';
  baseScore: number;
  lastRank: number;
  quota: number;
  tytTurkce: number;
  tytSosyal: number;
  tytMat: number;
  tytFen: number;
  tytTotal: number;
  aytMat: number;
  aytFizik: number;
  aytKimya: number;
  aytBiyo: number;
  aytEdebiyat?: number;
  aytTarih?: number;
  aytCografya?: number;
  aytDil?: number;
  aytTotal: number;
}

export interface StudentProfile {
  name: string;
  classLevel: string;
  fieldTrack: 'sayisal' | 'sozel' | 'esit_agirlik' | 'dil';
  targetTytNet: number;
  targetAytNet: number;
  targetUniversity: string;
  targetDepartment: string;
  currentStreak: number;
  longestStreak: number;
  streakFreezeActive: boolean;
  streakFreezeAvailable: number;
  obp: number;
  dailyQuestionGoal: number;
  dailyStudyMinutesGoal: number;
  darkMode: boolean;
}

export type TopicStatus = 'not_started' | 'in_progress' | 'completed' | 'needs_review';

// ----------------------------------------------------------------------------
// Curated YKS Course & Topics Catalog
// ----------------------------------------------------------------------------
export const YKS_SUBJECTS: SubjectItem[] = [
  // TYT
  {
    code: 'tyt_turkce',
    name: 'TYT Türkçe',
    category: 'TYT',
    color: '#38BDF8',
    defaultQuestions: 40,
    topics: [
      'Sözcükte Anlam',
      'Cümlede Anlam',
      'Paragrafta Anlam',
      'Ses Bilgisi',
      'Yazım Kuralları',
      'Noktalama İşaretleri',
      'Sözcük Türleri (İsim, Sıfat, Zamir)',
      'Fiiller ve Fiilimsiler',
      'Cümlenin Ögeleri',
      'Cümle Türleri',
      'Anlatım Bozuklukları'
    ]
  },
  {
    code: 'tyt_mat',
    name: 'TYT Temel Matematik',
    category: 'TYT',
    color: '#00D696',
    defaultQuestions: 30,
    topics: [
      'Temel Kavramlar & Sayı Kümeleri',
      'Basamak Kavramı',
      'Bölme ve Bölünebilme',
      'EBOB - EKOK',
      'Rasyonel ve Ondalık Sayılar',
      'Basit Eşitsizlikler',
      'Mutlak Değer',
      'Üslü İfadeler',
      'Köklü İfadeler',
      'Çarpanlara Ayırma',
      'Oran - Orantı',
      'Denklem Çözme',
      'Sayı & Kesir Problemleri',
      'Yaş Problemleri',
      'Yüzde, Kar-Zarar Problemleri',
      'Karışım Problemleri',
      'Hız & Hareket Problemleri',
      'İşçi Problemleri',
      'Kümeler ve Kartezyen Çarpım',
      'Fonksiyonlar',
      'Polinomlar',
      'Permütasyon - Kombinasyon',
      'Olasılık',
      'Veri & İstatistik'
    ]
  },
  {
    code: 'tyt_geo',
    name: 'TYT Geometri',
    category: 'TYT',
    color: '#818CF8',
    defaultQuestions: 10,
    topics: [
      'Doğruda ve Üçgende Açılar',
      'Özel Üçgenler (Dik, İkizkenar, Eşkenar)',
      'Üçgende Açıortay ve Kenarortay',
      'Üçgende Benzerlik',
      'Üçgende Alan',
      'Çokgenler ve Dörtgenler',
      'Özel Dörtgenler (Paralelkenar, Eşkenar Dörtgen, Dikdörtgen, Kare, Yamuk)',
      'Çember ve Daire',
      'Katı Cisimler (Prizma, Piramit, Koni, Küre)'
    ]
  },
  {
    code: 'tyt_fizik',
    name: 'TYT Fizik',
    category: 'TYT',
    color: '#FB7185',
    defaultQuestions: 7,
    topics: [
      'Fizik Bilimine Giriş',
      'Madde ve Özellikleri',
      'Sıvıların Kaldırma Kuvveti',
      'Basınç',
      'Isı, Sıcaklık ve Genleşme',
      'Doğrusal Hareket',
      'Dinamik (Newton Kanunları)',
      'İş, Güç ve Enerji',
      'Elektrostatik',
      'Elektrik Akımı ve Devreler',
      'Optik (Aydınlanma, Aynalar, Kırılma, Mercekler)',
      'Dalgalar (Yay, Su, Ses, Deprem)'
    ]
  },
  {
    code: 'tyt_kimya',
    name: 'TYT Kimya',
    category: 'TYT',
    color: '#FBBF24',
    defaultQuestions: 7,
    topics: [
      'Kimya Bilimi',
      'Atom ve Periyodik Sistem',
      'Kimyasal Türler Arası Etkileşimler',
      'Maddenin Halleri',
      'Doğa ve Kimya',
      'Kimyanın Temel Kanunları & Mol',
      'Kimyasal Hesaplamalar',
      'Karışımlar',
      'Asitler, Bazlar ve Tuzlar',
      'Kimya Her Yerde'
    ]
  },
  {
    code: 'tyt_biyo',
    name: 'TYT Biyoloji',
    category: 'TYT',
    color: '#34D399',
    defaultQuestions: 6,
    topics: [
      'Canlıların Ortak Özellikleri',
      'Canlıların Temel Bileşikleri',
      'Hücre ve Organeller',
      'Hücre Zarından Madde Geçişleri',
      'Canlılar Dünyası & Sınıflandırma',
      'Mitoz ve Mayoz Bölünme',
      'Kalıtım ve Çaprazlamalar',
      'Ekosistem Ekolojisi & Güncel Çevre Sorunları'
    ]
  },
  {
    code: 'tyt_sosyal',
    name: 'TYT Sosyal Bilimler',
    category: 'TYT',
    color: '#FB923C',
    defaultQuestions: 20,
    topics: [
      'Tarih: Tarih Bilimi & İlk Çağ Uygarlıkları',
      'Tarih: Türk-İslam Tarihi & Osmanlı Devleti',
      'Tarih: Kurtuluş Savaşı & Atatürk İnkılapları',
      'Coğrafya: Doğa ve İnsan & Harita Bilgisi',
      'Coğrafya: İklim Bilgisi & Türkiye İklimi',
      'Coğrafya: Yerşekilleri, Nüfus ve Yerleşme',
      'Felsefe: Felsefenin Alanı ve Bilgi Felsefesi',
      'Felsefe: Varlık ve Ahlak Felsefesi',
      'Din Kültürü: İnanç, İbadet ve Ahlak'
    ]
  },
  // AYT Sayısal
  {
    code: 'ayt_mat',
    name: 'AYT İleri Matematik',
    category: 'AYT',
    color: '#00D696',
    defaultQuestions: 30,
    topics: [
      'Polinomlar & 2. Dereceden Denklemler',
      'Karmaşık Sayılar',
      'Eşitsizlikler ve Parabol',
      'Trigonometri (I & II)',
      'Logaritma',
      'Diziler (Aritmetik & Geometrik)',
      'Limit ve Süreklilik',
      'Türev (Kurallar & Geometrik Yorum)',
      'Türevin Uygulamaları (Ekstremum)',
      'Belirsiz ve Belirli İntegral',
      'İntegral ile Alan Hesabı'
    ]
  },
  {
    code: 'ayt_fizik',
    name: 'AYT Fizik',
    category: 'AYT',
    color: '#FB7185',
    defaultQuestions: 14,
    topics: [
      'Vektörler ve Bağıl Hareket',
      'Newton’un Hareket Yasaları',
      'Bir Boyutta Sabit İvmeli Hareket',
      'İki Boyutta Hareket (Atışlar)',
      'İş, Güç, Enerji ve İtme-Momentum',
      'Tork, Denge ve Ağırlık Merkezi',
      'Basit Makineler',
      'Elektriksel Kuvvet, Alan ve Potansiyel',
      'Manyetizma ve Elektromanyetik İndüksiyon',
      'Alternatif Akım ve Transformatörler',
      'Düzgün Çembersel Hareket & Dönme Kinetik Enerjisi',
      'Basit Harmonik Hareket',
      'Dalga Mekaniği (Girişim, Kırınım, Doppler)',
      'Atom Fiziğine Giriş & Radyoaktivite',
      'Modern Fizik & Teknolojideki Uygulamaları'
    ]
  },
  {
    code: 'ayt_kimya',
    name: 'AYT Kimya',
    category: 'AYT',
    color: '#FBBF24',
    defaultQuestions: 13,
    topics: [
      'Modern Atom Teorisi & Kuantum Sayıları',
      'Gazlar ve Gaz Yasaları',
      'Sıvı Çözeltiler ve Koligatif Özellikler',
      'Kimyasal Tepkimelerde Enerji (Entalpi)',
      'Tepkime Hızları',
      'Kimyasal Denge (Kç)',
      'Sulu Çözelti Dengeleri (Asit-Baz, pH, Tampon)',
      'Çözünürlük Dengesi (Kçç)',
      'Kimya ve Elektrik (Piller, Elektroliz)',
      'Karbon Kimyasına Giriş & Hibritleşme',
      'Organik Bileşikler (Hidrokarbonlar, Fonksiyonel Gruplar)'
    ]
  },
  {
    code: 'ayt_biyo',
    name: 'AYT Biyoloji',
    category: 'AYT',
    color: '#34D399',
    defaultQuestions: 13,
    topics: [
      'Sinir Sistemi & Duyu Organları',
      'Endokrin Sistem',
      'Destek ve Hareket Sistemi',
      'Sindirim Sistemi',
      'Dolaşım ve Bağışıklık Sistemi',
      'Solunum Sistemi',
      'Boşaltım Sistemi (Üriner Sistem)',
      'Üreme Sistemi ve Embriyonik Gelişim',
      'Komünite ve Popülasyon Ekolojisi',
      'Genden Proteine (DNA Replikasyonu, Transkripsiyon, Translasyon)',
      'Canlılarda Enerji Dönüşümleri (Fotosentez, Kemosentez, Hücresel Solunum)',
      'Bitki Biyolojisi (Dokular, Organlar, Madde Taşınması, Üreme)',
      'Canlılar ve Çevre'
    ]
  }
];

// Initial Profile
export const INITIAL_PROFILE: StudentProfile = {
  name: 'Ahmet Yılmaz',
  classLevel: '12',
  fieldTrack: 'sayisal',
  targetTytNet: 95.0,
  targetAytNet: 70.0,
  targetUniversity: 'Boğaziçi Üniversitesi',
  targetDepartment: 'Bilgisayar Mühendisliği',
  currentStreak: 12,
  longestStreak: 19,
  streakFreezeActive: true,
  streakFreezeAvailable: 1,
  obp: 92.5,
  dailyQuestionGoal: 150,
  dailyStudyMinutesGoal: 210,
  darkMode: true
};

// Initial Question Vault (Hata Defteri - 6)
export const INITIAL_QUESTION_VAULT: QuestionVaultItem[] = [
  {
    id: 'qv-1',
    subjectCode: 'tyt_mat',
    subjectName: 'TYT Matematik',
    topicName: 'Hız ve Hareket Problemleri',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    correctAnswer: 'C',
    difficulty: 'Orta',
    note: 'Ters orantı kurarken akıntı hızını çıkarmayı unuttum, işlem hatası.',
    reason: 'dikkat',
    isResolved: false,
    date: '2026-10-19',
    reviewStage: 1,
    nextReviewDate: '2026-10-20'
  },
  {
    id: 'qv-2',
    subjectCode: 'ayt_fizik',
    subjectName: 'AYT Fizik',
    topicName: 'Elektriksel Potansiyel Enerji',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    correctAnswer: 'E',
    difficulty: 'Zor',
    note: 'Vektörel değil skaler olduğunu gözden kaçırdım. Formül: q1*q2 / d',
    reason: 'bilgi',
    isResolved: false,
    date: '2026-10-18',
    reviewStage: 2,
    nextReviewDate: '2026-10-20'
  },
  {
    id: 'qv-3',
    subjectCode: 'tyt_turkce',
    subjectName: 'TYT Türkçe',
    topicName: 'Paragrafta Çıkarım Yapma',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    correctAnswer: 'B',
    difficulty: 'ÖSYM Seviyesi',
    note: 'Son cümleyi aceleyle okudum, "değinilmemiştir" kökünü olumlu sandım.',
    reason: 'soru_koku',
    isResolved: true,
    date: '2026-10-17',
    reviewStage: 4,
    nextReviewDate: '2026-11-05'
  },
  {
    id: 'qv-4',
    subjectCode: 'tyt_mat',
    subjectName: 'TYT Matematik',
    topicName: 'Mutlak Değerli Eşitsizlikler',
    imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=600&q=80',
    correctAnswer: 'D',
    difficulty: 'Zor',
    note: 'Kritik noktaları tabloya aktarırken işaret tablosunda çift katlı kökü tek katlı saydım.',
    reason: 'dikkat',
    isResolved: false,
    date: '2026-10-21',
    reviewStage: 1,
    nextReviewDate: '2026-10-25'
  }
];

// Initial Book Tracker (Kaynak Kitap Takipçisi - 8)
export const INITIAL_BOOKS: BookTrackerItem[] = [
  {
    id: 'book-1',
    title: 'TYT Matematik Soru Bankası',
    publisher: '3D Yayınları',
    subjectName: 'TYT Matematik',
    totalTests: 48,
    completedTests: 32
  },
  {
    id: 'book-2',
    title: 'Kronometre Paragraf Soru Bankası',
    publisher: 'Limit Yayınları',
    subjectName: 'TYT Türkçe',
    totalTests: 36,
    completedTests: 24
  },
  {
    id: 'book-3',
    title: 'AYT Fizik Soru Kitabı',
    publisher: 'Palme Yayıncılık',
    subjectName: 'AYT Fizik',
    totalTests: 30,
    completedTests: 12
  },
  {
    id: 'book-4',
    title: 'Trigonometri Fasikülü',
    publisher: 'Apotemi',
    subjectName: 'AYT Matematik',
    totalTests: 20,
    completedTests: 15
  }
];

// YÖK Atlas Resmi Veritabanı (Bölüm Hedefleri, Taban Puan, Başarı Sırası ve Son Giren Netleri)
export const YOK_ATLAS_BENCHMARKS: DepartmentBenchmark[] = [
  // --- TIP FAKÜLTELERİ (SAY) ---
  {
    id: 'bm-koc-tip',
    university: 'Koç Üniversitesi',
    department: 'Tıp Fakültesi (Burslu)',
    city: 'İstanbul',
    type: 'Vakıf',
    track: 'sayisal',
    baseScore: 549.45,
    lastRank: 48,
    quota: 14,
    tytTurkce: 38.0,
    tytSosyal: 17.5,
    tytMat: 39.5,
    tytFen: 19.5,
    tytTotal: 114.5,
    aytMat: 39.5,
    aytFizik: 14.0,
    aytKimya: 13.0,
    aytBiyo: 13.0,
    aytTotal: 79.5
  },
  {
    id: 'bm-hacettepe-tip',
    university: 'Hacettepe Üniversitesi',
    department: 'Tıp Fakültesi (İngilizce)',
    city: 'Ankara',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 538.20,
    lastRank: 1120,
    quota: 170,
    tytTurkce: 35.5,
    tytSosyal: 15.5,
    tytMat: 37.5,
    tytFen: 18.0,
    tytTotal: 106.5,
    aytMat: 38.0,
    aytFizik: 13.0,
    aytKimya: 12.5,
    aytBiyo: 12.5,
    aytTotal: 76.0
  },
  {
    id: 'bm-cerrahpasa-tip',
    university: 'İstanbul Üniversitesi-Cerrahpaşa',
    department: 'Cerrahpaşa Tıp Fakültesi (Türkçe)',
    city: 'İstanbul',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 531.85,
    lastRank: 2140,
    quota: 310,
    tytTurkce: 34.5,
    tytSosyal: 15.0,
    tytMat: 37.0,
    tytFen: 17.5,
    tytTotal: 104.0,
    aytMat: 37.5,
    aytFizik: 12.5,
    aytKimya: 12.0,
    aytBiyo: 12.5,
    aytTotal: 74.5
  },
  {
    id: 'bm-ankara-tip',
    university: 'Ankara Üniversitesi',
    department: 'Tıp Fakültesi',
    city: 'Ankara',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 524.60,
    lastRank: 3450,
    quota: 360,
    tytTurkce: 34.0,
    tytSosyal: 14.5,
    tytMat: 36.5,
    tytFen: 17.0,
    tytTotal: 102.0,
    aytMat: 37.0,
    aytFizik: 12.0,
    aytKimya: 12.0,
    aytBiyo: 12.0,
    aytTotal: 73.0
  },
  {
    id: 'bm-ege-tip',
    university: 'Ege Üniversitesi',
    department: 'Tıp Fakültesi',
    city: 'İzmir',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 519.30,
    lastRank: 4890,
    quota: 380,
    tytTurkce: 33.5,
    tytSosyal: 14.0,
    tytMat: 36.0,
    tytFen: 16.5,
    tytTotal: 100.0,
    aytMat: 36.5,
    aytFizik: 12.0,
    aytKimya: 11.5,
    aytBiyo: 12.0,
    aytTotal: 72.0
  },
  {
    id: 'bm-dokuzeylul-tip',
    university: 'Dokuz Eylül Üniversitesi',
    department: 'Tıp Fakültesi',
    city: 'İzmir',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 512.40,
    lastRank: 7200,
    quota: 320,
    tytTurkce: 33.0,
    tytSosyal: 14.0,
    tytMat: 35.0,
    tytFen: 16.0,
    tytTotal: 98.0,
    aytMat: 35.5,
    aytFizik: 11.5,
    aytKimya: 11.5,
    aytBiyo: 11.5,
    aytTotal: 70.0
  },
  {
    id: 'bm-akdeniz-tip',
    university: 'Akdeniz Üniversitesi',
    department: 'Tıp Fakültesi',
    city: 'Antalya',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 506.75,
    lastRank: 9850,
    quota: 300,
    tytTurkce: 32.5,
    tytSosyal: 13.5,
    tytMat: 34.5,
    tytFen: 16.0,
    tytTotal: 96.5,
    aytMat: 35.0,
    aytFizik: 11.0,
    aytKimya: 11.0,
    aytBiyo: 11.5,
    aytTotal: 68.5
  },
  {
    id: 'bm-ktu-tip',
    university: 'Karadeniz Teknik Üniversitesi',
    department: 'Tıp Fakültesi',
    city: 'Trabzon',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 498.20,
    lastRank: 15400,
    quota: 250,
    tytTurkce: 32.0,
    tytSosyal: 13.0,
    tytMat: 34.0,
    tytFen: 15.0,
    tytTotal: 94.0,
    aytMat: 34.0,
    aytFizik: 10.5,
    aytKimya: 11.0,
    aytBiyo: 11.0,
    aytTotal: 66.5
  },

  // --- DİŞ HEKİMLİĞİ & ECZACILIK (SAY) ---
  {
    id: 'bm-hacettepe-dis',
    university: 'Hacettepe Üniversitesi',
    department: 'Diş Hekimliği Fakültesi',
    city: 'Ankara',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 494.60,
    lastRank: 18200,
    quota: 140,
    tytTurkce: 33.0,
    tytSosyal: 13.5,
    tytMat: 33.5,
    tytFen: 15.0,
    tytTotal: 95.0,
    aytMat: 34.0,
    aytFizik: 10.5,
    aytKimya: 10.5,
    aytBiyo: 11.0,
    aytTotal: 66.0
  },
  {
    id: 'bm-marmara-dis',
    university: 'Marmara Üniversitesi',
    department: 'Diş Hekimliği Fakültesi (İngilizce)',
    city: 'İstanbul',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 488.40,
    lastRank: 24500,
    quota: 110,
    tytTurkce: 32.0,
    tytSosyal: 13.0,
    tytMat: 33.0,
    tytFen: 14.5,
    tytTotal: 92.5,
    aytMat: 33.0,
    aytFizik: 10.0,
    aytKimya: 10.5,
    aytBiyo: 10.5,
    aytTotal: 64.0
  },
  {
    id: 'bm-ege-dis',
    university: 'Ege Üniversitesi',
    department: 'Diş Hekimliği Fakültesi',
    city: 'İzmir',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 482.10,
    lastRank: 28900,
    quota: 160,
    tytTurkce: 31.5,
    tytSosyal: 13.0,
    tytMat: 32.5,
    tytFen: 14.0,
    tytTotal: 91.0,
    aytMat: 32.5,
    aytFizik: 10.0,
    aytKimya: 10.0,
    aytBiyo: 10.5,
    aytTotal: 63.0
  },
  {
    id: 'bm-ankara-eczacilik',
    university: 'Ankara Üniversitesi',
    department: 'Eczacılık Fakültesi',
    city: 'Ankara',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 462.50,
    lastRank: 46500,
    quota: 150,
    tytTurkce: 30.5,
    tytSosyal: 12.5,
    tytMat: 30.0,
    tytFen: 13.0,
    tytTotal: 86.0,
    aytMat: 30.0,
    aytFizik: 9.0,
    aytKimya: 9.5,
    aytBiyo: 9.5,
    aytTotal: 58.0
  },

  // --- BİLGİSAYAR & YAZILIM MÜHENDİSLİĞİ (SAY) ---
  {
    id: 'bm-bogazici-ceng',
    university: 'Boğaziçi Üniversitesi',
    department: 'Bilgisayar Mühendisliği (İngilizce)',
    city: 'İstanbul',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 546.90,
    lastRank: 240,
    quota: 95,
    tytTurkce: 36.5,
    tytSosyal: 16.5,
    tytMat: 39.0,
    tytFen: 18.5,
    tytTotal: 110.5,
    aytMat: 39.5,
    aytFizik: 13.5,
    aytKimya: 12.5,
    aytBiyo: 13.0,
    aytTotal: 78.5
  },
  {
    id: 'bm-odtu-ceng',
    university: 'ODTÜ',
    department: 'Bilgisayar Mühendisliği (İngilizce)',
    city: 'Ankara',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 541.25,
    lastRank: 780,
    quota: 120,
    tytTurkce: 35.5,
    tytSosyal: 15.5,
    tytMat: 38.5,
    tytFen: 18.0,
    tytTotal: 107.5,
    aytMat: 39.0,
    aytFizik: 13.0,
    aytKimya: 12.5,
    aytBiyo: 12.5,
    aytTotal: 77.0
  },
  {
    id: 'bm-bilkent-ceng',
    university: 'Bilkent Üniversitesi',
    department: 'Bilgisayar Mühendisliği (Burslu)',
    city: 'Ankara',
    type: 'Vakıf',
    track: 'sayisal',
    baseScore: 543.10,
    lastRank: 520,
    quota: 45,
    tytTurkce: 36.0,
    tytSosyal: 16.0,
    tytMat: 38.5,
    tytFen: 18.0,
    tytTotal: 108.5,
    aytMat: 39.0,
    aytFizik: 13.5,
    aytKimya: 12.5,
    aytBiyo: 12.5,
    aytTotal: 77.5
  },
  {
    id: 'bm-itu-ceng',
    university: 'İTÜ',
    department: 'Bilgisayar Mühendisliği (İngilizce)',
    city: 'İstanbul',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 536.80,
    lastRank: 1420,
    quota: 110,
    tytTurkce: 35.0,
    tytSosyal: 15.0,
    tytMat: 38.0,
    tytFen: 17.5,
    tytTotal: 105.5,
    aytMat: 38.5,
    aytFizik: 12.5,
    aytKimya: 12.0,
    aytBiyo: 12.5,
    aytTotal: 75.5
  },
  {
    id: 'bm-itu-ai',
    university: 'İTÜ',
    department: 'Yapay Zeka ve Veri Mühendisliği',
    city: 'İstanbul',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 534.20,
    lastRank: 1850,
    quota: 60,
    tytTurkce: 34.5,
    tytSosyal: 15.0,
    tytMat: 37.5,
    tytFen: 17.5,
    tytTotal: 104.5,
    aytMat: 38.0,
    aytFizik: 12.5,
    aytKimya: 12.0,
    aytBiyo: 12.0,
    aytTotal: 74.5
  },
  {
    id: 'bm-hacettepe-ceng',
    university: 'Hacettepe Üniversitesi',
    department: 'Bilgisayar Mühendisliği (İngilizce)',
    city: 'Ankara',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 522.60,
    lastRank: 4100,
    quota: 100,
    tytTurkce: 34.0,
    tytSosyal: 14.5,
    tytMat: 37.0,
    tytFen: 17.0,
    tytTotal: 102.5,
    aytMat: 37.0,
    aytFizik: 12.0,
    aytKimya: 12.0,
    aytBiyo: 12.0,
    aytTotal: 73.0
  },
  {
    id: 'bm-ytu-ceng',
    university: 'Yıldız Teknik Üniversitesi',
    department: 'Bilgisayar Mühendisliği (İngilizce)',
    city: 'İstanbul',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 518.40,
    lastRank: 5150,
    quota: 120,
    tytTurkce: 33.5,
    tytSosyal: 14.0,
    tytMat: 36.5,
    tytFen: 17.0,
    tytTotal: 101.0,
    aytMat: 36.5,
    aytFizik: 12.0,
    aytKimya: 11.5,
    aytBiyo: 12.0,
    aytTotal: 72.0
  },
  {
    id: 'bm-marmara-ceng',
    university: 'Marmara Üniversitesi',
    department: 'Bilgisayar Mühendisliği (İngilizce)',
    city: 'İstanbul',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 508.50,
    lastRank: 8900,
    quota: 100,
    tytTurkce: 33.0,
    tytSosyal: 13.5,
    tytMat: 35.5,
    tytFen: 16.0,
    tytTotal: 98.0,
    aytMat: 35.5,
    aytFizik: 11.5,
    aytKimya: 11.0,
    aytBiyo: 11.0,
    aytTotal: 69.0
  },
  {
    id: 'bm-gtu-ceng',
    university: 'Gebze Teknik Üniversitesi',
    department: 'Bilgisayar Mühendisliği (İngilizce)',
    city: 'Kocaeli',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 499.50,
    lastRank: 14800,
    quota: 90,
    tytTurkce: 32.5,
    tytSosyal: 13.0,
    tytMat: 34.5,
    tytFen: 15.5,
    tytTotal: 95.5,
    aytMat: 34.5,
    aytFizik: 11.0,
    aytKimya: 11.0,
    aytBiyo: 10.5,
    aytTotal: 67.0
  },
  {
    id: 'bm-ege-ceng',
    university: 'Ege Üniversitesi',
    department: 'Bilgisayar Mühendisliği',
    city: 'İzmir',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 494.00,
    lastRank: 18500,
    quota: 110,
    tytTurkce: 32.0,
    tytSosyal: 13.0,
    tytMat: 33.5,
    tytFen: 15.0,
    tytTotal: 93.5,
    aytMat: 33.5,
    aytFizik: 10.5,
    aytKimya: 10.5,
    aytBiyo: 10.5,
    aytTotal: 65.0
  },
  {
    id: 'bm-gazi-ceng',
    university: 'Gazi Üniversitesi',
    department: 'Bilgisayar Mühendisliği',
    city: 'Ankara',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 488.20,
    lastRank: 23400,
    quota: 110,
    tytTurkce: 31.5,
    tytSosyal: 12.5,
    tytMat: 33.0,
    tytFen: 14.5,
    tytTotal: 91.5,
    aytMat: 33.0,
    aytFizik: 10.0,
    aytKimya: 10.5,
    aytBiyo: 10.0,
    aytTotal: 63.5
  },
  {
    id: 'bm-deu-ceng',
    university: 'Dokuz Eylül Üniversitesi',
    department: 'Bilgisayar Mühendisliği (İngilizce)',
    city: 'İzmir',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 479.50,
    lastRank: 31200,
    quota: 100,
    tytTurkce: 31.0,
    tytSosyal: 12.5,
    tytMat: 32.0,
    tytFen: 14.0,
    tytTotal: 89.5,
    aytMat: 31.5,
    aytFizik: 9.5,
    aytKimya: 10.0,
    aytBiyo: 9.5,
    aytTotal: 60.5
  },

  // --- DİĞER MÜHENDİSLİKLER (SAY) ---
  {
    id: 'bm-odtu-ee',
    university: 'ODTÜ',
    department: 'Elektrik-Elektronik Mühendisliği (İngilizce)',
    city: 'Ankara',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 539.10,
    lastRank: 1150,
    quota: 190,
    tytTurkce: 35.0,
    tytSosyal: 15.5,
    tytMat: 38.0,
    tytFen: 18.0,
    tytTotal: 106.5,
    aytMat: 39.0,
    aytFizik: 13.0,
    aytKimya: 12.5,
    aytBiyo: 12.0,
    aytTotal: 76.5
  },
  {
    id: 'bm-bogazici-endustri',
    university: 'Boğaziçi Üniversitesi',
    department: 'Endüstri Mühendisliği (İngilizce)',
    city: 'İstanbul',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 538.50,
    lastRank: 1250,
    quota: 75,
    tytTurkce: 35.5,
    tytSosyal: 15.5,
    tytMat: 38.0,
    tytFen: 17.5,
    tytTotal: 106.5,
    aytMat: 38.5,
    aytFizik: 13.0,
    aytKimya: 12.0,
    aytBiyo: 12.5,
    aytTotal: 76.0
  },
  {
    id: 'bm-odtu-aero',
    university: 'ODTÜ',
    department: 'Havacılık ve Uzay Mühendisliği',
    city: 'Ankara',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 531.00,
    lastRank: 2300,
    quota: 85,
    tytTurkce: 34.0,
    tytSosyal: 15.0,
    tytMat: 37.5,
    tytFen: 17.0,
    tytTotal: 103.5,
    aytMat: 37.5,
    aytFizik: 12.5,
    aytKimya: 12.0,
    aytBiyo: 12.0,
    aytTotal: 74.0
  },
  {
    id: 'bm-itu-makine',
    university: 'İTÜ',
    department: 'Makina Mühendisliği',
    city: 'İstanbul',
    type: 'Devlet',
    track: 'sayisal',
    baseScore: 509.20,
    lastRank: 8400,
    quota: 220,
    tytTurkce: 33.0,
    tytSosyal: 14.0,
    tytMat: 36.0,
    tytFen: 16.0,
    tytTotal: 99.0,
    aytMat: 36.0,
    aytFizik: 11.5,
    aytKimya: 11.5,
    aytBiyo: 11.0,
    aytTotal: 70.0
  },

  // --- HUKUK FAKÜLTELERİ (EA) ---
  {
    id: 'bm-gs-hukuk',
    university: 'Galatasaray Üniversitesi',
    department: 'Hukuk Fakültesi (Fransızca)',
    city: 'İstanbul',
    type: 'Devlet',
    track: 'esit_agirlik',
    baseScore: 518.50,
    lastRank: 120,
    quota: 35,
    tytTurkce: 37.0,
    tytSosyal: 17.5,
    tytMat: 35.0,
    tytFen: 12.0,
    tytTotal: 101.5,
    aytMat: 34.0,
    aytFizik: 0,
    aytKimya: 0,
    aytBiyo: 0,
    aytEdebiyat: 23.0,
    aytTarih: 8.5,
    aytCografya: 5.5,
    aytTotal: 71.0
  },
  {
    id: 'bm-ankara-hukuk',
    university: 'Ankara Üniversitesi',
    department: 'Hukuk Fakültesi',
    city: 'Ankara',
    type: 'Devlet',
    track: 'esit_agirlik',
    baseScore: 462.40,
    lastRank: 4800,
    quota: 450,
    tytTurkce: 34.5,
    tytSosyal: 15.5,
    tytMat: 31.0,
    tytFen: 7.5,
    tytTotal: 88.5,
    aytMat: 29.5,
    aytFizik: 0,
    aytKimya: 0,
    aytBiyo: 0,
    aytEdebiyat: 20.5,
    aytTarih: 7.5,
    aytCografya: 4.5,
    aytTotal: 62.0
  },
  {
    id: 'bm-istanbul-hukuk',
    university: 'İstanbul Üniversitesi',
    department: 'Hukuk Fakültesi',
    city: 'İstanbul',
    type: 'Devlet',
    track: 'esit_agirlik',
    baseScore: 454.20,
    lastRank: 7900,
    quota: 550,
    tytTurkce: 34.0,
    tytSosyal: 15.0,
    tytMat: 30.0,
    tytFen: 7.0,
    tytTotal: 86.0,
    aytMat: 28.5,
    aytFizik: 0,
    aytKimya: 0,
    aytBiyo: 0,
    aytEdebiyat: 20.0,
    aytTarih: 7.0,
    aytCografya: 4.5,
    aytTotal: 60.0
  },
  {
    id: 'bm-marmara-hukuk',
    university: 'Marmara Üniversitesi',
    department: 'Hukuk Fakültesi',
    city: 'İstanbul',
    type: 'Devlet',
    track: 'esit_agirlik',
    baseScore: 442.00,
    lastRank: 14500,
    quota: 400,
    tytTurkce: 33.5,
    tytSosyal: 14.5,
    tytMat: 29.0,
    tytFen: 6.5,
    tytTotal: 83.5,
    aytMat: 27.0,
    aytFizik: 0,
    aytKimya: 0,
    aytBiyo: 0,
    aytEdebiyat: 19.5,
    aytTarih: 6.5,
    aytCografya: 4.0,
    aytTotal: 57.0
  },
  {
    id: 'bm-deu-hukuk',
    university: 'Dokuz Eylül Üniversitesi',
    department: 'Hukuk Fakültesi',
    city: 'İzmir',
    type: 'Devlet',
    track: 'esit_agirlik',
    baseScore: 431.00,
    lastRank: 24200,
    quota: 380,
    tytTurkce: 32.5,
    tytSosyal: 14.0,
    tytMat: 27.5,
    tytFen: 6.0,
    tytTotal: 80.0,
    aytMat: 25.5,
    aytFizik: 0,
    aytKimya: 0,
    aytBiyo: 0,
    aytEdebiyat: 18.5,
    aytTarih: 6.0,
    aytCografya: 4.0,
    aytTotal: 54.0
  },

  // --- İKTİSAT, İŞLETME, YBS & PSİKOLOJİ (EA) ---
  {
    id: 'bm-bogazici-isletme',
    university: 'Boğaziçi Üniversitesi',
    department: 'İşletme (İngilizce)',
    city: 'İstanbul',
    type: 'Devlet',
    track: 'esit_agirlik',
    baseScore: 515.50,
    lastRank: 220,
    quota: 100,
    tytTurkce: 36.5,
    tytSosyal: 16.5,
    tytMat: 36.0,
    tytFen: 11.5,
    tytTotal: 100.5,
    aytMat: 35.0,
    aytFizik: 0,
    aytKimya: 0,
    aytBiyo: 0,
    aytEdebiyat: 22.0,
    aytTarih: 8.0,
    aytCografya: 5.5,
    aytTotal: 70.5
  },
  {
    id: 'bm-bogazici-iktisat',
    university: 'Boğaziçi Üniversitesi',
    department: 'İktisat (İngilizce)',
    city: 'İstanbul',
    type: 'Devlet',
    track: 'esit_agirlik',
    baseScore: 512.00,
    lastRank: 340,
    quota: 100,
    tytTurkce: 36.0,
    tytSosyal: 16.5,
    tytMat: 35.5,
    tytFen: 11.5,
    tytTotal: 99.5,
    aytMat: 34.5,
    aytFizik: 0,
    aytKimya: 0,
    aytBiyo: 0,
    aytEdebiyat: 21.5,
    aytTarih: 8.0,
    aytCografya: 5.0,
    aytTotal: 69.0
  },
  {
    id: 'bm-bogazici-ybs',
    university: 'Boğaziçi Üniversitesi',
    department: 'Yönetim Bilişim Sistemleri (İngilizce)',
    city: 'İstanbul',
    type: 'Devlet',
    track: 'esit_agirlik',
    baseScore: 504.00,
    lastRank: 780,
    quota: 65,
    tytTurkce: 35.5,
    tytSosyal: 16.0,
    tytMat: 34.5,
    tytFen: 11.0,
    tytTotal: 97.0,
    aytMat: 33.5,
    aytFizik: 0,
    aytKimya: 0,
    aytBiyo: 0,
    aytEdebiyat: 21.0,
    aytTarih: 7.5,
    aytCografya: 5.0,
    aytTotal: 67.0
  },
  {
    id: 'bm-odtu-iktisat',
    university: 'ODTÜ',
    department: 'İktisat (İngilizce)',
    city: 'Ankara',
    type: 'Devlet',
    track: 'esit_agirlik',
    baseScore: 486.50,
    lastRank: 1950,
    quota: 120,
    tytTurkce: 35.0,
    tytSosyal: 15.5,
    tytMat: 33.0,
    tytFen: 10.0,
    tytTotal: 93.5,
    aytMat: 32.0,
    aytFizik: 0,
    aytKimya: 0,
    aytBiyo: 0,
    aytEdebiyat: 20.0,
    aytTarih: 7.0,
    aytCografya: 4.5,
    aytTotal: 63.5
  },
  {
    id: 'bm-marmara-ybs',
    university: 'Marmara Üniversitesi',
    department: 'Yönetim Bilişim Sistemleri (İngilizce)',
    city: 'İstanbul',
    type: 'Devlet',
    track: 'esit_agirlik',
    baseScore: 458.00,
    lastRank: 6200,
    quota: 70,
    tytTurkce: 34.0,
    tytSosyal: 14.5,
    tytMat: 30.5,
    tytFen: 8.0,
    tytTotal: 87.0,
    aytMat: 28.5,
    aytFizik: 0,
    aytKimya: 0,
    aytBiyo: 0,
    aytEdebiyat: 19.5,
    aytTarih: 6.5,
    aytCografya: 4.0,
    aytTotal: 58.5
  },
  {
    id: 'bm-odtu-psikoloji',
    university: 'ODTÜ',
    department: 'Psikoloji (İngilizce)',
    city: 'Ankara',
    type: 'Devlet',
    track: 'esit_agirlik',
    baseScore: 478.20,
    lastRank: 2800,
    quota: 90,
    tytTurkce: 35.5,
    tytSosyal: 16.0,
    tytMat: 31.0,
    tytFen: 9.0,
    tytTotal: 91.5,
    aytMat: 29.5,
    aytFizik: 0,
    aytKimya: 0,
    aytBiyo: 0,
    aytEdebiyat: 21.0,
    aytTarih: 7.5,
    aytCografya: 4.5,
    aytTotal: 62.5
  },
  {
    id: 'bm-hacettepe-psikoloji',
    university: 'Hacettepe Üniversitesi',
    department: 'Psikoloji',
    city: 'Ankara',
    type: 'Devlet',
    track: 'esit_agirlik',
    baseScore: 452.00,
    lastRank: 8900,
    quota: 100,
    tytTurkce: 34.5,
    tytSosyal: 15.0,
    tytMat: 28.5,
    tytFen: 7.5,
    tytTotal: 85.5,
    aytMat: 27.0,
    aytFizik: 0,
    aytKimya: 0,
    aytBiyo: 0,
    aytEdebiyat: 20.0,
    aytTarih: 7.0,
    aytCografya: 4.0,
    aytTotal: 58.0
  },

  // --- SÖZEL & YABANCI DİL (SÖZ / DİL) ---
  {
    id: 'bm-bogazici-edebiyat',
    university: 'Boğaziçi Üniversitesi',
    department: 'Türk Dili ve Edebiyatı',
    city: 'İstanbul',
    type: 'Devlet',
    track: 'sozel',
    baseScore: 472.00,
    lastRank: 850,
    quota: 60,
    tytTurkce: 36.5,
    tytSosyal: 17.5,
    tytMat: 26.0,
    tytFen: 8.0,
    tytTotal: 88.0,
    aytMat: 0,
    aytFizik: 0,
    aytKimya: 0,
    aytBiyo: 0,
    aytEdebiyat: 23.0,
    aytTarih: 9.0,
    aytCografya: 5.5,
    aytTotal: 65.5
  },
  {
    id: 'bm-odtu-tarih',
    university: 'ODTÜ',
    department: 'Tarih (İngilizce)',
    city: 'Ankara',
    type: 'Devlet',
    track: 'sozel',
    baseScore: 458.50,
    lastRank: 1900,
    quota: 70,
    tytTurkce: 35.5,
    tytSosyal: 17.0,
    tytMat: 24.5,
    tytFen: 8.0,
    tytTotal: 85.0,
    aytMat: 0,
    aytFizik: 0,
    aytKimya: 0,
    aytBiyo: 0,
    aytEdebiyat: 22.0,
    aytTarih: 8.5,
    aytCografya: 5.0,
    aytTotal: 63.5
  },
  {
    id: 'bm-bogazici-elt',
    university: 'Boğaziçi Üniversitesi',
    department: 'İngilizce Öğretmenliği',
    city: 'İstanbul',
    type: 'Devlet',
    track: 'dil',
    baseScore: 495.00,
    lastRank: 1100,
    quota: 70,
    tytTurkce: 36.0,
    tytSosyal: 16.5,
    tytMat: 30.5,
    tytFen: 9.0,
    tytTotal: 92.0,
    aytMat: 0,
    aytFizik: 0,
    aytKimya: 0,
    aytBiyo: 0,
    aytDil: 78.5,
    aytTotal: 78.5
  },
  {
    id: 'bm-hacettepe-ingiliz',
    university: 'Hacettepe Üniversitesi',
    department: 'İngiliz Dili ve Edebiyatı',
    city: 'Ankara',
    type: 'Devlet',
    track: 'dil',
    baseScore: 474.00,
    lastRank: 3800,
    quota: 80,
    tytTurkce: 35.0,
    tytSosyal: 15.5,
    tytMat: 26.5,
    tytFen: 8.0,
    tytTotal: 85.0,
    aytMat: 0,
    aytFizik: 0,
    aytKimya: 0,
    aytBiyo: 0,
    aytDil: 75.5,
    aytTotal: 75.5
  }
];

// Initial Exams Seed
export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-0a',
    title: 'Bilgi Sarmal TYT Başlangıç Denemesi',
    type: 'TYT',
    publisher: 'Bilgi Sarmal',
    difficulty: 'kolay',
    date: '2026-09-24',
    totalNet: 83.0,
    durationMinutes: 165,
    subjectResults: [
      { subjectCode: 'tyt_turkce', subjectName: 'Türkçe', correct: 31, wrong: 6, blank: 3, net: 29.5 },
      { subjectCode: 'tyt_sosyal', subjectName: 'Sosyal Bilimler', correct: 14, wrong: 4, blank: 2, net: 13.0 },
      { subjectCode: 'tyt_mat', subjectName: 'Temel Matematik', correct: 27, wrong: 4, blank: 9, net: 26.0 },
      { subjectCode: 'tyt_fizik', subjectName: 'Fizik', correct: 4, wrong: 2, blank: 1, net: 3.5 },
      { subjectCode: 'tyt_kimya', subjectName: 'Kimya', correct: 6, wrong: 1, blank: 0, net: 5.75 },
      { subjectCode: 'tyt_biyo', subjectName: 'Biyoloji', correct: 6, wrong: 3, blank: 1, net: 5.25 }
    ]
  },
  {
    id: 'exam-0b',
    title: 'Hız ve Renk Kurumsal TYT-1',
    type: 'TYT',
    publisher: 'Hız ve Renk',
    difficulty: 'orta',
    date: '2026-10-03',
    totalNet: 85.5,
    durationMinutes: 160,
    subjectResults: [
      { subjectCode: 'tyt_turkce', subjectName: 'Türkçe', correct: 33, wrong: 4, blank: 3, net: 32.0 },
      { subjectCode: 'tyt_sosyal', subjectName: 'Sosyal Bilimler', correct: 15, wrong: 3, blank: 2, net: 14.25 },
      { subjectCode: 'tyt_mat', subjectName: 'Temel Matematik', correct: 28, wrong: 3, blank: 9, net: 27.25 },
      { subjectCode: 'tyt_fizik', subjectName: 'Fizik', correct: 4, wrong: 1, blank: 2, net: 3.75 },
      { subjectCode: 'tyt_kimya', subjectName: 'Kimya', correct: 5, wrong: 2, blank: 0, net: 4.5 },
      { subjectCode: 'tyt_biyo', subjectName: 'Biyoloji', correct: 4, wrong: 1, blank: 1, net: 3.75 }
    ]
  },
  {
    id: 'exam-2',
    title: '3D Yayınları TYT Simülasyon Denemesi',
    type: 'TYT',
    publisher: '3D Yayınları',
    difficulty: 'orta',
    date: '2026-10-12',
    totalNet: 87.25,
    durationMinutes: 160,
    subjectResults: [
      { subjectCode: 'tyt_turkce', subjectName: 'Türkçe', correct: 33, wrong: 5, blank: 2, net: 31.75 },
      { subjectCode: 'tyt_sosyal', subjectName: 'Sosyal Bilimler', correct: 15, wrong: 4, blank: 1, net: 14.0 },
      { subjectCode: 'tyt_mat', subjectName: 'Temel Matematik', correct: 29, wrong: 3, blank: 8, net: 28.25 },
      { subjectCode: 'tyt_fizik', subjectName: 'Fizik', correct: 4, wrong: 2, blank: 1, net: 3.5 },
      { subjectCode: 'tyt_kimya', subjectName: 'Kimya', correct: 5, wrong: 1, blank: 1, net: 4.75 },
      { subjectCode: 'tyt_biyo', subjectName: 'Biyoloji', correct: 6, wrong: 0, blank: 0, net: 5.0 }
    ]
  },
  {
    id: 'exam-1',
    title: 'Özdebir Türkiye Geneli TYT-1',
    type: 'TYT',
    publisher: 'Özdebir',
    difficulty: 'osym',
    date: '2026-10-18',
    totalNet: 91.5,
    durationMinutes: 165,
    subjectResults: [
      { subjectCode: 'tyt_turkce', subjectName: 'Türkçe', correct: 35, wrong: 4, blank: 1, net: 34.0 },
      { subjectCode: 'tyt_sosyal', subjectName: 'Sosyal Bilimler', correct: 16, wrong: 3, blank: 1, net: 15.25 },
      { subjectCode: 'tyt_mat', subjectName: 'Temel Matematik', correct: 28, wrong: 2, blank: 0, net: 27.5 },
      { subjectCode: 'tyt_fizik', subjectName: 'Fizik', correct: 5, wrong: 2, blank: 0, net: 4.5 },
      { subjectCode: 'tyt_kimya', subjectName: 'Kimya', correct: 6, wrong: 1, blank: 0, net: 5.75 },
      { subjectCode: 'tyt_biyo', subjectName: 'Biyoloji', correct: 5, wrong: 2, blank: 0, net: 4.5 }
    ]
  },
  {
    id: 'exam-0c',
    title: 'Apotemi AYT Sayısal Seviye Belirleme',
    type: 'AYT',
    publisher: 'Apotemi',
    difficulty: 'zor',
    date: '2026-10-01',
    totalNet: 58.0,
    durationMinutes: 180,
    subjectResults: [
      { subjectCode: 'ayt_mat', subjectName: 'AYT Matematik', correct: 29, wrong: 5, blank: 6, net: 27.75 },
      { subjectCode: 'ayt_fizik', subjectName: 'AYT Fizik', correct: 9, wrong: 3, blank: 2, net: 8.25 },
      { subjectCode: 'ayt_kimya', subjectName: 'AYT Kimya', correct: 10, wrong: 2, blank: 2, net: 9.5 },
      { subjectCode: 'ayt_biyo', subjectName: 'AYT Biyoloji', correct: 13, wrong: 2, blank: 0, net: 12.5 }
    ]
  },
  {
    id: 'exam-3',
    title: 'Limit Türkiye Geneli AYT Sayısal-1',
    type: 'AYT',
    publisher: 'Limit Yayınları',
    difficulty: 'zor',
    date: '2026-10-15',
    totalNet: 64.75,
    durationMinutes: 180,
    subjectResults: [
      { subjectCode: 'ayt_mat', subjectName: 'AYT Matematik', correct: 32, wrong: 3, blank: 5, net: 31.25 },
      { subjectCode: 'ayt_fizik', subjectName: 'AYT Fizik', correct: 11, wrong: 2, blank: 1, net: 10.5 },
      { subjectCode: 'ayt_kimya', subjectName: 'AYT Kimya', correct: 11, wrong: 1, blank: 1, net: 10.75 },
      { subjectCode: 'ayt_biyo', subjectName: 'AYT Biyoloji', correct: 13, wrong: 1, blank: 0, net: 12.25 }
    ]
  }
];

// Initial Tasks
export const INITIAL_TASKS: DailyTask[] = [
  {
    id: 'task-1',
    subjectCode: 'tyt_mat',
    subjectName: 'TYT Matematik',
    topicName: 'Hız & Hareket Problemleri',
    targetQuestions: 40,
    solvedQuestions: 40,
    targetMinutes: 60,
    spentMinutes: 55,
    isCompleted: true,
    date: '2026-10-20'
  },
  {
    id: 'task-2',
    subjectCode: 'ayt_fizik',
    subjectName: 'AYT Fizik',
    topicName: 'Newton\'un Hareket Yasaları Test 3-4',
    targetQuestions: 30,
    solvedQuestions: 30,
    targetMinutes: 50,
    spentMinutes: 45,
    isCompleted: true,
    date: '2026-10-20'
  },
  {
    id: 'task-3',
    subjectCode: 'tyt_turkce',
    subjectName: 'TYT Türkçe',
    topicName: 'Paragraf Çözümü (Hızlanma Denemesi)',
    targetQuestions: 35,
    solvedQuestions: 25,
    targetMinutes: 40,
    spentMinutes: 30,
    isCompleted: false,
    date: '2026-10-20'
  },
  {
    id: 'task-4',
    subjectCode: 'ayt_mat',
    subjectName: 'AYT Matematik',
    topicName: 'Trigonometri Toplam-Fark Formülleri',
    targetQuestions: 45,
    solvedQuestions: 0,
    targetMinutes: 60,
    spentMinutes: 0,
    isCompleted: false,
    date: '2026-10-20'
  }
];

// Initial Question Logs
export const INITIAL_QUESTION_LOGS: QuestionLog[] = [
  { id: 'ql-1', date: '2026-10-20', subjectName: 'TYT Matematik', sourceBook: 'Orijinal TYT Soru Bankası', count: 40, durationMinutes: 55 },
  { id: 'ql-2', date: '2026-10-20', subjectName: 'AYT Fizik', sourceBook: 'Palme AYT Fizik', count: 30, durationMinutes: 45 },
  { id: 'ql-3', date: '2026-10-20', subjectName: 'TYT Türkçe', sourceBook: 'Limit Paragraf Kronometre', count: 25, durationMinutes: 30 },
  { id: 'ql-4', date: '2026-10-19', subjectName: 'AYT Kimya', sourceBook: 'Aydın AYT Kimya', count: 50, durationMinutes: 60 },
  { id: 'ql-5', date: '2026-10-19', subjectName: 'TYT Geometri', sourceBook: 'Karakök Geometri', count: 45, durationMinutes: 50 }
];

export const MOTIVATIONAL_QUOTES = [
  "Her gün çözdüğün fazladan 1 soru, sınav günü binlerce rakibinin önüne geçmeni sağlar.",
  "Zorluklar, hedefe giden yoldaki basamaklardır. Adım atmaktan asla vazgeçme!",
  "Bugün yapacağın fedakarlıklar, yarın yaşayacağın üniversite hayatının temelidir.",
  "Büyük hedefler, küçük günlük disiplinlerin birikimiyle gerçeğe dönüşür.",
  "Hayal ettiğin kampüs kapısından içeri girdiğin ilk günü düşün ve odaklan!"
];

// Initial Flashcards (Formül & Hap Bilgi Kartları - 9)
export const INITIAL_FLASHCARDS: FlashcardItem[] = [
  {
    id: 'fc-1',
    subjectCode: 'tyt_mat',
    subjectName: 'TYT Matematik',
    category: 'TYT',
    title: 'İki Kare Farkı & Tam Kare',
    front: 'a² - b² ve (a + b)² açılımları nedir?',
    back: 'a² - b² = (a - b)(a + b)\n(a + b)² = a² + 2ab + b²',
    formulaNote: 'Püf nokta: Ortadaki 2ab teriminin işaretine dikkat et!'
  },
  {
    id: 'fc-2',
    subjectCode: 'ayt_mat',
    subjectName: 'AYT Matematik',
    category: 'AYT',
    title: 'Trigonometri Yarım Açı',
    front: 'sin(2x) ve cos(2x) yarım açı formülleri nelerdir?',
    back: 'sin(2x) = 2·sin(x)·cos(x)\ncos(2x) = cos²(x) - sin²(x) = 2cos²(x) - 1 = 1 - 2sin²(x)',
    formulaNote: 'Püf nokta: +1 veya -1 yok etmek için cos(2x) formülünü seç.'
  },
  {
    id: 'fc-3',
    subjectCode: 'ayt_fizik',
    subjectName: 'AYT Fizik',
    category: 'AYT',
    title: 'İtme ve Çizgisel Momentum',
    front: 'İtme (I) ile Momentum Değişimi (ΔP) arasındaki bağıntı nedir?',
    back: 'I = F·Δt = ΔP = m·(V_son - V_ilk)',
    formulaNote: 'Momentum vektörel bir büyüklüktür! Yönlere (+ / -) dikkat et.'
  },
  {
    id: 'fc-4',
    subjectCode: 'tyt_fizik',
    subjectName: 'TYT Fizik',
    category: 'TYT',
    title: 'Özkütle & Kaldırma Kuvveti',
    front: 'Sıvıların Kaldırma Kuvveti (F_k) formülü nedir?',
    back: 'F_k = V_batan · d_sıvı · g',
    formulaNote: 'Yüzen ve askıda kalan cisimlerde F_k = G_cisim dir.'
  },
  {
    id: 'fc-5',
    subjectCode: 'ayt_kimya',
    subjectName: 'AYT Kimya',
    category: 'AYT',
    title: 'İdeal Gaz Denklemi',
    front: 'İdeal Gaz Parametreleri ve R sabiti ilişkisi nedir?',
    back: 'P·V = n·R·T\n(P: atm, V: Litre, T: Kelvin, R: 22.4/273)',
    formulaNote: 'Sıcaklığı mutlaka Kelvin (+273) olarak almayı unutma!'
  },
  {
    id: 'fc-6',
    subjectCode: 'ayt_biyo',
    subjectName: 'AYT Biyoloji',
    category: 'AYT',
    title: 'Hücresel Solunum ATP Kazancı',
    front: 'Glikoliz, Krebs ve ETS evrelerinde net ATP kazancı nasıldır?',
    back: 'Glikoliz: 2 Net ATP\nKrebs: 2 ATP\nETS (Oksidatif): ~26-28 ATP\nToplam: ~30-32 ATP',
    formulaNote: 'Glikoliz tüm canlılarda sitoplazmada gerçekleşir.'
  }
];
