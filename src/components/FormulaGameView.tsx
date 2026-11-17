import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, RotateCcw, Check, Shuffle, Settings } from 'lucide-react';

// ============================================================================
// TYT Fizik Formülleri Veri Tabanı (Kaynak: fizikozeldersin.com)
// ============================================================================

export interface PhysicsFormula {
  id: string;
  question: string;
  canonical: string;        // Ana doğru cevap (gösterilecek)
  accepted: string[];       // Tüm kabul edilen varyasyonlar
  hint?: string;            // Açıklama / birim
}

export interface PhysicsFormulaTopicGroup {
  id: string;
  name: string;
  emoji: string;
  color: string;
  formulas: PhysicsFormula[];
}

export const PHYSICS_FORMULA_GROUPS: PhysicsFormulaTopicGroup[] = [
  {
    id: 'hareket',
    name: 'Kinematik & Hareket',
    emoji: '🏃',
    color: '#38BDF8',
    formulas: [
      {
        id: 'h1',
        question: 'Ortalama Hız formülü nedir?',
        canonical: 'v = Δx / Δt',
        accepted: ['v=deltax/deltat','v=dx/dt','v=Δx/Δt','v=x/t','v = dx/dt','v = x/t','v = Δx / Δt','vort=deltax/deltat','vort=x/t'],
        hint: 'Δx: konum değişimi, Δt: zaman'
      },
      {
        id: 'h2',
        question: 'Anlık İvme formülü nedir?',
        canonical: 'a = Δv / Δt',
        accepted: ['a=deltav/deltat','a=dv/dt','a=Δv/Δt','a = Δv / Δt','a=v/t','a = dv/dt'],
        hint: 'Δv: hız değişimi, Δt: zaman (m/s²)'
      },
      {
        id: 'h3',
        question: 'Sabit ivmeli harekette son hız formülü nedir?',
        canonical: 'v = v₀ + a·t',
        accepted: ['v=v0+at','v=v0+a*t','v=v0+a.t','v = v0 + at','v=v₀+at','v = v₀ + a·t'],
        hint: 'v₀: başlangıç hızı, a: ivme, t: zaman'
      },
      {
        id: 'h4',
        question: 'Sabit ivmeli harekette yol (yer değiştirme) formülü nedir?',
        canonical: 'x = v₀·t + ½·a·t²',
        accepted: ['x=v0t+0.5at2','x=v0*t+1/2*a*t^2','x=v0t+1/2at2','x=v0·t+½·a·t²','x=v0t+(1/2)at2','x = v0t + ½at²','x=v₀t+½at²'],
        hint: 'v₀: başlangıç hızı, a: ivme, t: zaman'
      },
      {
        id: 'h5',
        question: 'Sabit ivmeli harekette hız-konum bağıntısı nedir?',
        canonical: 'v² = v₀² + 2·a·x',
        accepted: ['v2=v02+2ax','v^2=v0^2+2*a*x','v2=v02+2*a*x','v² = v₀² + 2ax','v²=v₀²+2ax'],
        hint: 'Hız-konum bağıntısı (zamansız)'
      },
      {
        id: 'h6',
        question: 'Serbest düşüşteki hız formülü nedir?',
        canonical: 'v = g·t',
        accepted: ['v=gt','v=g*t','v=g.t','v = g*t','v = gt'],
        hint: 'g ≈ 10 m/s², t: düşüş süresi'
      },
      {
        id: 'h7',
        question: 'Serbest düşüşteki yol formülü nedir?',
        canonical: 'h = ½·g·t²',
        accepted: ['h=0.5gt2','h=1/2*g*t^2','h=1/2gt2','h=½gt²','h = ½g·t²','h=½·g·t²'],
        hint: 'h: düşüş yüksekliği, g: yerçekimi ivmesi'
      },
      {
        id: 'h8',
        question: 'Dairesel harekette çevresel hız formülü nedir?',
        canonical: 'v = 2πr / T',
        accepted: ['v=2pir/T','v=2πr/T','v=2*pi*r/T','v=2π*r/T','v = 2πr/T'],
        hint: 'r: yarıçap, T: periyot'
      },
      {
        id: 'h9',
        question: 'Açısal hız formülü nedir?',
        canonical: 'ω = 2π / T = 2πf',
        accepted: ['w=2pi/T','ω=2π/T','w=2πf','ω=2πf','w=2pi/t','omega=2pi/T'],
        hint: 'T: periyot, f: frekans (rad/s)'
      },
      {
        id: 'h10',
        question: 'Merkezcil ivme formülü nedir?',
        canonical: 'aₘ = v² / r',
        accepted: ['am=v2/r','am=v^2/r','ac=v^2/r','ac=v2/r','am = v²/r','a=v²/r','a=v2/r'],
        hint: 'v: hız, r: yarıçap (m/s²)'
      },
      {
        id: 'h11',
        question: 'Merkezcil (Santripetal) kuvvet formülü nedir?',
        canonical: 'F = m·v² / r',
        accepted: ['F=mv2/r','F=m*v^2/r','F=mv²/r','Fc=mv2/r','Fc=mv²/r','F = mv²/r'],
        hint: 'Dairesel yörüngede merkezkaçı/merkezcil kuvvet'
      }
    ]
  },
  {
    id: 'kuvvet',
    name: 'Kuvvet & Dinamik',
    emoji: '⚡',
    color: '#FB923C',
    formulas: [
      {
        id: 'k1',
        question: 'Newton\'un 2. Yasası (net kuvvet) formülü nedir?',
        canonical: 'F = m·a',
        accepted: ['F=ma','F=m*a','F=m.a','F = ma','Fnet=ma','Fnet = m*a'],
        hint: 'F: net kuvvet (N), m: kütle (kg), a: ivme (m/s²)'
      },
      {
        id: 'k2',
        question: 'Ağırlık formülü nedir?',
        canonical: 'G = m·g',
        accepted: ['G=mg','G=m*g','G=m.g','W=mg','W=m*g','G = mg'],
        hint: 'g ≈ 10 m/s² (N)'
      },
      {
        id: 'k3',
        question: 'Sürtünme kuvveti formülü nedir?',
        canonical: 'f = μ·N',
        accepted: ['f=uN','f=μN','f=mu*N','f=μ*N','fs=mN','fs=μN','f = μN'],
        hint: 'μ: sürtünme katsayısı, N: normal kuvvet'
      },
      {
        id: 'k4',
        question: 'Basınç formülü nedir?',
        canonical: 'P = F / A',
        accepted: ['P=F/A','P=F/S','P = F/A','P=F/alan'],
        hint: 'F: kuvvet (N), A: alan (m²), P: pascal (Pa)'
      },
      {
        id: 'k5',
        question: 'Sıvı basıncı formülü nedir?',
        canonical: 'P = h·d·g',
        accepted: ['P=hdg','P=h*d*g','P=h.d.g','Ps=hdg','P = h·d·g','P=h·d·g'],
        hint: 'h: derinlik, d: yoğunluk, g: yerçekimi ivmesi'
      },
      {
        id: 'k6',
        question: 'Kaldırma kuvveti formülü nedir?',
        canonical: 'Fₖ = V·d·g',
        accepted: ['Fk=Vdg','Fk=V*d*g','Fk=V.d.g','Fk = V·d·g','Fk=Vsivi*d*g'],
        hint: 'V: sıvıya batan hacim, d: sıvı yoğunluğu'
      },
      {
        id: 'k7',
        question: 'Özkütle (yoğunluk) formülü nedir?',
        canonical: 'd = m / V',
        accepted: ['d=m/V','ρ=m/V','rho=m/V','d = m/V'],
        hint: 'd/ρ: özkütle (kg/m³), m: kütle, V: hacim'
      },
      {
        id: 'k8',
        question: 'Tork (moment) formülü nedir?',
        canonical: 'τ = F·d',
        accepted: ['τ=F*d','τ=Fd','tork=F*d','tork=Fd','M=F*d','M=Fd','t=Fd','t=F.d'],
        hint: 'F: kuvvet, d: moment kolunun uzunluğu (N·m)'
      }
    ]
  },
  {
    id: 'impuls',
    name: 'Momentum & İmpuls',
    emoji: '💥',
    color: '#A78BFA',
    formulas: [
      {
        id: 'i1',
        question: 'Momentum formülü nedir?',
        canonical: 'p = m·v',
        accepted: ['p=mv','p=m*v','p=m.v','p = mv'],
        hint: 'p: momentum (kg·m/s), m: kütle, v: hız'
      },
      {
        id: 'i2',
        question: 'İmpuls (İtme) formülü nedir?',
        canonical: 'J = F·Δt',
        accepted: ['J=F*deltat','J=F*Δt','J=FΔt','J=F*dt','J=F.Δt','J=FΔt','J = F·Δt','itme=F*t'],
        hint: 'J: impuls (N·s), F: kuvvet, Δt: süre'
      },
      {
        id: 'i3',
        question: 'İmpuls-Momentum teoremi nedir?',
        canonical: 'J = Δp = m·(v - v₀)',
        accepted: ['J=m*(v-v0)','J=m(v-v0)','J=m*(v-v₀)','J=deltap','J=Δp','J=m·Δv','J=m*deltav'],
        hint: 'İtme = Momentum değişimi'
      }
    ]
  },
  {
    id: 'is_enerji',
    name: 'İş, Güç & Enerji',
    emoji: '⚡',
    color: '#FBBF24',
    formulas: [
      {
        id: 'ie1',
        question: 'İş formülü nedir?',
        canonical: 'W = F·Δx',
        accepted: ['W=F*deltax','W=F*Δx','W=FΔx','W=F.x','W=F*x','W = F·x','W=F*d'],
        hint: 'W: iş (J), F: kuvvet, Δx: yer değiştirme'
      },
      {
        id: 'ie2',
        question: 'Güç formülü nedir?',
        canonical: 'P = W / t',
        accepted: ['P=W/t','P=W/deltat','P=F*v','P=Fv','P = W/t'],
        hint: 'P: güç (W), W: iş, t: zaman'
      },
      {
        id: 'ie3',
        question: 'Kinetik Enerji formülü nedir?',
        canonical: 'Eₖ = ½·m·v²',
        accepted: ['Ek=0.5mv2','Ek=1/2*m*v^2','Ek=mv2/2','Ek=½mv²','Ek = ½·m·v²','KE=0.5mv2','Ek=0.5*m*v2'],
        hint: 'Ek: kinetik enerji (J), m: kütle, v: hız'
      },
      {
        id: 'ie4',
        question: 'Yerçekimi Potansiyel Enerji formülü nedir?',
        canonical: 'Eₚ = m·g·h',
        accepted: ['Ep=mgh','Ep=m*g*h','Ep=m.g.h','PE=mgh','Ep = mgh'],
        hint: 'Ep: potansiyel enerji (J), h: yükseklik'
      },
      {
        id: 'ie5',
        question: 'Yay (Esneklik) Potansiyel Enerjisi formülü nedir?',
        canonical: 'Eᵧ = ½·k·x²',
        accepted: ['Ey=0.5kx2','Ey=1/2*k*x^2','Ey=kx2/2','Ey=½kx²','Ey = ½·k·x²','Esprin=0.5*k*x2'],
        hint: 'k: yay sabiti (N/m), x: uzama/sıkışma'
      },
      {
        id: 'ie6',
        question: 'Mekanik Enerji formülü nedir?',
        canonical: 'Em = Eₖ + Eₚ',
        accepted: ['Em=Ek+Ep','Em=KE+PE','Em = Ek + Ep','Emekanik=Ek+Ep'],
        hint: 'Sürtünmesiz sistemlerde korunur'
      },
      {
        id: 'ie7',
        question: 'Verim formülü nedir?',
        canonical: 'η = W_faydalı / W_toplam × 100',
        accepted: ['n=Wfayda/Wtoplam','verim=Wf/Wt','verim=W1/W2','n=Wf/Wt*100','verim=yararlı/toplam'],
        hint: 'η: verim (%)'
      }
    ]
  },
  {
    id: 'isi',
    name: 'Isı & Sıcaklık',
    emoji: '🌡️',
    color: '#F87171',
    formulas: [
      {
        id: 'is1',
        question: 'Isı (Q) formülü nedir?',
        canonical: 'Q = m·c·ΔT',
        accepted: ['Q=m*c*deltaT','Q=mcΔT','Q=m.c.ΔT','Q=m*c*ΔT','Q = m·c·ΔT','Q=mcdeltaT'],
        hint: 'm: kütle, c: özısı, ΔT: sıcaklık farkı (J)'
      },
      {
        id: 'is2',
        question: 'Isı Sığası (Kapasitesi) formülü nedir?',
        canonical: 'C = m·c',
        accepted: ['C=mc','C=m*c','C = m·c'],
        hint: 'C: ısı sığası (J/°C), m: kütle, c: özısı'
      },
      {
        id: 'is3',
        question: 'Hal Değiştirme Isısı formülü nedir?',
        canonical: 'Q = m·L',
        accepted: ['Q=mL','Q=m*L','Q=m.L','Q = m·L'],
        hint: 'L: erime veya buharlaşma ısısı (J/kg)'
      },
      {
        id: 'is4',
        question: 'Boyca Genleşme formülü nedir?',
        canonical: 'ΔL = L₀·λ·ΔT',
        accepted: ['deltaL=L0*lambda*deltaT','ΔL=L₀λΔT','ΔL=L0*λ*ΔT','deltaL=L0*lambda*deltaT'],
        hint: 'L₀: başlangıç uzunluğu, λ: genleşme katsayısı'
      },
      {
        id: 'is5',
        question: 'Isıl denge bağıntısı (Isı alışverişi) nedir?',
        canonical: 'Q_alınan = Q_verilen',
        accepted: ['Qalindan=Qverilen','Qal=Qver','Qalindan=Qverilen','m1c1deltaT1=m2c2deltaT2'],
        hint: 'Kapalı sistemde ısı korunur'
      }
    ]
  },
  {
    id: 'elektrik',
    name: 'Elektrik & Manyetizma',
    emoji: '🔌',
    color: '#34D399',
    formulas: [
      {
        id: 'e1',
        question: 'Ohm Yasası nedir?',
        canonical: 'V = I·R',
        accepted: ['V=IR','V=I*R','V=I.R','V = I·R','U=IR'],
        hint: 'V: gerilim (volt), I: akım (amper), R: direnç (ohm)'
      },
      {
        id: 'e2',
        question: 'Seri bağlı dirençlerin eşdeğeri nedir?',
        canonical: 'Rₑ = R₁ + R₂ + ...',
        accepted: ['Re=R1+R2','Res=R1+R2+R3','Re=R1+R2+R3','Reş=R1+R2','Req=R1+R2+R3'],
        hint: 'Seri bağlıda dirençler toplanır'
      },
      {
        id: 'e3',
        question: 'Paralel bağlı dirençlerin eşdeğeri nedir?',
        canonical: '1/Rₑ = 1/R₁ + 1/R₂ + ...',
        accepted: ['1/Re=1/R1+1/R2','1/Res=1/R1+1/R2+1/R3','Re=R1*R2/(R1+R2)'],
        hint: 'İki direnç: Re = R1·R2/(R1+R2)'
      },
      {
        id: 'e4',
        question: 'Elektrik gücü formülü nedir?',
        canonical: 'P = V·I',
        accepted: ['P=VI','P=V*I','P=V.I','P=I2*R','P=I^2*R','P=V2/R','P=V^2/R','P = V·I'],
        hint: 'P: güç (W), ayrıca P = I²R = V²/R'
      },
      {
        id: 'e5',
        question: 'Elektrik enerjisi formülü nedir?',
        canonical: 'E = P·t = V·I·t',
        accepted: ['E=P*t','E=Pt','E=VIt','E=V*I*t','E = P·t'],
        hint: 'E: enerji (J veya kWh)'
      },
      {
        id: 'e6',
        question: 'Coulomb Yasası (elektrik kuvveti) nedir?',
        canonical: 'F = k·q₁·q₂ / d²',
        accepted: ['F=k*q1*q2/d^2','F=kq1q2/d2','F=k*q1*q2/r^2','F = k·q1·q2/d²'],
        hint: 'k ≈ 9×10⁹ N·m²/C², d: yükler arası mesafe'
      },
      {
        id: 'e7',
        question: 'Direnç-boyut ilişkisi nedir?',
        canonical: 'R = ρ·l / A',
        accepted: ['R=rho*l/A','R=p*l/S','R=ro*l/A','R=ρ*l/A','R = ρ·l/A'],
        hint: 'ρ: özdirenç, l: tel boyu, A: kesit alanı'
      }
    ]
  },
  {
    id: 'dalgalar',
    name: 'Dalgalar & Ses',
    emoji: '🌊',
    color: '#818CF8',
    formulas: [
      {
        id: 'd1',
        question: 'Temel dalga formülü nedir?',
        canonical: 'v = λ·f',
        accepted: ['v=λf','v=lambda*f','v=λ*f','v = λ·f','v=dalga*frekans'],
        hint: 'v: dalga hızı, λ: dalga boyu, f: frekans'
      },
      {
        id: 'd2',
        question: 'Dalga boyu formülü nedir?',
        canonical: 'λ = v·T',
        accepted: ['λ=v*T','λ=vT','lambda=v*T','λ = v·T'],
        hint: 'T: periyot (s), v: hız, λ: dalga boyu (m)'
      },
      {
        id: 'd3',
        question: 'Frekans-periyot bağıntısı nedir?',
        canonical: 'f = 1 / T',
        accepted: ['f=1/T','f=1/t','T=1/f','f*T=1','frekans=1/periyot'],
        hint: 'f: frekans (Hz), T: periyot (s)'
      },
      {
        id: 'd4',
        question: 'Yay dalgalarında hız formülü nedir?',
        canonical: 'v = √(F/μ)',
        accepted: ['v=sqrt(F/mu)','v=√(F/μ)','v=sqrt(F/m)','v=(F/u)^0.5'],
        hint: 'F: yaydaki gerilme kuvveti, μ: birim uzunluk kütlesi'
      }
    ]
  },
  {
    id: 'optik',
    name: 'Optik & Işık',
    emoji: '🔭',
    color: '#F472B6',
    formulas: [
      {
        id: 'o1',
        question: 'Işığın kırılma indisi formülü nedir?',
        canonical: 'n = c / v',
        accepted: ['n=c/v','n = c/v'],
        hint: 'c: boşluktaki ışık hızı, v: ortamdaki hız'
      },
      {
        id: 'o2',
        question: 'Snell Kırılma Kanunu nedir?',
        canonical: 'n₁·sin(θ₁) = n₂·sin(θ₂)',
        accepted: ['n1*sin(t1)=n2*sin(t2)','n1sin(t1)=n2sin(t2)','n1sina=n2sinb','n1·sin(θ1)=n2·sin(θ2)'],
        hint: 'θ: kırılma açısı, n: kırılma indisi'
      },
      {
        id: 'o3',
        question: 'Aydınlanma şiddeti formülü nedir?',
        canonical: 'E = I / d²',
        accepted: ['E=I/d^2','E=I/d2','E = I/d²','E=I/r2'],
        hint: 'I: ışık şiddeti (kandela), d: uzaklık'
      },
      {
        id: 'o4',
        question: 'İnce mercek formülü nedir?',
        canonical: '1/f = 1/u + 1/v',
        accepted: ['1/f=1/u+1/v','1/f=1/d1+1/d2','1/f=1/do+1/di'],
        hint: 'f: odak uzaklığı, u: nesne uzaklığı, v: görüntü uzaklığı'
      }
    ]
  },
  {
    id: 'bhh',
    name: 'Basit Harmonik Hareket',
    emoji: '〰️',
    color: '#10B981',
    formulas: [
      {
        id: 'b1',
        question: 'Yay sarkaç periyotu formülü nedir?',
        canonical: 'T = 2π·√(m/k)',
        accepted: ['T=2pi*sqrt(m/k)','T=2π√(m/k)','T=2π*sqrt(m/k)','T = 2π·√(m/k)'],
        hint: 'm: kütle, k: yay sabiti (s)'
      },
      {
        id: 'b2',
        question: 'Basit sarkaç periyotu formülü nedir?',
        canonical: 'T = 2π·√(L/g)',
        accepted: ['T=2pi*sqrt(L/g)','T=2π√(L/g)','T=2π*sqrt(L/g)','T = 2π·√(L/g)'],
        hint: 'L: ip uzunluğu, g: yerçekimi ivmesi'
      },
      {
        id: 'b3',
        question: 'BHH\'de maksimum hız formülü nedir?',
        canonical: 'vₘₐₓ = ω·A',
        accepted: ['vmax=w*A','vmax=ω*A','vmax=omega*A','vmax = ω·A'],
        hint: 'ω: açısal frekans, A: genlik (maksimum uzanım)'
      },
      {
        id: 'b4',
        question: 'BHH\'de geri çağırıcı kuvvet nedir?',
        canonical: 'F = -k·x',
        accepted: ['F=-kx','F=-k*x','F=-k.x','F = -k·x'],
        hint: 'x: denye konumundan uzaklık, k: yay sabiti'
      }
    ]
  }
];

