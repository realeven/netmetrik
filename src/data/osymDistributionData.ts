// ============================================================================
// ÖSYM YKS SORU DAĞILIMI VERİ TABANI (2018 - 2026)
// Kaynak: ertansinansahin.com/yks-soru-dagilimi/ (ÖSYM Çıkmış Sorular Analizi)
// ============================================================================

export interface OsymTopicItem {
  topic: string;
  unit?: string;
  yearly: Record<string, number>;
  total: number;
}

export interface OsymSubjectDistribution {
  code: string;
  name: string;
  exam: 'TYT' | 'AYT';
  color: string;
  years: string[];
  topics: OsymTopicItem[];
}

export const OSYM_QUESTION_DISTRIBUTION: OsymSubjectDistribution[] = [
  {
    "code": "tyt_turkce",
    "name": "Türkçe",
    "exam": "TYT",
    "color": "#38BDF8",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "Sözcükte Anlam",
        "unit": "",
        "yearly": {
          "2018": 3,
          "2019": 3,
          "2020": 4,
          "2021": 4,
          "2022": 4,
          "2023": 3,
          "2024": 4,
          "2025": 4,
          "2026": 5
        },
        "total": 34
      },
      {
        "topic": "Cümlede Anlam",
        "unit": "",
        "yearly": {
          "2018": 3,
          "2019": 3,
          "2020": 3,
          "2021": 3,
          "2022": 3,
          "2023": 4,
          "2024": 3,
          "2025": 3,
          "2026": 3
        },
        "total": 28
      },
      {
        "topic": "Paragrafın Yapısı",
        "unit": "",
        "yearly": {
          "2018": 4,
          "2019": 4,
          "2020": 5,
          "2021": 4,
          "2022": 6,
          "2023": 5,
          "2024": 3,
          "2025": 5,
          "2026": 2
        },
        "total": 38
      },
      {
        "topic": "Paragrafta Anlam",
        "unit": "",
        "yearly": {
          "2018": 18,
          "2019": 18,
          "2020": 21,
          "2021": 22,
          "2022": 20,
          "2023": 21,
          "2024": 23,
          "2025": 21,
          "2026": 23
        },
        "total": 187
      },
      {
        "topic": "Biçim Bilgisi",
        "unit": "",
        "yearly": {
          "2018": 2,
          "2019": 2,
          "2020": 1,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 8
      },
      {
        "topic": "Ses Bilgisi",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "Yazım Kuralları",
        "unit": "",
        "yearly": {
          "2018": 2,
          "2019": 2,
          "2020": 2,
          "2021": 2,
          "2022": 2,
          "2023": 2,
          "2024": 2,
          "2025": 2,
          "2026": 2
        },
        "total": 18
      },
      {
        "topic": "Noktalama İşaretleri",
        "unit": "",
        "yearly": {
          "2018": 2,
          "2019": 2,
          "2020": 2,
          "2021": 2,
          "2022": 2,
          "2023": 2,
          "2024": 2,
          "2025": 2,
          "2026": 2
        },
        "total": 18
      },
      {
        "topic": "İsim Soylu Sözcükler",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 3,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 7
      },
      {
        "topic": "Fiiller",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 4
      },
      {
        "topic": "Cümlenin Öğeleri",
        "unit": "",
        "yearly": {
          "2018": 3,
          "2019": 2,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 12
      },
      {
        "topic": "Cümle Türleri",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Anlatım Bozukluğu",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 40,
          "2019": 40,
          "2020": 40,
          "2021": 40,
          "2022": 40,
          "2023": 40,
          "2024": 40,
          "2025": 40,
          "2026": 40
        },
        "total": 360
      }
    ]
  },
  {
    "code": "tyt_mat",
    "name": "Temel Matematik & Geometri",
    "exam": "TYT",
    "color": "#00D696",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "Sayı Kümeleri",
        "unit": "Denklem ve Eşitsizlikler",
        "yearly": {
          "2018": 5,
          "2019": 7,
          "2020": 4,
          "2021": 5,
          "2022": 7,
          "2023": 6,
          "2024": 6,
          "2025": 6,
          "2026": 5
        },
        "total": 51
      },
      {
        "topic": "Bölünebilme Kuralları",
        "unit": "Denklem ve Eşitsizlikler",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 2,
          "2024": 2,
          "2025": 1,
          "2026": 2
        },
        "total": 11
      },
      {
        "topic": "Birinci Dereceden Denklemler ve Eşitsizlikler",
        "unit": "Denklem ve Eşitsizlikler",
        "yearly": {
          "2018": 5,
          "2019": 4,
          "2020": 3,
          "2021": 4,
          "2022": 1,
          "2023": 2,
          "2024": 2,
          "2025": 4,
          "2026": 2
        },
        "total": 27
      },
      {
        "topic": "Üslü İfadeler ve Denklemler",
        "unit": "Denklem ve Eşitsizlikler",
        "yearly": {
          "2018": 2,
          "2019": 2,
          "2020": 2,
          "2021": 2,
          "2022": 2,
          "2023": 2,
          "2024": 2,
          "2025": 2,
          "2026": 1
        },
        "total": 17
      },
      {
        "topic": "Denklemler ve Eşitsizlikler ile İlgili Uygulamalar",
        "unit": "Denklem ve Eşitsizlikler",
        "yearly": {
          "2018": 10,
          "2019": 11,
          "2020": 13,
          "2021": 11,
          "2022": 12,
          "2023": 11,
          "2024": 11,
          "2025": 10,
          "2026": 12
        },
        "total": 101
      },
      {
        "topic": "Önermeler ve Bileşik Önermeler / Niceleyiciler / Tanım, Aksiyom, Teorem ve İspat Yöntemleri",
        "unit": "Mantık",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 6
      },
      {
        "topic": "Kümelerde Temel Kavramlar/ Kümelerde İşlemler",
        "unit": "Kümeler",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Sıralama ve Seçme",
        "unit": "Sayma ve Olasılık",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Basit Olayların Olasılıkları",
        "unit": "Sayma ve Olasılık",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Fonksiyon Kavramı ve Gösterimi/İki Fonksiyonun Bileşkesi ve Bir Fonksiyonun Tersi",
        "unit": "Fonksiyonlar",
        "yearly": {
          "2018": 1,
          "2019": 2,
          "2020": 2,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 11
      },
      {
        "topic": "Polinom Kavramı ve Polinomlarda İşlemler/ Polinomların Çarpanlara Ayrılması",
        "unit": "Polinomlar",
        "yearly": {
          "2018": 2,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "İkinci Dereceden Bir Bilinmeyenli Denklemler",
        "unit": "İkinci Dereceden Denklemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Merkezi Eğilim ve Yayılım Ölçüleri/ Verilerin Grafikle Gösterilmesi",
        "unit": "Veri",
        "yearly": {
          "2018": 2,
          "2019": 2,
          "2020": 2,
          "2021": 1,
          "2022": 2,
          "2023": 2,
          "2024": 2,
          "2025": 2,
          "2026": 2
        },
        "total": 17
      },
      {
        "topic": "Üçgenlerde Temel Kavramlar",
        "unit": "Üçgenler",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 3,
          "2022": 2,
          "2023": 3,
          "2024": 1,
          "2025": 3,
          "2026": 2
        },
        "total": 17
      },
      {
        "topic": "Üçgenlerde Eşlik ve Benzerlik",
        "unit": "Üçgenler",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 2,
          "2022": 1,
          "2023": 2,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 9
      },
      {
        "topic": "Üçgenin Yardımcı Elemanları",
        "unit": "Üçgenler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Dik Üçgen ve Trigonometri",
        "unit": "Üçgenler",
        "yearly": {
          "2018": 3,
          "2019": 2,
          "2020": 1,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 10
      },
      {
        "topic": "Üçgenin Alanı/ Üçgenin Alanı ile ilgili Uygulamalar",
        "unit": "Üçgenler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 2
        },
        "total": 4
      },
      {
        "topic": "Çokgenler /Dörtgenler ve Özellikleri",
        "unit": "Dörtgenler ve Çokgenler",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 2,
          "2025": 1,
          "2026": 2
        },
        "total": 11
      },
      {
        "topic": "Özel Dörtgenler",
        "unit": "Dörtgenler ve Çokgenler",
        "yearly": {
          "2018": 2,
          "2019": 2,
          "2020": 4,
          "2021": 2,
          "2022": 2,
          "2023": 2,
          "2024": 2,
          "2025": 2,
          "2026": 2
        },
        "total": 20
      },
      {
        "topic": "Katı Cisimler",
        "unit": "Uzay Geometri",
        "yearly": {
          "2018": 2,
          "2019": 2,
          "2020": 2,
          "2021": 2,
          "2022": 2,
          "2023": 2,
          "2024": 2,
          "2025": 2,
          "2026": 2
        },
        "total": 18
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 40,
          "2019": 40,
          "2020": 40,
          "2021": 40,
          "2022": 40,
          "2023": 40,
          "2024": 40,
          "2025": 40,
          "2026": 40
        },
        "total": 360
      }
    ]
  },
  {
    "code": "tyt_fizik",
    "name": "Fizik",
    "exam": "TYT",
    "color": "#60A5FA",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "Fizik Bilimine Giriş",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Madde ve Özellikleri",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 6
      },
      {
        "topic": "Hareket ve Kuvvet",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 2,
          "2026": 1
        },
        "total": 10
      },
      {
        "topic": "Enerji",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Isı, Sıcaklık ve Genleşme",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 8
      },
      {
        "topic": "Elektrostatik",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 4
      },
      {
        "topic": "Elektrik Akımı ve Devreleri",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 5
      },
      {
        "topic": "Mıknatıslar ve Manyetizma",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Basınç",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Kaldırma Kuvveti",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 5
      },
      {
        "topic": "Dalgalara Giriş ve Yay Dalgaları",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Su, Ses ve Deprem Dalgaları",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 3
      },
      {
        "topic": "Aydınlanma ve Gölge",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Yansıma ve Düzlem Ayna",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Küresel Aynalar",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Işığın Kırılması",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Mercekler",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Prizmalar ve Renk",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 7,
          "2019": 7,
          "2020": 7,
          "2021": 7,
          "2022": 7,
          "2023": 7,
          "2024": 7,
          "2025": 7,
          "2026": 7
        },
        "total": 63
      }
    ]
  },
  {
    "code": "tyt_kimya",
    "name": "Kimya",
    "exam": "TYT",
    "color": "#F472B6",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "Kimya Disiplinleri ve Kimyacıların Çalışma Alanları",
        "unit": "Kimya Bilimi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Kimyanın Sembolik Dili",
        "unit": "Kimya Bilimi",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "Kimya Uygulamalarında İş Sağlığı ve Güvenliği",
        "unit": "Kimya Bilimi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Atom Modelleri",
        "unit": "Atom ve Periyodik Sistem",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Atomun Yapısı",
        "unit": "Atom ve Periyodik Sistem",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 3
      },
      {
        "topic": "Periyodik Sistem",
        "unit": "Atom ve Periyodik Sistem",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 6
      },
      {
        "topic": "Güçlü Etkileşimler",
        "unit": "Kimyasal Türler Arası Etkileşimler",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 2
        },
        "total": 6
      },
      {
        "topic": "Zayıf Etkileşimler",
        "unit": "Kimyasal Türler Arası Etkileşimler",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Fiziksel ve Kimyasal Değişimler",
        "unit": "Kimyasal Türler Arası Etkileşimler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Sıvılar",
        "unit": "Maddenin Hâlleri",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 7
      },
      {
        "topic": "Gazlar",
        "unit": "Maddenin Hâlleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Kimyanın Temel Kanunları",
        "unit": "Kimyanın Temel Kanunları ve Kimyasal Hesaplamalar",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Mol Kavramı",
        "unit": "Kimyanın Temel Kanunları ve Kimyasal Hesaplamalar",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Kimyasal Tepkimelerde Hesaplamalar",
        "unit": "Kimyanın Temel Kanunları ve Kimyasal Hesaplamalar",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 3
      },
      {
        "topic": "Homojen ve Heterojen Karışımlar",
        "unit": "Karışımlar",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 8
      },
      {
        "topic": "Ayırma ve Saflaştırma Teknikleri",
        "unit": "Karışımlar",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Asitler ve Bazlar",
        "unit": "Asitler, Bazlar ve Tuzlar",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Asitlerin ve Bazların Tepkimeleri",
        "unit": "Asitler, Bazlar ve Tuzlar",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 2,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 7
      },
      {
        "topic": "Yaygın Günlük Hayat Kimyasalları",
        "unit": "Kimya Her Yerde",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Hidrokarbonlar",
        "unit": "Kimya Her Yerde",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 7,
          "2019": 7,
          "2020": 7,
          "2021": 7,
          "2022": 7,
          "2023": 7,
          "2024": 7,
          "2025": 7,
          "2026": 7
        },
        "total": 63
      }
    ]
  },
  {
    "code": "tyt_biyo",
    "name": "Biyoloji",
    "exam": "TYT",
    "color": "#34D399",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "Biyoloji ve Canlıların Ortak Özellikleri",
        "unit": "Yaşam Bilimi Biyoloji",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Canlıların Yapısında Bulunan Temel Bileşikler",
        "unit": "Yaşam Bilimi Biyoloji",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 7
      },
      {
        "topic": "Hücre",
        "unit": "Hücre",
        "yearly": {
          "2018": 2,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 2
        },
        "total": 11
      },
      {
        "topic": "Canlıların Çeşitliliği ve Sınıflandırılması",
        "unit": "Canlılar Dünyası",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Canlı Âlemleri ve Özellikleri",
        "unit": "Canlılar Dünyası",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 5
      },
      {
        "topic": "Mitoz ve Eşeysiz Üreme",
        "unit": "Hücre Bölünmeleri",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 5
      },
      {
        "topic": "Mayoz ve Eşeyli Üreme",
        "unit": "Hücre Bölünmeleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 4
      },
      {
        "topic": "Kalıtım ve Biyolojik Çeşitlilik",
        "unit": "Kalıtımın Genel İlkeleri",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Ekosistem Ekolojisi",
        "unit": "Ekosistem Ekolojisi ve Güncel Çevre Sorunları",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 5
      },
      {
        "topic": "Güncel Çevre Sorunları ve İnsan",
        "unit": "Ekosistem Ekolojisi ve Güncel Çevre Sorunları",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Doğal Kaynaklar ve Biyolojik Çeşitliliğin Korunması",
        "unit": "Ekosistem Ekolojisi ve Güncel Çevre Sorunları",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Biyomlar",
        "unit": "Canlılar ve Çevre",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 6,
          "2019": 6,
          "2020": 6,
          "2021": 6,
          "2022": 6,
          "2023": 6,
          "2024": 6,
          "2025": 6,
          "2026": 6
        },
        "total": 54
      }
    ]
  },
  {
    "code": "tyt_tarih",
    "name": "Tarih",
    "exam": "TYT",
    "color": "#FB923C",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "Coğrafya ile Oluşan Yaşam Tarzı",
        "unit": "İlk ve Orta Çağlarda Türk Dünyası",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Boylardan Devlete",
        "unit": "İlk ve Orta Çağlarda Türk Dünyası",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 1,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "Kavimler Göçü",
        "unit": "İlk ve Orta Çağlarda Türk Dünyası",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Türklerin İslamiyet’i Kabulü",
        "unit": "Türklerin İslamiyet’I Kabulü ve İlk Türk İslam Devletleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "İslamiyet’in Türk Devlet ve Toplum Yapısına Etkisi",
        "unit": "Türklerin İslamiyet’I Kabulü ve İlk Türk İslam Devletleri",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 3
      },
      {
        "topic": "Büyük Selçuklu Devleti (1040-1157)",
        "unit": "Türklerin İslamiyet’I Kabulü ve İlk Türk İslam Devletleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Anadolu’nun İlk Türk Siyasi Teşekkülleri",
        "unit": "Yerleşme ve Devletleşme Sürecinde Selçuklu Türkiyesi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Devletleşme Sürecinde Osmanlı-Bizans İlişkileri",
        "unit": "Beylikten Devlete Osmanlı Siyaseti (1302-1453)",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Osmanlı Devleti’nin Rumeli’deki İskân ve İstimâlet Politikası",
        "unit": "Beylikten Devlete Osmanlı Siyaseti (1302-1453)",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Saray ve Şehir Kültürü",
        "unit": "Sultan ve Osmanlı Merkez Teşkilatı",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Tek Hanedan Anlayışı ve Gelenekler Işığında Devlet İdarecisi",
        "unit": "Sultan ve Osmanlı Merkez Teşkilatı",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Uzun Savaşlardan Diplomasiye",
        "unit": "Değişen Dünya Dengeleri Karşısında Osmanlı Siyaseti (1595-1774)",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Osmanlı Devleti’nde Demokratikleşme Hareketleri",
        "unit": "Uluslararası İlişkilerde Denge Stratejisi (1774-1914)",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Osmanlı Devleti’nde Sanayileşme Çabaları",
        "unit": "XIX ve XX. Yüzyılda Değişen Sosyoekonomik Hayat",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Millî Mücadele’ye Hazırlık Dönemi",
        "unit": "Millî Mücadele",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 6
      },
      {
        "topic": "Büyük Millet Meclisinin Açılması (23 Nisan 1920)",
        "unit": "Millî Mücadele",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Batı Cephesi ve Bu Cephede Öne Çıkan Şahsiyetler",
        "unit": "Millî Mücadele",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 2,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Millî Mücadele’nin Sona Ermesi ve Lozan Barış Antlaşması",
        "unit": "Millî Mücadele",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "Atatürk İlkeleri",
        "unit": "Atatürkçülük ve Türk İnkılabı",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Eğitim ve Kültür Alanındaki İnkılaplar",
        "unit": "Atatürkçülük ve Türk İnkılabı",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 5,
          "2019": 5,
          "2020": 5,
          "2021": 5,
          "2022": 5,
          "2023": 5,
          "2024": 5,
          "2025": 5,
          "2026": 5
        },
        "total": 45
      }
    ]
  },
  {
    "code": "tyt_cografya",
    "name": "Coğrafya",
    "exam": "TYT",
    "color": "#A78BFA",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "Doğa ve İnsan Etkileşimi",
        "unit": "Doğal Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Coğrafya Bilimi ve Bölümlenmesi",
        "unit": "Doğal Sistemler",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Dünya’nın Şekli ve Hareketleri",
        "unit": "Doğal Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Coğrafi Koordinat Sistemi",
        "unit": "Doğal Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Harita Okuryazarlığı",
        "unit": "Doğal Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Atmosfer ve İklim Bilgisi",
        "unit": "Doğal Sistemler",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 8
      },
      {
        "topic": "Dünya’nın Yapısı ve Oluşum Süreci",
        "unit": "Doğal Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 3
      },
      {
        "topic": "Su Kaynakları",
        "unit": "Doğal Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Topraklar",
        "unit": "Doğal Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Bitkiler",
        "unit": "Doğal Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Yerleşmeler",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Nüfus  ve Göç",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 1,
          "2019": 2,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Ekonomik Faaliyetler",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Bölgeler",
        "unit": "Küresel Ortam: Bölgeler ve Ülkeler",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 6
      },
      {
        "topic": "Uluslararası Ulaşım Hatları",
        "unit": "Küresel Ortam: Bölgeler ve Ülkeler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Afetler",
        "unit": "Çevre ve Toplum",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 5,
          "2019": 5,
          "2020": 5,
          "2021": 5,
          "2022": 5,
          "2023": 5,
          "2024": 5,
          "2025": 5,
          "2026": 5
        },
        "total": 45
      }
    ]
  },
  {
    "code": "tyt_felsefe",
    "name": "Felsefe",
    "exam": "TYT",
    "color": "#FBBF24",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "Felsefenin Anlamı",
        "unit": "Felsefenin Anlamı",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Felsefi Düşüncenin Ortaya Çıkışı ve Özellikleri",
        "unit": "Felsefenin Anlamı",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 2,
          "2023": 2,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 6
      },
      {
        "topic": "Felsefenin İnsan ve Toplum Hayatı Üzerindeki Rolü",
        "unit": "Felsefenin Anlamı",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 2,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "Düşünme ve Akıl Yürütmeye İlişkin Kavramlar",
        "unit": "Felsefe ile Düşünme",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Düşünme ve Dil İlişkisi",
        "unit": "Felsefe ile Düşünme",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Felsefi Bir Görüşü veya Argümanı Sorgulama",
        "unit": "Felsefe ile Düşünme",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 1
      },
      {
        "topic": "Varlık Felsefesinin Konusu ve Problemleri",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Evrende Amaçlılık ve Düzenlilik-Varlık Türlerinin Sınıflandırılması-Bir Konunun Varlık Felsefesi Açısından Değerlendirilmesi",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Varlık Felsefesi Alanındaki Çağdaş Yaklaşımlar",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Bilgi Felsefesinin Konusu ve Bilginin İmkânı Problemi",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Bilginin Kaynağı ile İlgili Görüşler",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 2,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 6
      },
      {
        "topic": "Bilginin Sınırları, Ölçütü- Doğruluk ve Gerçeklik Bilginin Değeri ve Güvenirliği",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 2,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Bilimin Değeri-Bilim Felsefe İlişkisi-Bilim ve Hayat İlişkisi",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Ahlak Felsefesinin Konusu ve Temel Kavramları",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Ahlak Felsefesinde Özgürlük ve Sorumluluk",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 4
      },
      {
        "topic": "Evrensel Ahlak Yasasını Reddeden Görüşler ve Filozoflar",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Ahlak Felsefesinde İyilik ve Mutluluk İlişkisi",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Din Felsefesinin Konusu ve Soruları",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Siyaset Felsefesinin Konusu ve Problemleri",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Sanat Felsefesinin Konusu ve Problemleri",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "İlk Medeniyetlerin Felsefenin Doğuşuna Etkisi Anadolu’da Yaşamış Filozoflar",
        "unit": "İlk Neden (Arkhe) ve Değişim Problemi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 1
      },
      {
        "topic": "İlk Neden (Arkhe) ve Değişim Problemi",
        "unit": "İlk Neden (Arkhe) ve Değişim Problemi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Sofistler ile Sokrates’in Bilgi ve Değer Anlayışları",
        "unit": "İlk Neden (Arkhe) ve Değişim Problemi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Platon ve Aristoteles’in Varlık, Bilgi ve Değer Anlayışı",
        "unit": "İlk Neden (Arkhe) ve Değişim Problemi",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 2,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 6
      },
      {
        "topic": "MS 2.Yüzyıl-MS 15.Yüzyıl Felsefesinin Ortaya Çıkışı",
        "unit": "Ms 2.Yüzyıl-Ms 15.Yüzyıl Felsefesinin Ortaya Çıkışı",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 5
      },
      {
        "topic": "İslam Felsefesinin Özellikleri, İnanç Akıl İlişkisi ve Filozofların Görüşleri",
        "unit": "Ms 2.Yüzyıl-Ms 15.Yüzyıl Felsefesinin Ortaya Çıkışı",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 6
      },
      {
        "topic": "15-17. Yüzyıl Felsefesinde Öne Çıkan Görüşler",
        "unit": "15 - 17. Yüzyıl Felsefesinde Öne Çıkan Görüşler",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 7
      },
      {
        "topic": "18-19. Yüzyıl Felsefesinde Öne Çıkan Problemler ve Görüşler",
        "unit": "18-19. Yüzyıl Felsefesinde Öne Çıkan Problemler ve Görüşler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 2,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 8
      },
      {
        "topic": "20. Yüzyıl Felsefesinde Bazı Ana Akımlar",
        "unit": "20. Yüzyıl Felsefesinde Bazı Ana Akımlar",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 5
      },
      {
        "topic": "20. Yüzyıl Filozoflarının Görüşleri",
        "unit": "20. Yüzyıl Felsefesinde Bazı Ana Akımlar",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 3
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 10,
          "2019": 10,
          "2020": 10,
          "2021": 10,
          "2022": 10,
          "2023": 10,
          "2024": 10,
          "2025": 10,
          "2026": 10
        },
        "total": 90
      }
    ]
  },
  {
    "code": "tyt_din",
    "name": "Din Kültürü",
    "exam": "TYT",
    "color": "#EC4899",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "İslam’da Bilgi Kaynakları",
        "unit": "Bilgi ve İnanç",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 2,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 6
      },
      {
        "topic": "İslam İnancında İmanın Mahiyeti",
        "unit": "Bilgi ve İnanç",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "İnsan Doğası ve Din",
        "unit": "Din ve İslam",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "İslam İnanç Esaslarının Özellikleri",
        "unit": "Din ve İslam",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "İslam’da İbadet ve Kapsamı",
        "unit": "İslam ve İbadet",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "İslam’da İbadetin Amacı ve Önemi",
        "unit": "İslam ve İbadet",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Temel Değerler",
        "unit": "Gençlik ve Değerler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "İslam Medeniyetinin Farklı Coğrafyalardaki İzleri",
        "unit": "Gönül Coğrafyamız",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Allah’ın Varlığı ve Birliği",
        "unit": "Allah İnsan İlişkisi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Allah’ın İsim ve Sıfatları",
        "unit": "Allah İnsan İlişkisi",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "İnsanın Allah ile İrtibatı",
        "unit": "Allah İnsan İlişkisi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Kur’an’dan Mesajlar: Rum Suresi 18-27. Ayetler",
        "unit": "Allah İnsan İlişkisi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Bir Genç Olarak Hz. Muhammed",
        "unit": "Hz. Muhammed ve Gençlik",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 3
      },
      {
        "topic": "Hz. Muhammed ve Gençler",
        "unit": "Hz. Muhammed ve Gençlik",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Din ve Sosyal Değişim",
        "unit": "Din ve Hayat",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Din ve Sosyal Adalet",
        "unit": "Din ve Hayat",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "İslam Ahlakının Konusu ve Gayesi",
        "unit": "Ahlaki Tutum ve Davranışlar",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "İslam Ahlakında Yerilen Bazı Davranışlar",
        "unit": "Ahlaki Tutum ve Davranışlar",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Kur’an’dan Mesajlar: Hucurat Suresi 11-12. Ayetler",
        "unit": "Ahlaki Tutum ve Davranışlar",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Dinî Yorum Farklılıklarının Sebepleri",
        "unit": "İslam Düşüncesinde İtikadi, Siyasi ve Fıkhi Yorumlar",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Varoluşun ve Hayatın Anlamı",
        "unit": "Dünya ve Ahiret",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Hz. Muhammed’in Şahsiyeti",
        "unit": "Kur’An’A Göre Hz. Muhammed",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Hz. Muhammed’in Peygamberlik Yönü",
        "unit": "Kur’An’A Göre Hz. Muhammed",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Dinî Meselelerin Çözümünde Temel İlke ve Yöntemler",
        "unit": "Güncel Dinî Meseleler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Milletimizin İslam Anlayışının Oluşmasında Etkili Olan Bazı Şahsiyetler",
        "unit": "Anadolu’da İslam",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Kültürümüzde Etkin Olan Tasavvufi Yorumlar",
        "unit": "İslam Düşüncesinde Tasavvufi Yorumlar",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 5,
          "2019": 5,
          "2020": 5,
          "2021": 5,
          "2022": 5,
          "2023": 5,
          "2024": 5,
          "2025": 5,
          "2026": 5
        },
        "total": 45
      }
    ]
  },
  {
    "code": "ayt_mat",
    "name": "AYT Matematik & Geometri",
    "exam": "AYT",
    "color": "#00D696",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "Temel Kavramlar",
        "unit": "Denklem ve Eşitsizlikler",
        "yearly": {
          "2018": 3,
          "2019": 5,
          "2020": 7,
          "2021": 3,
          "2022": 4,
          "2023": 6,
          "2024": 3,
          "2025": 6,
          "2026": 5
        },
        "total": 42
      },
      {
        "topic": "Önermeler ve Bileşik Önermeler, Niceleyiciler, Tanım, Aksiyom, Teorem ve İspat Yöntemleri",
        "unit": "Mantık",
        "yearly": {
          "2018": 2,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Kümelerde Temel Kavramlar, Kümelerde İşlemler",
        "unit": "Kümeler",
        "yearly": {
          "2018": 0,
          "2019": 2,
          "2020": 2,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 10
      },
      {
        "topic": "Fonksiyon Kavramı ve Gösterimi, İki Fonksiyonun Bileşkesi ve Bir Fonksiyonun Tersi",
        "unit": "Fonksiyonlar",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 2,
          "2021": 0,
          "2022": 1,
          "2023": 2,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Fonksiyonlar ile İlgili Uygulamalar, Fonksiyon Dönüşümleri",
        "unit": "Fonksiyonlarda Uygulamalar",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 2,
          "2022": 1,
          "2023": 0,
          "2024": 3,
          "2025": 1,
          "2026": 1
        },
        "total": 8
      },
      {
        "topic": "İkinci Dereceden Fonksiyon ve Grafikleri",
        "unit": "Fonksiyonlarda Uygulamalar",
        "yearly": {
          "2018": 1,
          "2019": 2,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 7
      },
      {
        "topic": "Polinom Kavramı ve Polinomlarda İşlemler, Polinomların Çapanlara Ayrılması",
        "unit": "Polinomlar",
        "yearly": {
          "2018": 1,
          "2019": 2,
          "2020": 2,
          "2021": 1,
          "2022": 1,
          "2023": 3,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 12
      },
      {
        "topic": "İkinci Dereceden Denklemler, Karmaşık Sayılar, Denklem ve Eşitsizlik Sistemleri",
        "unit": "İkinci Dereceden Denklemler/ Denklem ve Eşitsizlik Sistemleri",
        "yearly": {
          "2018": 3,
          "2019": 1,
          "2020": 3,
          "2021": 3,
          "2022": 2,
          "2023": 3,
          "2024": 3,
          "2025": 1,
          "2026": 1
        },
        "total": 20
      },
      {
        "topic": "Permütasyon, Kombinasyon",
        "unit": "Sayma ve Olasılık",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Binom",
        "unit": "Sayma ve Olasılık",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 7
      },
      {
        "topic": "Olasılık",
        "unit": "Sayma ve Olasılık",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Yönlü Açılar, Trigonometrik Fonksiyonlar",
        "unit": "Trigonometri",
        "yearly": {
          "2018": 1,
          "2019": 3,
          "2020": 3,
          "2021": 1,
          "2022": 2,
          "2023": 1,
          "2024": 2,
          "2025": 2,
          "2026": 1
        },
        "total": 16
      },
      {
        "topic": "Kosinüs Teoremi, Sinüs Teoremi, Ters Trigonometrik Fonksiyonlar",
        "unit": "Trigonometri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 3
      },
      {
        "topic": "Toplam-Fark ve İki Kat Açı Formülleri",
        "unit": "Trigonometri",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 2,
          "2022": 2,
          "2023": 3,
          "2024": 1,
          "2025": 2,
          "2026": 2
        },
        "total": 14
      },
      {
        "topic": "Trigonometrik Denklemler",
        "unit": "Trigonometri",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 2,
          "2025": 0,
          "2026": 1
        },
        "total": 6
      },
      {
        "topic": "Üstel Fonksiyon, Logaritma Fonksiyonu",
        "unit": "Üstel ve Logaritmik Fonksiyonlar",
        "yearly": {
          "2018": 2,
          "2019": 3,
          "2020": 4,
          "2021": 1,
          "2022": 2,
          "2023": 4,
          "2024": 1,
          "2025": 2,
          "2026": 2
        },
        "total": 21
      },
      {
        "topic": "Gerçek Sayı Dizileri",
        "unit": "Diziler",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 2,
          "2021": 1,
          "2022": 1,
          "2023": 2,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 11
      },
      {
        "topic": "Limit ve Süreklilik",
        "unit": "Türev",
        "yearly": {
          "2018": 2,
          "2019": 2,
          "2020": 0,
          "2021": 2,
          "2022": 2,
          "2023": 0,
          "2024": 2,
          "2025": 2,
          "2026": 2
        },
        "total": 14
      },
      {
        "topic": "Anlık Değişim Oranı ve Türev, Türevin Uygulamaları",
        "unit": "Türev",
        "yearly": {
          "2018": 4,
          "2019": 4,
          "2020": 0,
          "2021": 4,
          "2022": 4,
          "2023": 0,
          "2024": 3,
          "2025": 3,
          "2026": 2
        },
        "total": 24
      },
      {
        "topic": "Belirsiz İntegral, Belirli İntegral ve Uygulamaları",
        "unit": "İntegral",
        "yearly": {
          "2018": 4,
          "2019": 4,
          "2020": 0,
          "2021": 4,
          "2022": 4,
          "2023": 0,
          "2024": 4,
          "2025": 3,
          "2026": 3
        },
        "total": 26
      },
      {
        "topic": "Üçgen, Çokgen, Dörtgen, Özel Dörtgenler",
        "unit": "Geometri",
        "yearly": {
          "2018": 2,
          "2019": 2,
          "2020": 4,
          "2021": 0,
          "2022": 1,
          "2023": 3,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 15
      },
      {
        "topic": "Çember ve Daire",
        "unit": "Geometri",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 2,
          "2021": 3,
          "2022": 2,
          "2023": 2,
          "2024": 2,
          "2025": 2,
          "2026": 2
        },
        "total": 16
      },
      {
        "topic": "Doğrunun Analitik İncelenmesi",
        "unit": "Analitik Geometri",
        "yearly": {
          "2018": 2,
          "2019": 1,
          "2020": 2,
          "2021": 3,
          "2022": 2,
          "2023": 2,
          "2024": 3,
          "2025": 2,
          "2026": 3
        },
        "total": 20
      },
      {
        "topic": "Çemberin Analitik İncelenmesi",
        "unit": "Analitik Geometri",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 2,
          "2026": 1
        },
        "total": 8
      },
      {
        "topic": "Dönüşümler",
        "unit": "Geometri",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Katı Cisimler",
        "unit": "Uzay Geometri",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 2,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 10
      },
      {
        "topic": "Konikler",
        "unit": "Analitik Geometri",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Vektörler",
        "unit": "Analitik Geometri",
        "yearly": {
          "2018": 2,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Uzayda Analitik Geometri",
        "unit": "Analitik Geometri",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 40,
          "2019": 40,
          "2020": 40,
          "2021": 40,
          "2022": 40,
          "2023": 40,
          "2024": 40,
          "2025": 40,
          "2026": 39
        },
        "total": 359
      }
    ]
  },
  {
    "code": "ayt_fizik",
    "name": "AYT Fizik",
    "exam": "AYT",
    "color": "#60A5FA",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "Vektörler",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Bağıl Hareket",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Newton’un Hareket Yasaları",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 1,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "Bir Boyutta Sabit İvmeli Hareket",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 5
      },
      {
        "topic": "Atışlar",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 5
      },
      {
        "topic": "İş, Güç ve Enerji",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 4
      },
      {
        "topic": "İtme ve Momentum",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 7
      },
      {
        "topic": "Kuvvet, Tork ve Denge",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 2
        },
        "total": 7
      },
      {
        "topic": "Kütle ve Ağırlık Merkezi",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Basit Makineler",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Elektrik Alan ve Potansiyel",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 2,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 7
      },
      {
        "topic": "Paralel Levhalar ve Sığa",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Manyetik Alan ve Manyetik Kuvvet",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 5
      },
      {
        "topic": "Elektromanyetik İndüksiyon",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 5
      },
      {
        "topic": "Alternatif Akım ve Transformatörler",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Çembersel Hareket",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 2,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 8
      },
      {
        "topic": "Dönme, Yuvarlanma ve Açısal Momentum",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 4
      },
      {
        "topic": "Kütle Çekim ve Kepler Yasaları",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 2,
          "2026": 0
        },
        "total": 7
      },
      {
        "topic": "Basit Harmonik Hareket",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 2,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 10
      },
      {
        "topic": "Dalga Mekaniği ve Elektromanyetik Dalgalar",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 2,
          "2026": 1
        },
        "total": 10
      },
      {
        "topic": "Atom Modelleri",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 1
      },
      {
        "topic": "Büyük Patlama ve Parçacık Fiziği",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Radyoaktivite",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "Özel Görelilik",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Kara Cisim Işıması",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Fotoelektrik Olay",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 6
      },
      {
        "topic": "Compton Saçılması ve de Broglie Dalga Boyu",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Modern Fiziğin Teknolojideki Uygulamaları",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 7
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 14,
          "2019": 14,
          "2020": 14,
          "2021": 14,
          "2022": 14,
          "2023": 14,
          "2024": 14,
          "2025": 14,
          "2026": 14
        },
        "total": 126
      }
    ]
  },
  {
    "code": "ayt_kimya",
    "name": "AYT Kimya",
    "exam": "AYT",
    "color": "#F472B6",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "Atomun Kuantum Modeli",
        "unit": "Modern Atom Teorisi",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 2,
          "2021": 0,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 8
      },
      {
        "topic": "Periyodik Özellikler",
        "unit": "Modern Atom Teorisi",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Yükseltgenme Basamakları",
        "unit": "Modern Atom Teorisi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Gazların Özellikleri ve Gaz Yasaları",
        "unit": "Gazlar",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "İdeal Gaz Yasası",
        "unit": "Gazlar",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 3
      },
      {
        "topic": "Gazlarda Kinetik Teori",
        "unit": "Gazlar",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 5
      },
      {
        "topic": "Gaz Karışımları",
        "unit": "Gazlar",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Derişim Birimleri",
        "unit": "Sıvı Çözeltiler ve Çözünürlük",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 2,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Koligatif Özellikler",
        "unit": "Sıvı Çözeltiler ve Çözünürlük",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "Çözünürlük",
        "unit": "Sıvı Çözeltiler ve Çözünürlük",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Tepkimelerde Isı Değişimi",
        "unit": "Kimyasal Tepkimelerde Enerji",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Oluşum Entalpisi",
        "unit": "Kimyasal Tepkimelerde Enerji",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 3
      },
      {
        "topic": "Tepkime Isılarının Toplanabilirliği",
        "unit": "Kimyasal Tepkimelerde Enerji",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "Tepkime Hızları",
        "unit": "Kimyasal Tepkimelerde Hız",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 5
      },
      {
        "topic": "Tepkime Hızını Etkileyen Faktörler",
        "unit": "Kimyasal Tepkimelerde Hız",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "Kimyasal Denge",
        "unit": "Kimyasal Tepkimelerde Denge",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 3
      },
      {
        "topic": "Dengeyi Etkileyen Faktörler",
        "unit": "Kimyasal Tepkimelerde Denge",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "Sulu Çözelti Dengeleri",
        "unit": "Kimyasal Tepkimelerde Denge",
        "yearly": {
          "2018": 1,
          "2019": 2,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 10
      },
      {
        "topic": "İndirgenme - Yükseltgenme Tepkimelerinde Elektrik Akımı",
        "unit": "Kimya ve Elektrik",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Elektrotlar ve Elektrokimyasal Hücreler",
        "unit": "Kimya ve Elektrik",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 5
      },
      {
        "topic": "Elektrot Potansiyelleri",
        "unit": "Kimya ve Elektrik",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 1,
          "2023": 2,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 7
      },
      {
        "topic": "Elektroliz",
        "unit": "Kimya ve Elektrik",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 5
      },
      {
        "topic": "Korozyon",
        "unit": "Kimya ve Elektrik",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Basit Formül ve Molekül Formülü",
        "unit": "Karbon Kimyasına Giriş",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Doğada Karbon",
        "unit": "Karbon Kimyasına Giriş",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 3
      },
      {
        "topic": "Hibritleşme - Molekül Geometrisi",
        "unit": "Karbon Kimyasına Giriş",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 2,
          "2026": 1
        },
        "total": 6
      },
      {
        "topic": "Hidrokarbonlar",
        "unit": "Organik Bileşikler",
        "yearly": {
          "2018": 1,
          "2019": 2,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 7
      },
      {
        "topic": "Fonksiyonel Gruplar",
        "unit": "Organik Bileşikler",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Alkoller - Eterler",
        "unit": "Organik Bileşikler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Karbonil Bileşikleri",
        "unit": "Organik Bileşikler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Karboksilik Asitler",
        "unit": "Organik Bileşikler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Esterler",
        "unit": "Organik Bileşikler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Optik İzomerlik",
        "unit": "Organik Bileşikler",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Amino Asitler ve Proteinler",
        "unit": "Organik Bileşikler",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 13,
          "2019": 13,
          "2020": 13,
          "2021": 13,
          "2022": 13,
          "2023": 13,
          "2024": 13,
          "2025": 13,
          "2026": 13
        },
        "total": 117
      }
    ]
  },
  {
    "code": "ayt_biyo",
    "name": "AYT Biyoloji",
    "exam": "AYT",
    "color": "#34D399",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "Denetleyici ve Düzenleyici Sistem, Duyu Organları",
        "unit": "İnsan Fizyolojisi",
        "yearly": {
          "2018": 2,
          "2019": 1,
          "2020": 2,
          "2021": 1,
          "2022": 1,
          "2023": 3,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 13
      },
      {
        "topic": "Destek ve Hareket Sistemi",
        "unit": "İnsan Fizyolojisi",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 4
      },
      {
        "topic": "Sindirim Sistemi",
        "unit": "İnsan Fizyolojisi",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 5
      },
      {
        "topic": "Dolaşım Sistemleri",
        "unit": "İnsan Fizyolojisi",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Solunum Sistemi",
        "unit": "İnsan Fizyolojisi",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 6
      },
      {
        "topic": "Üriner Sistem",
        "unit": "İnsan Fizyolojisi",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 6
      },
      {
        "topic": "Üreme Sistemi ve Embriyonik Gelişim",
        "unit": "İnsan Fizyolojisi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 3
      },
      {
        "topic": "Komünite Ekolojisi",
        "unit": "Komünite ve Popülasyon Ekolojisi",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 8
      },
      {
        "topic": "Popülasyon Ekolojisi",
        "unit": "Komünite ve Popülasyon Ekolojisi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 6
      },
      {
        "topic": "Nükleik Asitlerin Keşfi ve Önemi",
        "unit": "Genden Proteine",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Genetik Şifre ve Protein Sentezi",
        "unit": "Genden Proteine",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 2,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 10
      },
      {
        "topic": "Canlılık ve Enerji",
        "unit": "Canlılarda Enerji Dönüşümleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Fotosentez",
        "unit": "Canlılarda Enerji Dönüşümleri",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 7
      },
      {
        "topic": "Kemosentez",
        "unit": "Canlılarda Enerji Dönüşümleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Hücresel Solunum",
        "unit": "Canlılarda Enerji Dönüşümleri",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Bitkilerin Yapısı",
        "unit": "Bitki Biyolojisi",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 5
      },
      {
        "topic": "Bitkilerde Madde Taşınması",
        "unit": "Bitki Biyolojisi",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 6
      },
      {
        "topic": "Bitkilerde Eşeyli Üreme",
        "unit": "Bitki Biyolojisi",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "Canlılar ve Çevre",
        "unit": "Canlılar ve Çevre",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "Popülasyon Genetiği ve Hardy-Weinberg Yasası",
        "unit": "Komünite ve Popülasyon Ekolojisi",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 13,
          "2019": 13,
          "2020": 13,
          "2021": 13,
          "2022": 13,
          "2023": 13,
          "2024": 13,
          "2025": 13,
          "2026": 13
        },
        "total": 117
      }
    ]
  },
  {
    "code": "ayt_edebiyat",
    "name": "Türk Dili ve Edebiyatı",
    "exam": "AYT",
    "color": "#38BDF8",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "Sözcükte Anlam",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Cümlede Anlam",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Paragrafta Anlam",
        "unit": "",
        "yearly": {
          "2018": 2,
          "2019": 1,
          "2020": 4,
          "2021": 4,
          "2022": 4,
          "2023": 4,
          "2024": 4,
          "2025": 4,
          "2026": 4
        },
        "total": 31
      },
      {
        "topic": "Şiir Bilgisi",
        "unit": "",
        "yearly": {
          "2018": 2,
          "2019": 3,
          "2020": 2,
          "2021": 2,
          "2022": 2,
          "2023": 2,
          "2024": 1,
          "2025": 3,
          "2026": 2
        },
        "total": 19
      },
      {
        "topic": "Söz Sanatları",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 2,
          "2023": 2,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 11
      },
      {
        "topic": "Nesir Bilgisi",
        "unit": "",
        "yearly": {
          "2018": 2,
          "2019": 3,
          "2020": 1,
          "2021": 2,
          "2022": 1,
          "2023": 2,
          "2024": 1,
          "2025": 2,
          "2026": 2
        },
        "total": 16
      },
      {
        "topic": "İslamiyet Öncesi Türk Edebiyatı / Geçiş Dönemi Türk Edebiyatı",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 5
      },
      {
        "topic": "Halk Edebiyatı",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 2,
          "2024": 2,
          "2025": 0,
          "2026": 0
        },
        "total": 6
      },
      {
        "topic": "Divan Edebiyatı",
        "unit": "",
        "yearly": {
          "2018": 4,
          "2019": 2,
          "2020": 5,
          "2021": 4,
          "2022": 4,
          "2023": 3,
          "2024": 4,
          "2025": 3,
          "2026": 4
        },
        "total": 33
      },
      {
        "topic": "Tanzimat Dönemi Türk Edebiyatı",
        "unit": "",
        "yearly": {
          "2018": 2,
          "2019": 2,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 11
      },
      {
        "topic": "Servetifünun Dönemi Türk Edebiyatı/ Fecriâti Dönemi Türk Edebiyatı",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 1,
          "2023": 2,
          "2024": 2,
          "2025": 1,
          "2026": 1
        },
        "total": 10
      },
      {
        "topic": "Millî Edebiyat Dönemi Türk Edebiyatı",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 5
      },
      {
        "topic": "Cumhuriyet Dönemi Türk Edebiyatı",
        "unit": "",
        "yearly": {
          "2018": 5,
          "2019": 5,
          "2020": 2,
          "2021": 3,
          "2022": 3,
          "2023": 2,
          "2024": 3,
          "2025": 2,
          "2026": 2
        },
        "total": 27
      },
      {
        "topic": "Geleneksel Türk Tiyatrosu",
        "unit": "",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "Masal/Fabl/Destan/Halk Hikâyesi",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 2,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 1,
          "2026": 2
        },
        "total": 10
      },
      {
        "topic": "Edebî Akımlar",
        "unit": "",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 24,
          "2019": 24,
          "2020": 24,
          "2021": 24,
          "2022": 24,
          "2023": 24,
          "2024": 24,
          "2025": 24,
          "2026": 23
        },
        "total": 215
      }
    ]
  },
  {
    "code": "ayt_tarih1",
    "name": "Tarih-1",
    "exam": "AYT",
    "color": "#FB923C",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "İnsanlığın Hafızası Tarih",
        "unit": "Tarih ve Zaman",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "İlk Çağ’da Başlıca Medeniyet Havzaları",
        "unit": "İnsanlığın İlk Dönemleri",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 7
      },
      {
        "topic": "Kanunlar Doğuyor",
        "unit": "İnsanlığın İlk Dönemleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Coğrafya ile Oluşan Yaşam Tarzı",
        "unit": "İlk ve Orta Çağlarda Türk Dünyası",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Boylardan Devlete",
        "unit": "İlk ve Orta Çağlarda Türk Dünyası",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 7
      },
      {
        "topic": "Kavimler Göçü",
        "unit": "İlk ve Orta Çağlarda Türk Dünyası",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 1
      },
      {
        "topic": "İslamiyet Yayılıyor",
        "unit": "İslam Medeniyetinin Doğuşu",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 8
      },
      {
        "topic": "Abbasi Devleti ve Türkler",
        "unit": "İslam Medeniyetinin Doğuşu",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "İslamiyet’in Türk Devlet ve Toplum Yapısına Etkisi",
        "unit": "Türklerin İslamiyet’I Kabulü ve İlk Türk İslam Devletleri",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Büyük Selçuklu Devleti (1040-1157)",
        "unit": "Türklerin İslamiyet’I Kabulü ve İlk Türk İslam Devletleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Büyük Selçuklu Devleti’nde Yönetim ve Toplum Yapısı",
        "unit": "Türklerin İslamiyet’I Kabulü ve İlk Türk İslam Devletleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Anadolu’nun İlk Türk Siyasi Teşekkülleri",
        "unit": "Yerleşme ve Devletleşme Sürecinde Selçuklu Türkiyesi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Hilal ve Haç Mücadelesi",
        "unit": "Yerleşme ve Devletleşme Sürecinde Selçuklu Türkiyesi",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Devletleşme Sürecinde Osmanlı-Bizans İlişkileri",
        "unit": "Beylikten Devlete Osmanlı Siyaseti (1302-1453)",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 3
      },
      {
        "topic": "Osmanlı Devleti’nin Rumeli’deki İskân ve İstimâlet Politikası",
        "unit": "Beylikten Devlete Osmanlı Siyaseti (1302-1453)",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Osmanlı Devleti’nde Tımar Sistemi",
        "unit": "Devletleşme Sürecinde Savaşçılar ve Askerler",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Devşirme Sistemi ve Yeniçeri Ocağı",
        "unit": "Devletleşme Sürecinde Savaşçılar ve Askerler",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "İstanbul’un Fethi ve Fethin Sonuçları",
        "unit": "Dünya Gücü Osmanlı (1453-1595)",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Tek Hanedan Anlayışı ve Gelenekler Işığında Devlet İdarecisi",
        "unit": "Sultan ve Osmanlı Merkez Teşkilatı",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Osmanlı Devleti’nde İsyanlar ve Düzeni Koruma Çabaları",
        "unit": "Değişim Çağında Avrupa ve Osmanlı",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Osmanlı Devleti’nde Modern Orduya Geçiş",
        "unit": "Devrimler Çağında Değişen Devlet- Toplum İlişkileri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Osmanlı Devleti’ne Yönelik Tehditler",
        "unit": "Uluslararası İlişkilerde Denge Stratejisi (1774-1914)",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Osmanlı Devleti’nde Demokratikleşme Hareketleri",
        "unit": "Uluslararası İlişkilerde Denge Stratejisi (1774-1914)",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Osmanlı Devleti’nde Sanayileşme Çabaları",
        "unit": "XIX ve XX. Yüzyılda Değişen Sosyoekonomik Hayat",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Mustafa Kemal’in Lider Olarak Yetişmesinde Etkili Koşullar",
        "unit": "20. Yüzyıl Başlarında Osmanlı Devleti ve Dünya",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "I. Dünya Savaşı Sürecinde Osmanlı Devleti",
        "unit": "20. Yüzyıl Başlarında Osmanlı Devleti ve Dünya",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 5
      },
      {
        "topic": "I. Dünya Savaşı’nın Sonuçları",
        "unit": "20. Yüzyıl Başlarında Osmanlı Devleti ve Dünya",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Millî Mücadele’ye Hazırlık Dönemi",
        "unit": "Millî Mücadele",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 2,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Doğu ve Güney Cepheleri ile Bu Cephelerde Öne Çıkan Şahsiyetler",
        "unit": "Millî Mücadele",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Batı Cephesi ve Bu Cephede Öne Çıkan Şahsiyetler",
        "unit": "Millî Mücadele",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 7
      },
      {
        "topic": "Millî Mücadele’nin Sona Ermesi ve Lozan Barış Antlaşması",
        "unit": "Millî Mücadele",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Atatürk İlkeleri",
        "unit": "Atatürkçülük ve Türk İnkılabı",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Siyasi Alandaki Gelişmeler",
        "unit": "Atatürkçülük ve Türk İnkılabı",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 3
      },
      {
        "topic": "Toplumsal Alandaki İnkılaplar",
        "unit": "Atatürkçülük ve Türk İnkılabı",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Atatürk Dönemi Türk Dış Politikası",
        "unit": "İki Savaş Arasındaki Dönemde Türkiye ve Dünya",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "II. Dünya Savaşı Sürecinde Türkiye",
        "unit": "II. Dünya Savaşı Sürecinde Türkiye ve Dünya",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 10,
          "2019": 10,
          "2020": 10,
          "2021": 10,
          "2022": 10,
          "2023": 10,
          "2024": 10,
          "2025": 10,
          "2026": 10
        },
        "total": 90
      }
    ]
  },
  {
    "code": "ayt_cog1",
    "name": "Coğrafya-1",
    "exam": "AYT",
    "color": "#A78BFA",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "Ekosistemlerin Özellikleri ve İşleyişi",
        "unit": "Doğal Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 4
      },
      {
        "topic": "Ekstrem Doğa Olayları",
        "unit": "Doğal Sistemler",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 5
      },
      {
        "topic": "Küresel İklim Değişikliği ve Doğa Olaylarının Geleceği",
        "unit": "Doğal Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Nüfus Politikaları ve Projeksiyonları",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Şehirler ve Kırsal Yerleşmeler",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 5
      },
      {
        "topic": "Dünyada Doğal Kaynak ve Ekonomi",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Türkiye’de Tarım, Sanayi, Maden ve Enerji Kaynakları",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 5
      },
      {
        "topic": "Ekonomi, Şehirleşme ve Göç",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 4
      },
      {
        "topic": "İşlevsel Bölge ve Kalkınma Projeleri",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Hizmet Sektörü ve Ulaşım",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Türkiye’de ve Dünyada Ticaret",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Türkiye’de Turizm",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Kültür Bölgeleri ve Türk Kültürü",
        "unit": "Küresel Ortam: Bölgeler ve Ülkeler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 4
      },
      {
        "topic": "Küreselleşen Dünya",
        "unit": "Küresel Ortam: Bölgeler ve Ülkeler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Uluslararası Örgütler",
        "unit": "Küresel Ortam: Bölgeler ve Ülkeler",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Jeopolitik Konum ve Ülkeler Arası Etkileşim",
        "unit": "Küresel Ortam: Bölgeler ve Ülkeler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Çevre Sorunları ve Geri Dönüşüm",
        "unit": "Çevre ve Toplum",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 2,
          "2025": 0,
          "2026": 0
        },
        "total": 8
      },
      {
        "topic": "Çevre Sorunlarının Çözümüne Yönelik Yaklaşımlar",
        "unit": "Çevre ve Toplum",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 6,
          "2019": 6,
          "2020": 6,
          "2021": 6,
          "2022": 6,
          "2023": 6,
          "2024": 6,
          "2025": 6,
          "2026": 6
        },
        "total": 54
      }
    ]
  },
  {
    "code": "ayt_tarih2",
    "name": "Tarih-2",
    "exam": "AYT",
    "color": "#F97316",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "İnsanlığın Hafızası Tarih",
        "unit": "Tarih ve Zaman",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 7
      },
      {
        "topic": "Zamanın Taksimi",
        "unit": "Tarih ve Zaman",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "İnsanlığın İlk İzleri",
        "unit": "İnsanlığın İlk Dönemleri",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Coğrafya ile Oluşan Yaşam Tarzı",
        "unit": "İlk ve Orta Çağlarda Türk Dünyası",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Boylardan Devlete",
        "unit": "İlk ve Orta Çağlarda Türk Dünyası",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 4
      },
      {
        "topic": "Kavimler Göçü",
        "unit": "İlk ve Orta Çağlarda Türk Dünyası",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "İslamiyet’in Türk Devlet ve Toplum Yapısına Etkisi",
        "unit": "Türklerin İslamiyet’I Kabulü ve İlk Türk İslam Devletleri",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Büyük Selçuklu Devleti (1040-1157)",
        "unit": "Türklerin İslamiyet’I Kabulü ve İlk Türk İslam Devletleri",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Büyük Selçuklu Devleti’nde Yönetim ve Toplum Yapısı",
        "unit": "Türklerin İslamiyet’I Kabulü ve İlk Türk İslam Devletleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Anadolu’nun İlk Türk Siyasi Teşekkülleri",
        "unit": "Yerleşme ve Devletleşme Sürecinde Selçuklu Türkiyesi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Osmanlı Devleti’nin Rumeli’deki İskân ve İstimâlet Politikası",
        "unit": "Beylikten Devlete Osmanlı Siyaseti (1302-1453)",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Anadolu’da Türk Siyasi Birliğini Sağlama Çabaları",
        "unit": "Beylikten Devlete Osmanlı Siyaseti (1302-1453)",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Osmanlı Devleti’nde Tımar Sistemi",
        "unit": "Devletleşme Sürecinde Savaşçılar ve Askerler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Devşirme Sistemi ve Yeniçeri Ocağı",
        "unit": "Devletleşme Sürecinde Savaşçılar ve Askerler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Osmanlı Devleti’nde Yönetici Sınıf (Askerî Sınıf)",
        "unit": "Beylikten Devlete Osmanlı Medeniyeti",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "İstanbul’un Fethi ve Fethin Sonuçları",
        "unit": "Dünya Gücü Osmanlı (1453-1595)",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Türk İslam Dünyasında Birliği Sağlama Çabaları",
        "unit": "Dünya Gücü Osmanlı (1453-1595)",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Dünyanın Muhteşem Gücü Osmanlı",
        "unit": "Dünya Gücü Osmanlı (1453-1595)",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Saray ve Şehir Kültürü",
        "unit": "Sultan ve Osmanlı Merkez Teşkilatı",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Osmanlı Devleti’nde Millet Sistemi",
        "unit": "Klasik Çağ’da Osmanlı Toplum Düzeni",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Osmanlı’da Devletin Toprak Üzerindeki Mülkiyeti ve Çifthane Sistemi",
        "unit": "Klasik Çağ’da Osmanlı Toplum Düzeni",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Uzun Savaşlardan Diplomasiye",
        "unit": "Değişen Dünya Dengeleri Karşısında Osmanlı Siyaseti (1595-1774)",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Avrupa’da Değişim Çağı",
        "unit": "Değişim Çağında Avrupa ve Osmanlı",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "İhtilaller Çağı",
        "unit": "Devrimler Çağında Değişen Devlet- Toplum İlişkileri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Osmanlı Devleti’nde Modern Orduya Geçiş",
        "unit": "Devrimler Çağında Değişen Devlet- Toplum İlişkileri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Osmanlı Devleti’ne Yönelik Tehditler",
        "unit": "Uluslararası İlişkilerde Denge Stratejisi (1774-1914)",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 2,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "Osmanlı Devleti’nde Demokratikleşme Hareketleri",
        "unit": "Uluslararası İlişkilerde Denge Stratejisi (1774-1914)",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Mustafa Kemal’in Lider Olarak Yetişmesinde Etkili Koşullar",
        "unit": "20. Yüzyıl Başlarında Osmanlı Devleti ve Dünya",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "20. Yüzyıl Başlarında Osmanlı Devleti",
        "unit": "20. Yüzyıl Başlarında Osmanlı Devleti ve Dünya",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "I. Dünya Savaşı Sürecinde Osmanlı Devleti",
        "unit": "20. Yüzyıl Başlarında Osmanlı Devleti ve Dünya",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "I. Dünya Savaşı’nın Sonuçları",
        "unit": "20. Yüzyıl Başlarında Osmanlı Devleti ve Dünya",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Millî Mücadele’ye Hazırlık Dönemi",
        "unit": "Millî Mücadele",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 8
      },
      {
        "topic": "Büyük Millet Meclisinin Açılması (23 Nisan 1920)",
        "unit": "Millî Mücadele",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Batı Cephesi ve Bu Cephede Öne Çıkan Şahsiyetler",
        "unit": "Millî Mücadele",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 2,
          "2023": 2,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 8
      },
      {
        "topic": "Millî Mücadele’nin Sona Ermesi ve Lozan Barış Antlaşması",
        "unit": "Millî Mücadele",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 1
      },
      {
        "topic": "Atatürk İlkeleri",
        "unit": "Atatürkçülük ve Türk İnkılabı",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Siyasi Alandaki Gelişmeler",
        "unit": "Atatürkçülük ve Türk İnkılabı",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Hukuk Alanındaki Gelişmeler",
        "unit": "Atatürkçülük ve Türk İnkılabı",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Toplumsal Alandaki İnkılaplar",
        "unit": "Atatürkçülük ve Türk İnkılabı",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Ekonomi Alanındaki Gelişmeler",
        "unit": "Atatürkçülük ve Türk İnkılabı",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Sağlık Alanındaki Gelişmeler",
        "unit": "Atatürkçülük ve Türk İnkılabı",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "II. Dünya Savaşı",
        "unit": "II. Dünya Savaşı Sürecinde Türkiye ve Dünya",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "II. Dünya Savaşı Sürecinde Türkiye",
        "unit": "II. Dünya Savaşı Sürecinde Türkiye ve Dünya",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "II. Dünya Savaşı Sonrası Oluşan Güç Dengeleri ve Türkiye",
        "unit": "II. Dünya Savaşı Sonrasında Türkiye ve Dünya",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "1960 Sonrasında Türk Dış Politikası",
        "unit": "Toplumsal Devrim Çağında Dünya ve Türkiye",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "1990 Sonrasında Türkiye",
        "unit": "21. Yüzyılın Eşiğinde Türkiye ve Dünya",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 11,
          "2019": 11,
          "2020": 11,
          "2021": 11,
          "2022": 11,
          "2023": 11,
          "2024": 11,
          "2025": 11,
          "2026": 11
        },
        "total": 99
      }
    ]
  },
  {
    "code": "ayt_cog2",
    "name": "Coğrafya-2",
    "exam": "AYT",
    "color": "#8B5CF6",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "Ekosistemlerin Özellikleri ve İşleyişi",
        "unit": "Doğal Sistemler",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 2,
          "2025": 1,
          "2026": 1
        },
        "total": 10
      },
      {
        "topic": "Ekstrem Doğa Olayları",
        "unit": "Doğal Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 1,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "Küresel İklim Değişikliği ve Doğa Olaylarının Geleceği",
        "unit": "Doğal Sistemler",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 1,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 6
      },
      {
        "topic": "Nüfus Politikaları ve Projeksiyonları",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 5
      },
      {
        "topic": "Şehirler ve Kırsal Yerleşmeler",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 2,
          "2025": 0,
          "2026": 1
        },
        "total": 6
      },
      {
        "topic": "Dünyada Doğal Kaynak ve Ekonomi",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 3,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 6
      },
      {
        "topic": "Türkiye’de Tarım, Sanayi, Maden ve Enerji Kaynakları",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 2,
          "2022": 0,
          "2023": 2,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 8
      },
      {
        "topic": "Ekonomi, Şehirleşme ve Göç",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 7
      },
      {
        "topic": "İşlevsel Bölge ve Kalkınma Projeleri",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 6
      },
      {
        "topic": "Hizmet Sektörü ve Ulaşım",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Türkiye’de ve Dünyada Ticaret",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 1
      },
      {
        "topic": "Türkiye’de Turizm",
        "unit": "Beşerî Sistemler",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "Kültür Bölgeleri ve Türk Kültürü",
        "unit": "Küresel Ortam: Bölgeler ve Ülkeler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 1
        },
        "total": 5
      },
      {
        "topic": "Küreselleşen Dünya",
        "unit": "Küresel Ortam: Bölgeler ve Ülkeler",
        "yearly": {
          "2018": 1,
          "2019": 2,
          "2020": 1,
          "2021": 0,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 8
      },
      {
        "topic": "Uluslararası Örgütler",
        "unit": "Küresel Ortam: Bölgeler ve Ülkeler",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Jeopolitik Konum ve Ülkeler Arası Etkileşim",
        "unit": "Küresel Ortam: Bölgeler ve Ülkeler",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 5
      },
      {
        "topic": "Çevre Sorunları ve Geri Dönüşüm",
        "unit": "Çevre ve Toplum",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 1,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 9
      },
      {
        "topic": "Çevre Sorunlarının Çözümüne Yönelik Yaklaşımlar",
        "unit": "Çevre ve Toplum",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 2,
          "2026": 1
        },
        "total": 6
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 11,
          "2019": 11,
          "2020": 11,
          "2021": 11,
          "2022": 11,
          "2023": 11,
          "2024": 11,
          "2025": 11,
          "2026": 11
        },
        "total": 99
      }
    ]
  },
  {
    "code": "ayt_felsefe",
    "name": "Felsefe Grubu",
    "exam": "AYT",
    "color": "#FBBF24",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "Felsefenin Anlamı",
        "unit": "Felsefeyi Tanıma",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 1
      },
      {
        "topic": "Felsefi Düşüncenin Ortaya Çıkışı ve Özellikleri",
        "unit": "Felsefeyi Tanıma",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 2,
          "2023": 1,
          "2024": 1,
          "2025": 1,
          "2026": 1
        },
        "total": 7
      },
      {
        "topic": "Felsefenin İnsan ve Toplum Hayatı Üzerindeki Rolü",
        "unit": "Felsefeyi Tanıma",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Düşünme ve Akıl Yürütmeye İlişkin Kavramlar",
        "unit": "Felsefe ile Düşünme",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Düşünme ve Dil İlişkisi",
        "unit": "Felsefe ile Düşünme",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Varlık Felsefesinin Konusu ve Problemleri",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 1
      },
      {
        "topic": "Evrende Amaçlılık ve Düzenlilik-Varlık Türlerinin Sınıflandırılması- Bir konunun Varlık Felsefesi Açısından Değerlendirilmesi",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Varlık Felsefesi Alanındaki Çağdaş Yaklaşımlar",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Bilgi Felsefesinin Konusu ve Bilginin İmkânı Problemi",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Bilginin Sınırları, Ölçütü- Doğruluk ve Gerçeklik-Bilginin Değeri ve Güvenirliği",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Bilim Felsefesinin Konusu ve Problemleri",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Bilimin Değeri-Bilim Felsefe İlişkisi-Bilim ve Hayat İlişkisi",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Ahlak Felsefesinde Özgürlük ve Sorumluluk",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Ahlak Felsefesinde İyilik ve Mutluluk İlişkisi",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Din Felsefesinin Konusu ve Soruları",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Siyaset Felsefesinin Konusu ve Problemleri",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Sanat Felsefesinin Konusu ve Problemleri",
        "unit": "Felsefenin Temel Konuları ve Problemleri",
        "yearly": {
          "2018": 1,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 1,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "Felsefi Metin Analizi",
        "unit": "Felsefi Okuma ve Yazma",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "İlk Medeniyetlerin Felsefenin Doğuşuna Etkisi-Anadolu’da Yaşamış Filozoflar",
        "unit": "Mö 6. Yüzyıl-Ms 2. Yüzyıl Felsefesi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Sofistler ile Sokrates&#x27;in Bilgi ve Değer Anlayışları",
        "unit": "Mö 6. Yüzyıl-Ms 2. Yüzyıl Felsefesi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Platon ve Aristoteles’in Varlık, Bilgi ve Değer Anlayışı",
        "unit": "Mö 6. Yüzyıl-Ms 2. Yüzyıl Felsefesi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "İslam Felsefesinin Özellikleri İnanç Akıl İlişkisi ve Filozofların Görüşleri",
        "unit": "Ms 2. Yüzyıl-Ms 15. Yüzyıl Felsefesi",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "15- 17. Yüzyıl Felsefesinde Öne Çıkan Görüşler",
        "unit": "15. Yüzyıl- 17. Yüzyıl Felsefesi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 4
      },
      {
        "topic": "18-19. Yüzyıl Felsefesinde Öne Çıkan Problemler ve Görüşler",
        "unit": "18. Yüzyıl- 19. Yüzyıl Felsefesi",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 2
        },
        "total": 3
      },
      {
        "topic": "20. Yüzyıl Felsefesinde Bazı Ana Akımlar",
        "unit": "20. Yüzyıl Felsefesi",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 2,
          "2021": 2,
          "2022": 1,
          "2023": 1,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 8
      },
      {
        "topic": "20. Yüzyıl Filozoflarının Görüşleri",
        "unit": "20. Yüzyıl Felsefesi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 5,
          "2019": 5,
          "2020": 5,
          "2021": 5,
          "2022": 5,
          "2023": 5,
          "2024": 5,
          "2025": 5,
          "2026": 5
        },
        "total": 45
      }
    ]
  },
  {
    "code": "ayt_din",
    "name": "Din Kültürü",
    "exam": "AYT",
    "color": "#EC4899",
    "years": [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026"
    ],
    "topics": [
      {
        "topic": "Kur’andan Mesajlar: Hucurât Suresi 13. Ayet",
        "unit": "Gönül Coğrafyamız",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "İslam’da İbadetin Amacı ve Önemi",
        "unit": "İslam ve İbadet",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "İslam’da İbadet Yükümlülüğü",
        "unit": "İslam ve İbadet",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 1
        },
        "total": 3
      },
      {
        "topic": "İslam’da İbadetlerin Temel İlkeleri",
        "unit": "İslam ve İbadet",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Kur’an’dan Mesajlar: Bakara Suresi 177. Ayet",
        "unit": "İslam ve İbadet",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 1
      },
      {
        "topic": "Allah’ın Varlığı ve Birliği",
        "unit": "Allah İnsan İlişkisi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Allah’ın İsim ve Sıfatları",
        "unit": "Allah İnsan İlişkisi",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "İnsanın Allah ile İrtibatı",
        "unit": "Allah İnsan İlişkisi",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Bazı Genç Sahabiler",
        "unit": "Hz. Muhammed ve Gençlik",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Kur’an’dan Mesajlar: Al-i İmran Suresi 159. Ayet",
        "unit": "Hz. Muhammed ve Gençlik",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Din, Kültür ve Sanat",
        "unit": "Din ve Hayat",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Din ve Ekonomi",
        "unit": "Din ve Hayat",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 2
      },
      {
        "topic": "Tutum ve Davranışlarda Ölçülü Olmak",
        "unit": "Ahlaki Tutum ve Davranışlar",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "İslam Ahlakında Yerilen Bazı Davranışlar",
        "unit": "Ahlaki Tutum ve Davranışlar",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "İslam Düşüncesindeki Fıkhi Yorumlar",
        "unit": "İslam Düşüncesinde İtikadi, Siyasi ve Fıkhi Yorumlar",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Varoluşun ve Hayatın Anlamı",
        "unit": "Dünya ve Ahiret",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 3
      },
      {
        "topic": "Hz. Muhammed’in Şahsiyeti",
        "unit": "Kur’An’A Göre Hz. Muhammed",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Hz. Muhammed’in Peygamberlik Yönü",
        "unit": "Kur’An’A Göre Hz. Muhammed",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Hz. Muhammed’e Bağlılık ve İtaat",
        "unit": "Kur’An’A Göre Hz. Muhammed",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Dosdoğru Yol: Sıratımüstakim",
        "unit": "Kur’An’da Bazı Kavramlar",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "İnançla İlgili Felsefi Yaklaşımlar",
        "unit": "İnançla İlgili Meseleler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Yeni Dinî Hareketler",
        "unit": "İnançla İlgili Meseleler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Yahudilik",
        "unit": "Yahudilik ve Hristiyanlık",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Hristiyanlık",
        "unit": "Yahudilik ve Hristiyanlık",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "İslam Medeniyetinde Bilim ve Düşüncenin Gelişimi",
        "unit": "İslam ve Bilim",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "İslam Medeniyetinde Öne Çıkan Eğitim Kurumları",
        "unit": "İslam ve Bilim",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 1,
          "2023": 0,
          "2024": 0,
          "2025": 1,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Müslümanların Bilim Alanında Yaptığı Öncü ve Özgün Çalışmalar",
        "unit": "İslam ve Bilim",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 1,
          "2022": 1,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 3
      },
      {
        "topic": "Türklerin Müslüman Olmaları",
        "unit": "Anadolu’da İslam",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 1,
          "2021": 0,
          "2022": 0,
          "2023": 1,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Tasavvufi Düşüncenin Oluşumu",
        "unit": "İslam Düşüncesinde Tasavvufi Yorumlar",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Kültürümüzde Etkin Olan Tasavvufi Yorumlar",
        "unit": "İslam Düşüncesinde Tasavvufi Yorumlar",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 1,
          "2025": 0,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "İktisadi Hayatla İlgili Meseleler",
        "unit": "Güncel Dinî Meseleler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 0
      },
      {
        "topic": "Dinî Meselelerin Çözümünde Temel İlke ve Yöntemler",
        "unit": "Güncel Dinî Meseleler",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 2,
          "2026": 0
        },
        "total": 2
      },
      {
        "topic": "Hinduizm",
        "unit": "Hint ve Çin Dinleri",
        "yearly": {
          "2018": 0,
          "2019": 1,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Budizm",
        "unit": "Hint ve Çin Dinleri",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Taoizm",
        "unit": "Hint ve Çin Dinleri",
        "yearly": {
          "2018": 0,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 1
        },
        "total": 1
      },
      {
        "topic": "Kur’an’ın Okunmasıyla İlgili Kavramlar",
        "unit": "Kur’An’da Bazı Kavramlar",
        "yearly": {
          "2018": 1,
          "2019": 0,
          "2020": 0,
          "2021": 0,
          "2022": 0,
          "2023": 0,
          "2024": 0,
          "2025": 0,
          "2026": 0
        },
        "total": 1
      },
      {
        "topic": "Toplam",
        "unit": "",
        "yearly": {
          "2018": 6,
          "2019": 6,
          "2020": 6,
          "2021": 6,
          "2022": 6,
          "2023": 6,
          "2024": 6,
          "2025": 6,
          "2026": 6
        },
        "total": 54
      }
    ]
  }
];

/**
 * Normalizes topic names to assist with cross-matching between curriculum and distribution
 */
export function normalizeTopicKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9ğüşıöç]/gi, '')
    .trim();
}
