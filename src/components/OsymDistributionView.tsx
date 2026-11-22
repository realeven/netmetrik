import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ExternalLink,
  ChevronDown,
  Check
} from 'lucide-react';
import {
  OSYM_QUESTION_DISTRIBUTION
} from '../data/osymDistributionData';
import type { OsymSubjectDistribution, OsymTopicItem } from '../data/osymDistributionData';
import type { TopicStatus } from '../data/seedData';
import { sounds } from '../lib/sound';

interface OsymDistributionViewProps {
  topicProgress: Record<string, TopicStatus>;
  onToggleTopicCompleted: (topicKey: string) => void;
  userFieldTrack?: string;
  isDesktop?: boolean;
}

export function OsymDistributionView({
  topicProgress,
  onToggleTopicCompleted,
  userFieldTrack = 'sayisal',
  isDesktop
}: OsymDistributionViewProps) {
  const [selectedExam, setSelectedExam] = useState<'TYT' | 'AYT'>('AYT');
  const [selectedFieldTrack, setSelectedFieldTrack] = useState<'sayisal' | 'esit_agirlik' | 'sozel' | 'all'>('all');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'uncompleted'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSubjects, setCollapsedSubjects] = useState<Record<string, boolean>>({});

  // Sync initial track with user preference if relevant
  useEffect(() => {
    if (userFieldTrack === 'sayisal' || userFieldTrack === 'esit_agirlik' || userFieldTrack === 'sozel') {
      // Keep 'all' as default initial view matching the reference design, or allow user preference
    }
  }, [userFieldTrack]);

  // Available subjects for the active exam category and field track
  const examSubjects = useMemo(() => {
    return OSYM_QUESTION_DISTRIBUTION.filter((s) => {
      if (s.exam !== selectedExam) return false;
      if (selectedExam === 'AYT' && selectedFieldTrack !== 'all') {
        if (!s.fieldTrack || !s.fieldTrack.includes(selectedFieldTrack)) {
          return false;
        }
      }
      return true;
    });
  }, [selectedExam, selectedFieldTrack]);

  // Reset selected subject if not present in active field track
  useEffect(() => {
    if (selectedSubjectCode !== 'all' && !examSubjects.some((s) => s.code === selectedSubjectCode)) {
      setSelectedSubjectCode('all');
    }
  }, [examSubjects, selectedSubjectCode]);

  // Active subjects to render
  const activeSubjects = useMemo(() => {
    if (selectedSubjectCode === 'all') return examSubjects;
    return examSubjects.filter((s) => s.code === selectedSubjectCode);
  }, [examSubjects, selectedSubjectCode]);

  // Overall stats for the selected exam & field track
  const stats = useMemo(() => {
    let totalQuestions = 0;
    let completedTopics = 0;
    let totalTopics = 0;

    examSubjects.forEach((sub) => {
      sub.topics.forEach((t) => {
        totalTopics++;
        totalQuestions += t.total;
        const topicKey = `${sub.code}_${t.topic}`;
        if (topicProgress[topicKey] === 'completed') {
          completedTopics++;
        }
      });
    });

    return {
      totalTopics,
      completedTopics,
      pct: Math.round((completedTopics / (totalTopics || 1)) * 100),
      totalQuestions
    };
  }, [examSubjects, topicProgress]);

  const toggleSubjectCollapse = (code: string) => {
    sounds.playClick();
    setCollapsedSubjects((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  return (
    <div
      style={{
        position: 'relative',
        padding: isDesktop ? '0 0 40px 0' : '0 12px 40px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}
    >
      <style>{`
        .osym-table-row:hover {
          background: rgba(255, 255, 255, 0.035) !important;
        }
        .osym-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .osym-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
        }
      `}</style>

      {/* 🌟 Background Wireframe Low-Poly Geometric Mesh & Spotlight (Exact match from reference photo) */}
      <div
        style={{
          position: 'absolute',
          top: -20,
          right: 0,
          width: 320,
          height: 220,
          background: 'radial-gradient(ellipse 65% 55% at 80% 25%, rgba(255, 255, 255, 0.14) 0%, rgba(56, 189, 248, 0.08) 35%, transparent 75%)',
          pointerEvents: 'none',
          filter: 'blur(12px)',
          zIndex: 0
        }}
      />
      <svg
        style={{
          position: 'absolute',
          top: -10,
          right: 0,
          width: '100%',
          height: 260,
          pointerEvents: 'none',
          overflow: 'hidden',
          opacity: 0.28,
          zIndex: 0
        }}
        viewBox="0 0 1000 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <polygon points="650,0 780,70 890,20 1000,80 1000,0" stroke="rgba(255, 255, 255, 0.24)" strokeWidth="1" fill="rgba(255, 255, 255, 0.02)" />
        <polygon points="520,0 650,0 780,70 680,120 560,60" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1" fill="rgba(255, 255, 255, 0.015)" />
        <polygon points="780,70 890,20 1000,80 970,160 840,150" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1" fill="rgba(255, 255, 255, 0.02)" />
        <polygon points="680,120 780,70 840,150 770,220 640,190" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="1" fill="rgba(255, 255, 255, 0.01)" />
        <polygon points="840,150 970,160 1000,240 890,260 770,220" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" fill="rgba(255, 255, 255, 0.015)" />
        <circle cx="780" cy="70" r="2.5" fill="#FFFFFF" opacity="0.6" />
        <circle cx="890" cy="20" r="2.5" fill="#FFFFFF" opacity="0.6" />
        <circle cx="680" cy="120" r="2" fill="#FFFFFF" opacity="0.4" />
        <circle cx="840" cy="150" r="2.5" fill="#FFFFFF" opacity="0.5" />
      </svg>

      {/* 🌟 1. Header Banner Card */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(26, 30, 40, 0.8) 0%, rgba(13, 15, 22, 0.92) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderTop: '1.5px solid rgba(255, 255, 255, 0.25)',
          borderRadius: isDesktop ? 22 : 18,
          padding: isDesktop ? '24px 26px' : '14px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: isDesktop ? 16 : 10,
          boxShadow: '0 16px 45px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          zIndex: 1
        }}
      >
        <div style={{ maxWidth: 620, flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 900,
                textTransform: 'uppercase',
                padding: '3px 8px',
                borderRadius: 6,
                background: 'rgba(85, 115, 30, 0.45)',
                border: '1px solid rgba(175, 225, 60, 0.45)',
                color: '#D4FF00',
                letterSpacing: 0.5
              }}
            >
              {selectedExam === 'TYT' ? 'MEB 2018–2025 RESMİ TYT' : 'MEB 2018–2025 RESMİ AYT'}
            </span>
            <a
              href={
                selectedExam === 'TYT'
                  ? 'https://reyhanlisfkasml.meb.k12.tr/meb_iys_dosyalar/31/08/963209/dosyalar/2025_12/694bcadab4eec921652162_2025TYT_Y%C4%B1llara_Gore_Soru_Dag%C4%B1l%C4%B1m%C4%B1.pdf'
                  : 'https://reyhanlisfkasml.meb.k12.tr/meb_iys_dosyalar/31/08/963209/dosyalar/2025_12/694bcaf0da32d183108646_2025AYT_Y%C4%B1llara_Gore_Soru_Dag%C4%B1l%C4%B1m%C4%B1.pdf'
              }
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 11,
                color: 'rgba(255, 255, 255, 0.55)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <span>MEB Kaynak (PDF)</span>
              <ExternalLink size={11} color="rgba(255, 255, 255, 0.45)" />
            </a>
          </div>
          <h2 style={{ fontSize: isDesktop ? 22 : 16, fontWeight: 800, margin: '4px 0', color: '#FFFFFF', letterSpacing: -0.4 }}>
            ÖSYM YKS Konu ve Soru Dağılımı Tablosu
          </h2>
          <p style={{ fontSize: isDesktop ? 13 : 11.5, color: 'rgba(255, 255, 255, 0.55)', margin: 0, lineHeight: 1.4 }}>
            ÖSYM çıkmış sorular analizine göre hazırlanan tablolar. Bitirdiğiniz konuların solundaki kutucuğa tıklayarak <strong>tik koyabilirsiniz</strong>.
          </p>
        </div>

        {/* 🌟 Liquid Glass KPI Widget (Top Right) */}
        <div
          style={{
            position: 'relative',
            width: isDesktop ? 'auto' : '100%',
            minWidth: isDesktop ? 185 : 'auto',
            borderRadius: 14,
            padding: isDesktop ? '14px 22px' : '10px 14px',
            background: 'linear-gradient(135deg, rgba(140, 195, 255, 0.22) 0%, rgba(35, 75, 125, 0.35) 45%, rgba(12, 20, 36, 0.85) 100%)',
            border: '1.5px solid rgba(160, 215, 255, 0.45)',
            borderTop: '2px solid rgba(255, 255, 255, 0.7)',
            boxShadow: '0 12px 32px rgba(0, 160, 255, 0.16), inset 0 1px 2px rgba(255, 255, 255, 0.5), inset 0 -1px 2px rgba(0, 0, 0, 0.5)',
            textAlign: 'center',
            backdropFilter: 'blur(16px)',
            userSelect: 'none',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              fontSize: isDesktop ? 10.5 : 9.5,
              fontWeight: 800,
              color: 'rgba(210, 235, 255, 0.95)',
              letterSpacing: 0.6,
              textTransform: 'uppercase'
            }}
          >
            {selectedExam === 'AYT'
              ? selectedFieldTrack === 'sayisal'
                ? 'AYT SAYISAL TAMAMLAMA'
                : selectedFieldTrack === 'esit_agirlik'
                  ? 'AYT EŞİT AĞIRLIK TAMAMLAMA'
                  : selectedFieldTrack === 'sozel'
                    ? 'AYT SÖZEL TAMAMLAMA'
                    : 'AYT GENEL TAMAMLAMA'
              : 'TYT GENEL TAMAMLAMA'}
          </div>
          <div
            style={{
              fontSize: isDesktop ? 32 : 22,
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.1,
              margin: '3px 0 1px 0',
              fontFamily: 'var(--font-mono, inherit)',
              textShadow: '0 0 20px rgba(56, 189, 248, 0.6)'
            }}
          >
            %{stats.pct}
          </div>
          <div style={{ fontSize: isDesktop ? 11 : 10, color: 'rgba(200, 230, 255, 0.75)' }}>
            {stats.completedTopics} / {stats.totalTopics} Konu Tiklendi
          </div>
        </div>
      </div>

      {/* 🌟 2. Big Segmented Toggle Buttons (TYT vs AYT Soru Dağılımı Tabloları) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isDesktop ? 12 : 8, zIndex: 1 }}>
          {/* TYT Button */}
          <button
            type="button"
            onClick={() => {
              sounds.playTabSwitch();
              setSelectedExam('TYT');
              setSelectedSubjectCode('all');
            }}
            style={{
              cursor: 'pointer',
              height: isDesktop ? 52 : 42,
              borderRadius: 9999,
              border: selectedExam === 'TYT' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
              background: selectedExam === 'TYT' ? '#FFFFFF' : 'rgba(28, 30, 38, 0.75)',
              color: selectedExam === 'TYT' ? '#0A0C10' : 'rgba(255, 255, 255, 0.45)',
              fontSize: isDesktop ? 14.5 : 12,
              fontWeight: selectedExam === 'TYT' ? 800 : 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: selectedExam === 'TYT' ? '0 6px 25px rgba(255, 255, 255, 0.2)' : 'none',
              transition: 'all 0.18s ease'
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: selectedExam === 'TYT' ? '#0284C7' : 'rgba(255, 255, 255, 0.3)'
              }}
            />
            <span>{isDesktop ? 'TYT Soru Dağılımı Tabloları' : 'TYT Tabloları'}</span>
          </button>

          {/* AYT Button */}
          <button
            type="button"
            onClick={() => {
              sounds.playTabSwitch();
              setSelectedExam('AYT');
              setSelectedSubjectCode('all');
            }}
            style={{
              cursor: 'pointer',
              height: isDesktop ? 52 : 42,
              borderRadius: 9999,
              border: selectedExam === 'AYT' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
              background: selectedExam === 'AYT' ? '#FFFFFF' : 'rgba(28, 30, 38, 0.75)',
              color: selectedExam === 'AYT' ? '#0A0C10' : 'rgba(255, 255, 255, 0.45)',
              fontSize: isDesktop ? 14.5 : 12,
              fontWeight: selectedExam === 'AYT' ? 800 : 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: selectedExam === 'AYT' ? '0 6px 25px rgba(255, 255, 255, 0.2)' : 'none',
              transition: 'all 0.18s ease'
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
              background: selectedExam === 'AYT' ? '#D946EF' : 'rgba(255, 255, 255, 0.3)'
              }}
            />
            <span>{isDesktop ? 'AYT Soru Dağılımı Tabloları' : 'AYT Tabloları'}</span>
          </button>
        </div>

        {/* 🌟 3. Track / Field Filter Bar ("🎯 Alanını Seç:") */}
        {selectedExam === 'AYT' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: isDesktop ? 12 : 8, flexWrap: 'wrap', zIndex: 1 }}>
            <span style={{ fontSize: isDesktop ? 13 : 11.5, fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 6 }}>
              🎯 Alanını Seç:
            </span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { id: 'sayisal', label: '▲ Sayısal (MF)' },
                { id: 'esit_agirlik', label: '⚖️ Eşit Ağırlık (TM)' },
                { id: 'sozel', label: '📚 Sözel (TS)' },
                { id: 'all', label: '🌐 Tüm Dersler' }
              ].map((track) => {
                const isActive = selectedFieldTrack === track.id;
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedFieldTrack(track.id as any);
                      setSelectedSubjectCode('all');
                    }}
                    style={{
                      cursor: 'pointer',
                      padding: isDesktop ? '7px 18px' : '5px 11px',
                      borderRadius: 9999,
                      fontSize: isDesktop ? 12.5 : 11,
                      fontWeight: isActive ? 800 : 600,
                      background: isActive
                        ? 'rgba(14, 165, 233, 0.22)'
                        : 'rgba(24, 27, 36, 0.75)',
                      border: isActive
                        ? '1px solid rgba(56, 189, 248, 0.65)'
                        : '1px solid rgba(255, 255, 255, 0.12)',
                      color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.85)',
                      boxShadow: isActive ? '0 0 18px rgba(56, 189, 248, 0.35)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {track.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 🌟 4. Subject Tabs Row */}
        <div className="osym-scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, zIndex: 1, WebkitOverflowScrolling: 'touch' }}>
          {/* Tüm Dersler */}
          <button
            type="button"
            onClick={() => setSelectedSubjectCode('all')}
            style={{
              cursor: 'pointer',
              padding: isDesktop ? '7px 18px' : '5px 12px',
              borderRadius: 9999,
              fontSize: isDesktop ? 12.5 : 11,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              background: selectedSubjectCode === 'all' ? '#252834' : 'rgba(20, 23, 32, 0.65)',
              border: selectedSubjectCode === 'all' ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
              color: selectedSubjectCode === 'all' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
              transition: 'all 0.15s ease'
            }}
          >
            Tüm Dersler ({examSubjects.length})
          </button>

          {/* Individual Subject Pills */}
          {examSubjects.map((sub) => {
            const isActive = selectedSubjectCode === sub.code;
            return (
              <button
                key={sub.code}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedSubjectCode(isActive ? 'all' : sub.code);
                }}
                style={{
                  cursor: 'pointer',
                  padding: isDesktop ? '7px 16px' : '5px 12px',
                  borderRadius: 9999,
                  fontSize: isDesktop ? 12.5 : 11,
                  fontWeight: isActive ? 800 : 600,
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: isActive ? `${sub.color}25` : 'rgba(20, 23, 32, 0.65)',
                  border: isActive ? `1px solid ${sub.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)',
                  boxShadow: isActive ? `0 0 14px ${sub.color}40` : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: sub.color,
                    display: 'inline-block'
                  }}
                />
                <span>{sub.name}</span>
              </button>
            );
          })}
        </div>

        {/* 🌟 5. Search Bar & Status Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, zIndex: 1 }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={17}
              color="rgba(255, 255, 255, 0.4)"
              style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Tabloda konu veya ünite ara (ör. paragraf, fonksiyon, modern atom, kalıtım)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: 46,
                padding: '0 20px 0 48px',
                borderRadius: 9999,
                background: 'rgba(14, 16, 24, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
                color: '#FFFFFF',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Status Filter Buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              style={{
                cursor: 'pointer',
                padding: '7px 20px',
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: statusFilter === 'all' ? 800 : 600,
                background: statusFilter === 'all' ? '#FFFFFF' : 'rgba(22, 25, 34, 0.75)',
                border: statusFilter === 'all' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                color: statusFilter === 'all' ? '#0A0C10' : 'rgba(255, 255, 255, 0.85)',
                boxShadow: statusFilter === 'all' ? '0 4px 16px rgba(255, 255, 255, 0.2)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Tümü
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed');
              }}
              style={{
                cursor: 'pointer',
                padding: '7px 18px',
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: statusFilter === 'completed' ? 800 : 600,
                background: statusFilter === 'completed' ? '#FFFFFF' : 'rgba(22, 25, 34, 0.75)',
                border: statusFilter === 'completed' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                color: statusFilter === 'completed' ? '#0A0C10' : 'rgba(255, 255, 255, 0.85)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s ease'
              }}
            >
              <Check size={14} color={statusFilter === 'completed' ? '#0A0C10' : '#22C55E'} strokeWidth={3} />
              <span>Bitirdiğim Konular</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setStatusFilter(statusFilter === 'uncompleted' ? 'all' : 'uncompleted');
              }}
              style={{
                cursor: 'pointer',
                padding: '7px 18px',
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: statusFilter === 'uncompleted' ? 800 : 600,
                background: statusFilter === 'uncompleted' ? '#FFFFFF' : 'rgba(22, 25, 34, 0.75)',
                border: statusFilter === 'uncompleted' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                color: statusFilter === 'uncompleted' ? '#0A0C10' : 'rgba(255, 255, 255, 0.85)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s ease'
              }}
            >
              <span>⏳</span>
              <span>Henüz Bitirmediklerim</span>
            </button>
          </div>
        </div>

        {/* 🌟 6. Tables List (Subject by Subject) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, zIndex: 1 }}>
          {activeSubjects.map((subject: OsymSubjectDistribution) => {
            // Filter topics of this subject
            const filteredTopics = subject.topics.filter((t: OsymTopicItem) => {
              const topicKey = `${subject.code}_${t.topic}`;
              const isCompleted = topicProgress[topicKey] === 'completed';

              if (statusFilter === 'completed' && !isCompleted) return false;
              if (statusFilter === 'uncompleted' && isCompleted) return false;

              if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matches =
                  t.topic.toLowerCase().includes(q) ||
                  (t.unit && t.unit.toLowerCase().includes(q)) ||
                  subject.name.toLowerCase().includes(q);
                if (!matches) return false;
              }

              return true;
            });

            if (filteredTopics.length === 0 && searchQuery) return null;

            const isCollapsed = !!collapsedSubjects[subject.code];
            const completedInSub = subject.topics.filter(
              (t) => topicProgress[`${subject.code}_${t.topic}`] === 'completed'
            ).length;

            const subjectYears = subject.years && subject.years.length > 0 ? subject.years : ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];

            // Compute column sums for this subject table
            const columnSums: Record<string, number> = {};
            subjectYears.forEach((yr) => {
              columnSums[yr] = filteredTopics.reduce((sum, t) => sum + (t.yearly[yr] || 0), 0);
            });
            const totalTableSum = filteredTopics.reduce((sum, t) => sum + t.total, 0);
            const subPct = Math.round((completedInSub / (subject.topics.length || 1)) * 100);

            return (
              <div
                key={subject.code}
                style={{
                  background: 'rgba(17, 19, 27, 0.85)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 20,
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden'
                }}
              >
                {/* Subject Table Header Bar */}
                <div
                  onClick={() => toggleSubjectCollapse(subject.code)}
                  style={{
                    padding: isDesktop ? '16px 22px' : '11px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(25, 28, 38, 0.45)',
                    borderBottom: isCollapsed ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    userSelect: 'none',
                    gap: isDesktop ? 16 : 8
                  }}
                >
                  {/* Left: Indicator dot + titles */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: isDesktop ? 12 : 8, minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: '50%',
                        background: subject.color || '#22C55E',
                        boxShadow: `0 0 10px ${subject.color || '#22C55E'}`,
                        flexShrink: 0
                      }}
                    />
                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                      <h3 style={{ fontSize: isDesktop ? 16.5 : 13.5, fontWeight: 800, margin: 0, color: '#FFFFFF', letterSpacing: -0.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {subject.name} Soru Dağılımı Tablosu
                      </h3>
                      <div style={{ fontSize: isDesktop ? 11.5 : 10, color: 'rgba(255, 255, 255, 0.45)', marginTop: 2 }}>
                        {completedInSub}/{subject.topics.length} Konu • {totalTableSum} Soru
                      </div>
                    </div>
                  </div>

                  {/* Middle & Right: Progress bar track, % percent, Chevron */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: isDesktop ? 12 : 6, flexShrink: 0, justifyContent: 'flex-end' }}>
                    {/* Progress Bar Track */}
                    <div
                      style={{
                        width: isDesktop ? 160 : 54,
                        height: isDesktop ? 10 : 7,
                        borderRadius: 9999,
                        background: 'rgba(0, 0, 0, 0.55)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      <div
                        style={{
                          width: `${subPct}%`,
                          height: '100%',
                          borderRadius: 9999,
                          background: 'linear-gradient(90deg, #38BDF8 0%, #60A5FA 100%)',
                          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 0 8px rgba(56, 189, 248, 0.4)',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>

                    {/* Percentage */}
                    <span
                      style={{
                        fontSize: isDesktop ? 14 : 12,
                        fontWeight: 800,
                        color: '#38BDF8',
                        minWidth: 32,
                        textAlign: 'right'
                      }}
                    >
                      %{subPct}
                    </span>

                    {/* Chevron Icon */}
                    <ChevronDown
                      size={isDesktop ? 18 : 16}
                      color="rgba(255, 255, 255, 0.5)"
                      style={{
                        transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0
                      }}
                    />
                  </div>
                </div>

                {/* The Table */}
                {!isCollapsed && (
                  <div className="osym-scroll" style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: isDesktop ? 12.5 : 11,
                        textAlign: 'left',
                        minWidth: isDesktop ? 780 : 520
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            background: 'rgba(11, 13, 19, 0.95)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontWeight: 700,
                            fontSize: isDesktop ? 11.5 : 10,
                            height: isDesktop ? 40 : 34
                          }}
                        >
                          <th style={{ padding: isDesktop ? '10px 14px' : '7px 8px', width: isDesktop ? 48 : 36, textAlign: 'center' }}>Tik</th>
                          <th style={{ padding: isDesktop ? '10px 16px' : '7px 10px' }}>Konu Adı</th>
                          {subjectYears.map((yr) => (
                            <th key={yr} style={{ padding: isDesktop ? '10px 8px' : '7px 4px', textAlign: 'center', width: isDesktop ? 44 : 32, fontSize: isDesktop ? 11 : 10 }}>
                              {yr}
                            </th>
                          ))}
                          <th
                            style={{
                              padding: isDesktop ? '10px 20px' : '7px 10px',
                              textAlign: 'right',
                              width: isDesktop ? 62 : 44,
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontWeight: 800
                            }}
                          >
                            Toplam
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTopics.length === 0 ? (
                          <tr>
                            <td
                              colSpan={subjectYears.length + 3}
                              style={{
                                padding: '30px',
                                textAlign: 'center',
                                color: 'rgba(255, 255, 255, 0.4)'
                              }}
                            >
                              Bu filtreye uygun konu bulunamadı.
                            </td>
                          </tr>
                        ) : (
                          filteredTopics.map((topicItem, idx) => {
                            const topicKey = `${subject.code}_${topicItem.topic}`;
                            const isCompleted = topicProgress[topicKey] === 'completed';

                            return (
                              <tr
                                key={topicKey}
                                style={{
                                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                                  background: isCompleted
                                    ? 'rgba(34, 197, 94, 0.035)'
                                    : idx % 2 === 1
                                      ? 'rgba(255, 255, 255, 0.015)'
                                      : 'transparent',
                                  transition: 'background 0.15s ease',
                                  height: 46
                                }}
                                className="osym-table-row"
                              >
                                {/* Tik Column */}
                                <td style={{ padding: '8px 14px', textAlign: 'center', verticalAlign: 'middle' }}>
                                  <button
                                    type="button"
                                    onClick={() => onToggleTopicCompleted(topicKey)}
                                    title={
                                      isCompleted
                                        ? 'Bitirildi (kaldırmak için tıklayın)'
                                        : 'Bu konuyu bitirdim olarak işaretle'
                                    }
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      cursor: 'pointer',
                                      padding: 0,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      outline: 'none',
                                      transition: 'transform 0.1s ease'
                                    }}
                                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.85)')}
                                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                  >
                                    {isCompleted ? (
                                      <div
                                        style={{
                                          width: 18,
                                          height: 18,
                                          borderRadius: '50%',
                                          background: '#22C55E',
                                          border: '1.5px solid #22C55E',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          boxShadow: '0 0 8px rgba(34, 197, 94, 0.4)'
                                        }}
                                      >
                                        <Check size={11} color="#FFFFFF" strokeWidth={3.5} />
                                      </div>
                                    ) : (
                                      <div
                                        style={{
                                          width: 18,
                                          height: 18,
                                          borderRadius: '50%',
                                          border: '1.5px solid rgba(255, 255, 255, 0.25)',
                                          transition: 'border-color 0.15s ease'
                                        }}
                                      />
                                    )}
                                  </button>
                                </td>

                                {/* Topic Name & Unit */}
                                <td style={{ padding: isDesktop ? '8px 16px' : '7px 8px', verticalAlign: 'middle' }}>
                                  <span
                                    style={{
                                      fontSize: isDesktop ? 13.5 : 11.5,
                                      fontWeight: isCompleted ? 600 : 700,
                                      color: isCompleted ? 'rgba(255, 255, 255, 0.45)' : '#FFFFFF',
                                      textDecoration: isCompleted ? 'line-through' : 'none'
                                    }}
                                  >
                                    {topicItem.topic}
                                  </span>
                                  {topicItem.unit && (
                                    <span style={{ fontSize: isDesktop ? 11 : 9.5, color: 'rgba(255, 255, 255, 0.35)', marginLeft: 6 }}>
                                      ({topicItem.unit})
                                    </span>
                                  )}
                                </td>

                                {/* Years Columns */}
                                {subjectYears.map((yr) => {
                                  const count = topicItem.yearly[yr] || 0;
                                  return (
                                    <td
                                      key={yr}
                                      style={{
                                        padding: isDesktop ? '8px 8px' : '6px 4px',
                                        textAlign: 'center',
                                        verticalAlign: 'middle',
                                        fontFamily: 'var(--font-mono, inherit)',
                                        fontWeight: count > 0 ? 700 : 400,
                                        fontSize: isDesktop ? 12.5 : 10.5,
                                        color: count > 0 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.18)'
                                      }}
                                    >
                                      {count > 0 ? count : '—'}
                                    </td>
                                  );
                                })}

                                {/* Total Column */}
                                <td
                                  style={{
                                    padding: isDesktop ? '8px 20px' : '6px 10px',
                                    textAlign: 'right',
                                    verticalAlign: 'middle',
                                    fontWeight: 800,
                                    fontSize: isDesktop ? 13 : 11,
                                    fontFamily: 'var(--font-mono, inherit)',
                                    color: topicItem.total > 0 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.25)'
                                  }}
                                >
                                  {topicItem.total}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>

                      {/* Table Summary Footer Row */}
                      {filteredTopics.length > 0 && (
                        <tfoot>
                          <tr
                            style={{
                              background: 'rgba(11, 13, 19, 0.95)',
                              borderTop: '1.5px solid rgba(255, 255, 255, 0.1)',
                              fontWeight: 800,
                              fontSize: 12,
                              height: 44
                            }}
                          >
                            <td style={{ padding: '12px 14px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.4)' }}>∑</td>
                            <td style={{ padding: '12px 16px', color: '#FFFFFF' }}>
                              {subject.name} Toplam Soru Sayısı
                            </td>
                            {subjectYears.map((yr) => (
                              <td
                                key={yr}
                                style={{
                                  padding: '12px 8px',
                                  textAlign: 'center',
                                  fontFamily: 'var(--font-mono, inherit)',
                                  color: columnSums[yr] > 0 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.25)',
                                  fontWeight: columnSums[yr] > 0 ? 700 : 400
                                }}
                              >
                                {columnSums[yr] || '—'}
                              </td>
                            ))}
                            <td
                              style={{
                                padding: '12px 20px',
                                textAlign: 'right',
                                fontFamily: 'var(--font-mono, inherit)',
                                color: '#FFFFFF',
                                fontSize: 14,
                                fontWeight: 900
                              }}
                            >
                              {totalTableSum}
                            </td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      );
}