// ============================================================================
// Normalize fonksiyonu: kullanıcı cevabını karşılaştırma için temizle
// ============================================================================
function normalizeAnswer(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/×/g, '*')
    .replace(/·/g, '*')
    .replace(/÷/g, '/')
    .replace(/delta/g, 'Δ')
    .replace(/sqrt/g, '√')
    .replace(/pi/g, 'π')
    .replace(/omega/g, 'ω')
    .replace(/rho/g, 'ρ')
    .replace(/lambda/g, 'λ')
    .replace(/theta/g, 'θ')
    .replace(/sigma/g, 'σ')
    .replace(/mu/g, 'μ')
    .replace(/alpha/g, 'α')
    .replace(/beta/g, 'β')
    .replace(/eta/g, 'η')
    .replace(/tau/g, 'τ')
    // normalize subscripts/superscripts
    .replace(/₀/g, '0').replace(/₁/g, '1').replace(/₂/g, '2').replace(/ₖ/g, 'k')
    .replace(/ₑ/g, 'e').replace(/ₚ/g, 'p').replace(/ₘ/g, 'm').replace(/ᵧ/g, 'y')
    .replace(/²/g, '2').replace(/³/g, '3')
    .replace(/\^2/g, '2').replace(/\^3/g, '3')
    .replace(/½/g, '0.5').replace(/¼/g, '0.25')
    .replace(/[.,]/g, '')
    .replace(/vort/g, 'v')
    .replace(/fnet/g, 'f').replace(/fsup/g, 'f')
    .replace(/eş/g, 'e').replace(/req/g, 're').replace(/res/g, 're')
    .trim();
}

