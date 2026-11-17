// ============================================================================
// ÖSYM 2026-YKS YERLEŞTİRME PUANI VE BAŞARI SIRASI HESAPLAMA MOTORU
// Kaynak: https://github.com/niedy707/osym (niedy707/osym - MIT Lisans)
// Yöntem: PROBIT İnterpolasyon (ÖSYM Resmi Yığınsal Puan Dağılımı Tablosu)
// ============================================================================

export type TrackType = 'SAY' | 'EA' | 'SÖZ' | 'DİL' | 'TYT';

export const CUMULATIVE_DISTRIBUTION: Record<TrackType, [number, number][]> = {
  TYT: [
    [550, 112], [530, 2045], [510, 8638], [490, 22600], [470, 45313],
    [450, 76021], [430, 115071], [410, 163211], [390, 225038], [370, 305570],
    [350, 412011], [330, 553526], [310, 735519], [290, 961261], [270, 1219171],
    [250, 1499060], [230, 1782951], [210, 2033331], [190, 2166477],
    [170, 2186977], [150, 2187734], [130, 2187742], [115, 2187743]
  ],
  SAY: [
    [550, 154], [530, 3500], [510, 12887], [490, 27402], [470, 44919],
    [450, 63669], [430, 83511], [410, 105112], [390, 129485], [370, 157778],
    [350, 191247], [330, 232317], [310, 282213], [290, 344726], [270, 425443],
    [250, 533920], [230, 681176], [210, 858167], [190, 1019046],
    [170, 1117304], [150, 1135198], [130, 1135713], [115, 1135718]
  ],
  SÖZ: [
    [550, 4], [530, 14], [510, 69], [490, 221], [470, 606],
    [450, 1566], [430, 4058], [410, 10184], [390, 22750], [370, 45237],
    [350, 82479], [330, 140496], [310, 223004], [290, 333238], [270, 474443],
    [250, 642816], [230, 814264], [210, 953036], [190, 1040347],
    [170, 1078859], [150, 1085505], [130, 1085697], [115, 1085698]
  ],
  EA: [
    [550, 12], [530, 98], [510, 394], [490, 1118], [470, 2482],
    [450, 5299], [430, 12363], [410, 29700], [390, 58772], [370, 97839],
    [350, 148570], [330, 215631], [310, 307918], [290, 429479], [270, 585271],
    [250, 775922], [230, 990764], [210, 1196809], [190, 1347025],
    [170, 1412649], [150, 1421093], [130, 1421289], [115, 1421290]
  ],
  DİL: [
    [550, 14], [530, 231], [510, 942], [490, 2252], [470, 4241],
    [450, 7472], [430, 12254], [410, 18566], [390, 26352], [370, 34585],
    [350, 43129], [330, 51784], [310, 60948], [290, 70670], [270, 81109],
    [250, 92274], [230, 104127], [210, 116152], [190, 125789],
    [170, 131233], [150, 132714], [130, 132825], [115, 132826]
  ]
};

export const TOTAL_CANDIDATES: Record<TrackType, number> = {
  TYT: CUMULATIVE_DISTRIBUTION.TYT[CUMULATIVE_DISTRIBUTION.TYT.length - 1][1],
  SAY: CUMULATIVE_DISTRIBUTION.SAY[CUMULATIVE_DISTRIBUTION.SAY.length - 1][1],
  SÖZ: CUMULATIVE_DISTRIBUTION.SÖZ[CUMULATIVE_DISTRIBUTION.SÖZ.length - 1][1],
  EA:  CUMULATIVE_DISTRIBUTION.EA[CUMULATIVE_DISTRIBUTION.EA.length - 1][1],
  DİL: CUMULATIVE_DISTRIBUTION.DİL[CUMULATIVE_DISTRIBUTION.DİL.length - 1][1]
};

// Error function (erf) - Abramowitz & Stegun Formula 7.1.26
function erf(x: number): number {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return sign * y;
}

// Standart normal birikimli dağılım (Phi)
export function _ndtr(z: number): number {
  return 0.5 * (1.0 + erf(z / Math.SQRT2));
}

// Standart normal ters birikimli dağılım (Acklam yaklaşımı + 1 Halley adımı)
export function _ndtri(p: number): number {
  if (p <= 0.0) return -40.0;
  if (p >= 1.0) return 40.0;

  const a = [
    -3.969683028665376e+01,  2.209460984245205e+02, -2.759285104469687e+02,
     1.383577518672690e+02, -3.066479806614716e+01,  2.506628277459239e+00
  ];
  const b = [
    -5.447609879822406e+01,  1.615858368580409e+02, -1.556989798598866e+02,
     6.680131188771972e+01, -1.328068155288572e+01
  ];
  const c = [
    -7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
    -2.549732539343734e+00,  4.374664141464968e+00,  2.938163982698783e+00
  ];
  const d = [
     7.784695709041462e-03,  3.224671290700398e-01,  2.445134137142996e+00,
     3.754408661907416e+00
  ];

  const pl = 0.02425;
  const ph = 1.0 - 0.02425;

  let x = 0;
  if (p < pl) {
    const q = Math.sqrt(-2 * Math.log(p));
    x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= ph) {
    const q = p - 0.5;
    const r = q * q;
    x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
        (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
         ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }

  const e = _ndtr(x) - p;
  const u = e * Math.sqrt(2 * Math.PI) * Math.exp(x * x / 2);
  return x - u / (1 + x * u / 2);
}

// N kişilik üst kuyruğa karşılık gelen z skoru
function _z(n: number, ntot: number): number {
  return _ndtri(1.0 - Math.min(Math.max(n / ntot, 1e-12), 1 - 1e-12));
}

export interface RankResult {
  rank: number;
  confidence: 'ekstrapolasyon' | 'interpolasyon' | 'alt-sinir';
  percentile: number;
  totalCandidates: number;
}

/**
 * ÖSYM Probit Modeli ile Yerleştirme Puanından Başarı Sırası Hesabı
 * niedy707/osym referans modeli
 */
export function calculateRank(puan: number, tur: TrackType = 'SAY'): RankResult {
  const pts = CUMULATIVE_DISTRIBUTION[tur];
  const ntot = TOTAL_CANDIDATES[tur];

  const hi_p = pts[0][0];
  const [lo_p, lo_n] = pts[pts.length - 1];

  let estimatedRank = 1;
  let confidence: 'ekstrapolasyon' | 'interpolasyon' | 'alt-sinir' = 'interpolasyon';

  if (puan >= hi_p) {
    // 550 üstü: En üst iki basamağın z-eğimiyle ekstrapolasyon
    const [p2, n2] = pts[0];
    const [p1, n1] = pts[1];
    const z2 = _z(n2, ntot);
    const z1 = _z(n1, ntot);
    const z = z2 + ((z2 - z1) / (p2 - p1)) * (puan - p2);
    const est = ntot * (1 - _ndtr(z));
    estimatedRank = Math.max(1, Math.round(est));
    confidence = 'ekstrapolasyon';
  } else if (puan <= lo_p) {
    estimatedRank = lo_n;
    confidence = 'alt-sinir';
  } else {
    for (let i = 0; i < pts.length - 1; i++) {
      const [p_hi, n_hi] = pts[i];
      const [p_lo, n_lo] = pts[i + 1];
      if (puan >= p_lo && puan < p_hi) {
        const f = (puan - p_lo) / (p_hi - p_lo);
        const z = _z(n_lo, ntot) + f * (_z(n_hi, ntot) - _z(n_lo, ntot));
        const est = ntot * (1 - _ndtr(z));
        estimatedRank = Math.max(1, Math.round(est));
        confidence = 'interpolasyon';
        break;
      }
    }
  }

  const percentile = (estimatedRank / ntot) * 100;

  return {
    rank: estimatedRank,
    confidence,
    percentile,
    totalCandidates: ntot
  };
}

/**
 * Sıraya karşılık gelen yerleştirme puanı (rank fonksiyonunun tersi)
 */
export function calculatePuanAtRank(R: number, tur: TrackType = 'SAY'): number {
  const pts = CUMULATIVE_DISTRIBUTION[tur];
  const ntot = TOTAL_CANDIDATES[tur];
  const zR = _z(R, ntot);

  for (let i = 0; i < pts.length - 1; i++) {
    const [p_hi, n_hi] = pts[i];
    const [p_lo, n_lo] = pts[i + 1];
    const z_hi = _z(n_hi, ntot);
    const z_lo = _z(n_lo, ntot);
    if (zR >= z_lo && zR <= z_hi) {
      const f = (zR - z_lo) / (z_hi - z_lo);
      return p_lo + f * (p_hi - p_lo);
    }
  }

  if (R < pts[0][1]) {
    const [p2, n2] = pts[0];
    const [p1, n1] = pts[1];
    const z2 = _z(n2, ntot);
    const z1 = _z(n1, ntot);
    return p2 + ((zR - z2) * (p2 - p1)) / (z2 - z1);
  }

  return pts[pts.length - 1][0];
}

export interface YksNetsInput {
  // TYT (120 Soru)
  tytTurkce: number;    // max 40
  tytSosyal: number;    // max 20
  tytMat: number;       // max 40
  tytFen: number;       // max 20

  // AYT (Alan bazlı)
  aytMat?: number;      // max 40 (SAY, EA)
  aytFizik?: number;    // max 14 (SAY)
  aytKimya?: number;    // max 13 (SAY)
  aytBiyoloji?: number; // max 13 (SAY)

  aytEdebiyat?: number; // max 24 (EA, SÖZ)
  aytTarih1?: number;   // max 10 (EA, SÖZ)
  aytCografya1?: number;// max 6 (EA, SÖZ)

  aytTarih2?: number;   // max 11 (SÖZ)
  aytCografya2?: number;// max 11 (SÖZ)
  aytFelsefe?: number;  // max 12 (SÖZ)
  aytDin?: number;      // max 6 (SÖZ)

  ydtDil?: number;      // max 80 (DİL)

  // OBP
  obp: number;          // 50 - 100
  isKirikObp?: boolean; // Yerleştiği için 0.3 katsayısı
}

export interface YksScoreCalculationResult {
  tytHamPuan: number;
  aytHamPuan: number;
  obpKatkisi: number;
  yerlestirmePuani: number;
  rankResult: RankResult;
}

/**
 * Netlerden ÖSYM Ham Puan ve Yerleştirme Puanı Hesaplama
 */
export function calculateYksScoresFromNets(
  input: YksNetsInput,
  track: TrackType
): YksScoreCalculationResult {
  // 1. TYT Ham Puanı (ÖSYM Taban 100 + Soru Ağırlıkları)
  // Toplam 120 net için 400 puan -> ortalama 3.33 puan / net
  const tytTurkceNet = Math.max(0, Math.min(40, input.tytTurkce || 0));
  const tytSosyalNet = Math.max(0, Math.min(20, input.tytSosyal || 0));
  const tytMatNet = Math.max(0, Math.min(40, input.tytMat || 0));
  const tytFenNet = Math.max(0, Math.min(20, input.tytFen || 0));

  const tytHamPuan = 100 + (tytTurkceNet * 3.3) + (tytMatNet * 3.3) + (tytSosyalNet * 3.4) + (tytFenNet * 3.4);

  // 2. AYT Ham Puanı
  // TYT katkısı %40 (en fazla 200 puan), AYT katkısı %60 (en fazla 300 puan)
  let aytOnlyScore = 0;

  if (track === 'SAY') {
    const mat = Math.max(0, Math.min(40, input.aytMat || 0));
    const fiz = Math.max(0, Math.min(14, input.aytFizik || 0));
    const kim = Math.max(0, Math.min(13, input.aytKimya || 0));
    const biy = Math.max(0, Math.min(13, input.aytBiyoloji || 0));
    // 40 mat * 3.75 + 14 fiz * 2.857 + 13 kim * 3.076 + 13 biy * 3.076 = 300
    aytOnlyScore = (mat * 3.75) + (fiz * 2.857) + (kim * 3.076) + (biy * 3.076);
  } else if (track === 'EA') {
    const mat = Math.max(0, Math.min(40, input.aytMat || 0));
    const edb = Math.max(0, Math.min(24, input.aytEdebiyat || 0));
    const tar1 = Math.max(0, Math.min(10, input.aytTarih1 || 0));
    const cog1 = Math.max(0, Math.min(6, input.aytCografya1 || 0));
    // 40 mat * 3.75 + 24 edb * 3.75 + 10 tar1 * 3.0 + 6 cog1 * 5.0 = 300
    aytOnlyScore = (mat * 3.75) + (edb * 3.75) + (tar1 * 3.0) + (cog1 * 5.0);
  } else if (track === 'SÖZ') {
    const edb = Math.max(0, Math.min(24, input.aytEdebiyat || 0));
    const tar1 = Math.max(0, Math.min(10, input.aytTarih1 || 0));
    const cog1 = Math.max(0, Math.min(6, input.aytCografya1 || 0));
    const tar2 = Math.max(0, Math.min(11, input.aytTarih2 || 0));
    const cog2 = Math.max(0, Math.min(11, input.aytCografya2 || 0));
    const fel = Math.max(0, Math.min(12, input.aytFelsefe || 0));
    const din = Math.max(0, Math.min(6, input.aytDin || 0));
    aytOnlyScore = (edb * 3.75) + (tar1 * 3.0) + (cog1 * 5.0) + (tar2 * 3.4) + (cog2 * 3.4) + (fel * 3.75) + (din * 5.0);
  } else if (track === 'DİL') {
    const dil = Math.max(0, Math.min(80, input.ydtDil || 0));
    aytOnlyScore = dil * 3.75; // 80 * 3.75 = 300
  }

  const aytHamPuan = 100 + (tytHamPuan * 0.4 - 40) + aytOnlyScore;

  // 3. OBP Katkısı
  // Standart OBP (50 - 100) * 0.6 = max 60 puan (kırık OBP ise * 0.3 = max 30)
  const obpFactor = input.isKirikObp ? 0.3 : 0.6;
  const clampedObp = Math.max(50, Math.min(100, input.obp || 80));
  const obpKatkisi = clampedObp * obpFactor;

  // 4. Yerleştirme Puanı
  const activeHam = track === 'TYT' ? tytHamPuan : aytHamPuan;
  const yerlestirmePuani = Math.min(560, Math.max(100, activeHam + obpKatkisi));

  const rankResult = calculateRank(yerlestirmePuani, track);

  return {
    tytHamPuan,
    aytHamPuan,
    obpKatkisi,
    yerlestirmePuani,
    rankResult
  };
}