function checkAnswer(userInput: string, formula: PhysicsFormula): boolean {
  const normalized = normalizeAnswer(userInput);
  if (!normalized) return false;
  const allAccepted = [formula.canonical, ...formula.accepted].map(normalizeAnswer);
  return allAccepted.some((accepted) => {
    // Exact match
    if (normalized === accepted) return true;
    // Partial inclusion (e.g., full formula entered with extra context)
    if (accepted.includes(normalized) && normalized.length >= 3) return true;
    // Strip spaces and compare key operators
    return false;
  });
}

// ============================================================================
// Main Component
// ============================================================================

interface FormulaGameViewProps {
  isDesktop?: boolean;
}

export function FormulaGameView({ isDesktop }: FormulaGameViewProps) {
  const [phase, setPhase] = useState<'setup' | 'game' | 'results'>('setup');
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>(['hareket', 'kuvvet', 'is_enerji', 'elektrik']);
  const [questionOrder, setQuestionOrder] = useState<{ groupId: string; formulaId: string }[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [results, setResults] = useState<{ formulaId: string; correct: boolean }[]>([]);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const allFormulas = useMemo(() => {
    return PHYSICS_FORMULA_GROUPS
      .filter((g) => selectedTopicIds.includes(g.id))
      .flatMap((g) => g.formulas.map((f) => ({ groupId: g.id, formulaId: f.id })));
  }, [selectedTopicIds]);

  const getFormula = useCallback((groupId: string, formulaId: string): PhysicsFormula | undefined => {
    return PHYSICS_FORMULA_GROUPS.find((g) => g.id === groupId)?.formulas.find((f) => f.id === formulaId);
  }, []);

  const getGroup = useCallback((groupId: string) => {
    return PHYSICS_FORMULA_GROUPS.find((g) => g.id === groupId);
  }, []);

  const startGame = () => {
    if (allFormulas.length === 0) return;
    // Shuffle
    const shuffled = [...allFormulas].sort(() => Math.random() - 0.5);
    setQuestionOrder(shuffled);
    setCurrentIdx(0);
    setUserInput('');
    setSubmitted(false);
    setIsCorrect(false);
    setResults([]);
    setShowHint(false);
    setPhase('game');
  };

  const currentEntry = questionOrder[currentIdx];
  const currentFormula = currentEntry ? getFormula(currentEntry.groupId, currentEntry.formulaId) : undefined;
  const currentGroup = currentEntry ? getGroup(currentEntry.groupId) : undefined;

  const handleSubmit = () => {
    if (!currentFormula || !userInput.trim()) return;
    const correct = checkAnswer(userInput, currentFormula);
    setIsCorrect(correct);
    setSubmitted(true);
    setResults((prev) => [...prev, { formulaId: currentFormula.id, correct }]);
  };

  const handleNext = () => {
    if (currentIdx >= questionOrder.length - 1) {
      setPhase('results');
    } else {
      setCurrentIdx((i) => i + 1);
      setUserInput('');
      setSubmitted(false);
      setIsCorrect(false);
      setShowHint(false);
    }
  };

  const handlePrev = () => {
    if (currentIdx <= 0) return;
    setCurrentIdx((i) => i - 1);
    setUserInput('');
    setSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
  };

  useEffect(() => {
    if (phase === 'game' && !submitted) {
      inputRef.current?.focus();
    }
  }, [phase, currentIdx, submitted]);

  const correctCount = results.filter((r) => r.correct).length;
  const successPct = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;

  // ---- SETUP PHASE ----
  if (phase === 'setup') {
    return (
      <div style={{ padding: isDesktop ? '0 0 40px 0' : '0 16px 40px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(26, 30, 40, 0.85) 0%, rgba(13, 15, 22, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderTop: '1.5px solid rgba(255, 255, 255, 0.28)',
            borderRadius: 22,
            padding: '24px 26px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #1e3a5f 0%, #0a1e36 100%)',
                border: '1.5px solid rgba(56, 189, 248, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)'
              }}
            >
              ⚛️
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0, color: '#FFFFFF', letterSpacing: -0.4 }}>
                Fizik Formül Düellosu
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.5)', margin: '4px 0 0 0' }}>
                Konu seç → Formülü yaz → Skoru gör
              </p>
            </div>
          </div>
        </div>

        {/* Topic Selection */}
        <div
          style={{
            background: 'rgba(17, 19, 27, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 20,
            padding: '22px 24px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Settings size={16} color="rgba(255, 255, 255, 0.5)" />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>Konuları Seç</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setSelectedTopicIds(PHYSICS_FORMULA_GROUPS.map((g) => g.id))}
                style={{
                  cursor: 'pointer',
                  padding: '5px 14px',
                  borderRadius: 9999,
                  fontSize: 11.5,
                  fontWeight: 700,
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38BDF8'
                }}
              >
                Hepsini Seç
              </button>
              <button
                onClick={() => setSelectedTopicIds([])}
                style={{
                  cursor: 'pointer',
                  padding: '5px 14px',
                  borderRadius: 9999,
                  fontSize: 11.5,
                  fontWeight: 700,
                  background: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}
              >
                Temizle
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {PHYSICS_FORMULA_GROUPS.map((group) => {
              const isSelected = selectedTopicIds.includes(group.id);
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => {
                    setSelectedTopicIds((prev) =>
                      isSelected ? prev.filter((id) => id !== group.id) : [...prev, group.id]
                    );
                  }}
                  style={{
                    cursor: 'pointer',
                    padding: '12px 16px',
                    borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: isSelected ? `${group.color}18` : 'rgba(22, 25, 35, 0.75)',
                    border: isSelected ? `1.5px solid ${group.color}` : '1.5px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isSelected ? `0 0 16px ${group.color}30` : 'none',
                    transition: 'all 0.15s ease',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: 22 }}>{group.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)' }}>
                      {group.name}
                    </div>
                    <div style={{ fontSize: 11, color: isSelected ? group.color : 'rgba(255, 255, 255, 0.4)', marginTop: 2 }}>
                      {group.formulas.length} formül
                    </div>
                  </div>
                  {isSelected && (
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: group.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Check size={12} color="#000" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary + Start */}
        <div
          style={{
            background: 'rgba(17, 19, 27, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 20,
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap'
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>
              {allFormulas.length} Formül Seçildi
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.5)', marginTop: 2 }}>
              {selectedTopicIds.length} konu • Rastgele sırada sorulacak
            </div>
          </div>
          <button
            onClick={startGame}
            disabled={allFormulas.length === 0}
            style={{
              cursor: allFormulas.length === 0 ? 'not-allowed' : 'pointer',
              padding: '14px 36px',
              borderRadius: 9999,
              fontSize: 15,
              fontWeight: 800,
              background: allFormulas.length === 0
                ? 'rgba(255, 255, 255, 0.07)'
                : 'linear-gradient(135deg, #38BDF8 0%, #3B82F6 100%)',
              border: 'none',
              color: allFormulas.length === 0 ? 'rgba(255, 255, 255, 0.3)' : '#FFFFFF',
              boxShadow: allFormulas.length > 0 ? '0 8px 24px rgba(56, 189, 248, 0.4)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}
          >
            <Shuffle size={18} />
            <span>Oyunu Başlat</span>
          </button>
        </div>
      </div>
    );
  }

  // ---- GAME PHASE ----
  if (phase === 'game' && currentFormula && currentGroup) {
    const progress = ((currentIdx) / questionOrder.length) * 100;

    return (
      <div
        style={{
          padding: isDesktop ? '0 0 40px 0' : '0 16px 40px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          minHeight: isDesktop ? undefined : 'calc(100vh - 160px)'
        }}
      >
        {/* Top Bar: Progress info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                padding: '5px 14px',
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 800,
                background: `${currentGroup.color}20`,
                border: `1px solid ${currentGroup.color}60`,
                color: currentGroup.color
              }}
            >
              {currentGroup.emoji} {currentGroup.name}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                padding: '5px 16px',
                borderRadius: 9999,
                fontSize: 12.5,
                fontWeight: 700,
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF'
              }}
            >
              Soru: {currentIdx + 1}/{questionOrder.length}
            </span>
            {results.length > 0 && (
              <span
                style={{
                  padding: '5px 16px',
                  borderRadius: 9999,
                  fontSize: 12.5,
                  fontWeight: 800,
                  background: 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid rgba(56, 189, 248, 0.5)',
                  color: '#38BDF8'
                }}
              >
                Başarı: %{successPct}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: 5,
            borderRadius: 9999,
            background: 'rgba(255, 255, 255, 0.07)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #38BDF8, #3B82F6)',
              borderRadius: 9999,
              transition: 'width 0.3s ease'
            }}
          />
        </div>

        {/* Question Card */}
        <div
          style={{
            background: 'linear-gradient(145deg, rgba(14, 20, 32, 0.95) 0%, rgba(10, 14, 24, 0.98) 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.14)',
            borderTop: '2px solid rgba(255, 255, 255, 0.35)',
            borderRadius: 24,
            padding: '36px 32px 32px',
            textAlign: 'center',
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.7), inset 0 1px 2px rgba(255, 255, 255, 0.18)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background Accent */}
          <div
            style={{
              position: 'absolute',
              top: -40,
              right: -20,
              width: 220,
              height: 220,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${currentGroup.color}18 0%, transparent 70%)`,
              pointerEvents: 'none'
            }}
          />

          <h2
            style={{
              fontSize: isDesktop ? 24 : 20,
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.4,
              margin: '0 0 28px 0',
              letterSpacing: -0.3,
              position: 'relative',
              zIndex: 1
            }}
          >
            {currentFormula.question}
          </h2>

          {/* Answer Input + OK Button */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              maxWidth: 540,
              margin: '0 auto 20px auto',
              position: 'relative',
              zIndex: 1
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Cevabınızı veya formülü buraya yazın..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (!submitted) handleSubmit();
                  else handleNext();
                }
              }}
              disabled={submitted}
              style={{
                flex: 1,
                height: 52,
                padding: '0 18px',
                borderRadius: 14,
                background: submitted
                  ? isCorrect ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)'
                  : 'rgba(14, 16, 26, 0.9)',
                border: submitted
                  ? isCorrect ? '2px solid rgba(34, 197, 94, 0.6)' : '2px solid rgba(239, 68, 68, 0.6)'
                  : '1.5px solid rgba(56, 189, 248, 0.45)',
                boxShadow: submitted
                  ? isCorrect ? '0 0 16px rgba(34, 197, 94, 0.2)' : '0 0 16px rgba(239, 68, 68, 0.2)'
                  : '0 0 0 rgba(0,0,0,0)',
                color: '#FFFFFF',
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
            <button
              onClick={submitted ? handleNext : handleSubmit}
              disabled={!submitted && !userInput.trim()}
              style={{
                cursor: !submitted && !userInput.trim() ? 'not-allowed' : 'pointer',
                height: 52,
                padding: '0 24px',
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 800,
                background: submitted
                  ? 'linear-gradient(135deg, #38BDF8, #3B82F6)'
                  : !userInput.trim()
                  ? 'rgba(255, 255, 255, 0.07)'
                  : 'linear-gradient(135deg, #38BDF8, #3B82F6)',
                border: 'none',
                color: !submitted && !userInput.trim() ? 'rgba(255, 255, 255, 0.3)' : '#FFFFFF',
                boxShadow: !submitted && !userInput.trim() ? 'none' : '0 6px 20px rgba(56, 189, 248, 0.35)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {submitted ? 'Sonraki →' : 'OK'}
            </button>
          </div>

          {/* Result Display */}
          {submitted && (
            <div
              style={{
                maxWidth: 540,
                margin: '0 auto',
                padding: '16px 20px',
                borderRadius: 16,
                background: isCorrect ? 'rgba(34, 197, 94, 0.08)' : 'rgba(14, 20, 32, 0.9)',
                border: isCorrect ? '1.5px solid rgba(34, 197, 94, 0.5)' : '1.5px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                zIndex: 1,
                transition: 'all 0.2s ease'
              }}
            >
              {isCorrect ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#22C55E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 0 14px rgba(34, 197, 94, 0.5)'
                    }}
                  >
                    <Check size={16} color="#fff" strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#22C55E' }}>Doğru! Harika!</span>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 10 }}>
                    <X size={18} color="#EF4444" />
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#EF4444' }}>Yanlış cevap</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.45)', marginBottom: 6 }}>
                    Doğru cevap:
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: '#FFFFFF',
                      letterSpacing: 0.5,
                      fontFamily: '"Courier New", Courier, monospace'
                    }}
                  >
                    {currentFormula.canonical}
                  </div>
                  {currentFormula.hint && (
                    <div style={{ fontSize: 11.5, color: 'rgba(255, 255, 255, 0.4)', marginTop: 8 }}>
                      {currentFormula.hint}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Hint toggle (before submission) */}
          {!submitted && (
            <div style={{ marginTop: 14, position: 'relative', zIndex: 1 }}>
              {!showHint ? (
                <button
                  onClick={() => setShowHint(true)}
                  style={{
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    fontSize: 12,
                    color: 'rgba(255, 255, 255, 0.35)',
                    textDecoration: 'underline',
                    textDecorationStyle: 'dotted'
                  }}
                >
                  İpucu Göster
                </button>
              ) : (
                <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.45)', fontStyle: 'italic' }}>
                  💡 {currentFormula.hint}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            style={{
              cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 20px',
              borderRadius: 9999,
              fontSize: 13,
              fontWeight: 700,
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: currentIdx === 0 ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.8)'
            }}
          >
            <ChevronLeft size={16} />
            Önceki Soru
          </button>

          <button
            onClick={() => setPhase('setup')}
            style={{
              cursor: 'pointer',
              padding: '10px 18px',
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'rgba(255, 255, 255, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <RotateCcw size={14} />
            <span>Yeniden Başla</span>
          </button>

          <button
            onClick={handleNext}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 20px',
              borderRadius: 9999,
              fontSize: 13,
              fontWeight: 800,
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38BDF8'
            }}
          >
            Sonraki Soru
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // ---- RESULTS PHASE ----
  if (phase === 'results') {
    return (
      <div style={{ padding: isDesktop ? '0 0 40px 0' : '0 16px 40px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Score Card */}
        <div
          style={{
            background: 'linear-gradient(145deg, rgba(14, 20, 32, 0.98) 0%, rgba(10, 14, 24, 1.0) 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            borderTop: '2px solid rgba(255, 255, 255, 0.4)',
            borderRadius: 24,
            padding: '40px 32px',
            textAlign: 'center',
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.7)'
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>
            {successPct >= 90 ? '🏆' : successPct >= 70 ? '🎯' : successPct >= 50 ? '📚' : '💪'}
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF', margin: '0 0 8px 0' }}>
            Oyun Bitti!
          </h2>
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: successPct >= 70 ? '#22C55E' : successPct >= 50 ? '#FBBF24' : '#EF4444',
              margin: '12px 0',
              lineHeight: 1,
              textShadow: successPct >= 70 ? '0 0 30px rgba(34, 197, 94, 0.5)' : 'none'
            }}
          >
            %{successPct}
          </div>
          <div style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.6)', marginBottom: 24 }}>
            {correctCount} / {results.length} doğru cevap
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={startGame}
              style={{
                cursor: 'pointer',
                padding: '14px 32px',
                borderRadius: 9999,
                fontSize: 15,
                fontWeight: 800,
                background: 'linear-gradient(135deg, #38BDF8, #3B82F6)',
                border: 'none',
                color: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <Shuffle size={18} />
              Tekrar Oyna
            </button>
            <button
              onClick={() => setPhase('setup')}
              style={{
                cursor: 'pointer',
                padding: '14px 28px',
                borderRadius: 9999,
                fontSize: 14,
                fontWeight: 700,
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <Settings size={16} />
              Konu Değiştir
            </button>
          </div>
        </div>

        {/* Per-formula review */}
        <div
          style={{
            background: 'rgba(17, 19, 27, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 20,
            padding: '20px 22px'
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px 0' }}>Soru Detayları</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {questionOrder.map((entry, idx) => {
              const formula = getFormula(entry.groupId, entry.formulaId);
              const group = getGroup(entry.groupId);
              const result = results[idx];
              if (!formula || !group) return null;
              return (
                <div
                  key={`${entry.formulaId}-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: result?.correct ? 'rgba(34, 197, 94, 0.07)' : 'rgba(239, 68, 68, 0.07)',
                    border: result?.correct ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)'
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: result?.correct ? '#22C55E' : '#EF4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {result?.correct ? <Check size={14} color="#fff" strokeWidth={3} /> : <X size={14} color="#fff" strokeWidth={3} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.5)', marginBottom: 2 }}>
                      {group.emoji} {group.name}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {formula.question}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontFamily: '"Courier New", Courier, monospace',
                      flexShrink: 0,
                      maxWidth: 160,
                      textAlign: 'right'
                    }}
                  >
                    {formula.canonical}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
