import { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Search,
  ExternalLink,
  ChevronDown
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
  const [selectedFieldTrack, setSelectedFieldTrack] = useState<'sayisal' | 'esit_agirlik' | 'sozel' | 'all'>(
    userFieldTrack === 'sayisal' || userFieldTrack === 'esit_agirlik' || userFieldTrack === 'sozel'
      ? (userFieldTrack as any)
      : 'sayisal'
  );
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'uncompleted'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSubjects, setCollapsedSubjects] = useState<Record<string, boolean>>({});

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
    <div style={{ padding: isDesktop ? 0 : '0 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header Banner */}
      <div
        className="app-card"
        style={{
          background: 'linear-gradient(135deg, rgba(212, 255, 0, 0.08) 0%, rgba(20, 22, 28, 0.95) 100%)',
          border: '1px solid rgba(212, 255, 0, 0.25)',
          borderRadius: 20,
          padding: '20px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 900,
                textTransform: 'uppercase',
                padding: '3px 8px',
                borderRadius: 6,
                background: 'rgba(212, 255, 0, 0.2)',
                color: 'var(--color-accent)',
                letterSpacing: 0.5
              }}
            >
              {selectedExam === 'TYT' ? 'MEB 2018–2025 Resmi TYT Soru Dağılımı' : 'MEB 2018/2019–2025 Resmi AYT Soru Dağılımı'}
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
                color: 'var(--color-text-dim)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3
              }}
            >
              <span>Kaynak: {selectedExam === 'TYT' ? 'MEB Resmi TYT Analizi (PDF)' : 'MEB Resmi AYT Analizi (PDF)'}</span>
              <ExternalLink size={11} />
            </a>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 900, margin: '4px 0 6px 0', color: '#FFFFFF', letterSpacing: -0.3 }}>
            ÖSYM YKS Konu ve Soru Dağılımı Tablosu
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
            ÖSYM çıkmış sorular analizine göre hazırlanan ders ve konu tabloları. Bitirdiğiniz konuların solundaki kutucuğa tıklayarak <strong>tik koyabilirsiniz</strong>.
          </p>
        </div>

        {/* Quick KPI Badge */}
        <div
          style={{
            background: '#16181F',
            border: '1px solid var(--color-border)',
            borderRadius: 14,
            padding: '12px 18px',
            textAlign: 'center',
            minWidth: 160
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 2, textTransform: 'uppercase' }}>
            {selectedExam === 'AYT'
              ? selectedFieldTrack === 'sayisal'
                ? 'AYT SAYISAL TAMAMLANMA'
                : selectedFieldTrack === 'esit_agirlik'
                ? 'AYT EŞİT AĞIRLIK TAMAMLANMA'
                : selectedFieldTrack === 'sozel'
                ? 'AYT SÖZEL TAMAMLANMA'
                : 'AYT GENEL TAMAMLANMA'
              : 'TYT TAMAMLANMA'}
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>
            %{stats.pct}
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
            {stats.completedTopics} / {stats.totalTopics} Konu Tiklendi
          </div>
        </div>
      </div>

      {/* TYT / AYT Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button
          type="button"
          className={`btn-secondary ${selectedExam === 'TYT' ? 'active' : ''}`}
          style={{ justifyContent: 'center', padding: '12px', fontSize: 14, fontWeight: 800 }}
          onClick={() => {
            sounds.playTabSwitch();
            setSelectedExam('TYT');
            setSelectedSubjectCode('all');
          }}
        >
          📘 TYT Soru Dağılımı Tabloları
        </button>
        <button
          type="button"
          className={`btn-secondary ${selectedExam === 'AYT' ? 'active' : ''}`}
          style={{ justifyContent: 'center', padding: '12px', fontSize: 14, fontWeight: 800 }}
          onClick={() => {
            sounds.playTabSwitch();
            setSelectedExam('AYT');
            setSelectedSubjectCode('all');
          }}
        >
          📕 AYT Soru Dağılımı Tabloları
        </button>
      </div>

      {/* AYT Alan Seçimi (Sayısal, Eşit Ağırlık, Sözel, Tüm Dersler) */}
      {selectedExam === 'AYT' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            background: 'linear-gradient(90deg, rgba(212, 255, 0, 0.08) 0%, rgba(20, 22, 28, 0.8) 100%)',
            border: '1px solid rgba(212, 255, 0, 0.25)',
            borderRadius: 14,
            overflowX: 'auto'
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-accent)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5 }}>
            🎯 Alanını Seç:
          </span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
            {[
              { id: 'sayisal', label: '🔬 Sayısal (MF)', sub: 'Matematik, Fizik, Kimya, Biyoloji' },
              { id: 'esit_agirlik', label: '⚖️ Eşit Ağırlık (TM)', sub: 'Matematik, Edebiyat, Tarih, Coğrafya' },
              { id: 'sozel', label: '📚 Sözel (TS)', sub: 'Edebiyat, Tarih, Coğrafya, Felsefe, Din' },
              { id: 'all', label: '🌐 Tüm Dersler', sub: 'Tüm AYT branşları' }
            ].map((track) => {
              const isActive = selectedFieldTrack === track.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  className={`alan-btn${isActive ? ' active' : ''}`}
                  onClick={() => {
                    sounds.playClick();
                    // Toggle off if already selected
                    const nextTrack = selectedFieldTrack === track.id ? 'all' : (track.id as any);
                    setSelectedFieldTrack(nextTrack);
                    setSelectedSubjectCode('all');
                  }}
                  title={isActive ? `${track.sub} (Tıklayarak seçimi kaldır / geri çek)` : track.sub}
                >
                  {track.label} {isActive && track.id !== 'all' ? '✕' : ''}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Subject Filter Pills */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
        <button
          className={`pill-toggle-btn ${selectedSubjectCode === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedSubjectCode('all')}
        >
          Tüm Dersler ({examSubjects.length})
        </button>
        {examSubjects.map((sub) => {
          const isActive = selectedSubjectCode === sub.code;
          return (
            <button
              key={sub.code}
              className={`pill-toggle-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                sounds.playClick();
                // Toggle off to 'all' if clicked again
                setSelectedSubjectCode(isActive ? 'all' : sub.code);
              }}
              title={isActive ? 'Filtreyi kaldır (Tüm dersler)' : sub.name}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: sub.color,
                  display: 'inline-block',
                  marginRight: 6
                }}
              />
              {sub.name} {isActive ? '✕' : ''}
            </button>
          );
        })}
      </div>

      {/* Search & Completion Status Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--color-text-dim)" style={{ position: 'absolute', left: 12, top: 12 }} />
          <input
            type="text"
            placeholder="Tabloda konu veya ünite ara (ör: paragraf, fonksiyon, modern atom, kalıtım)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              borderRadius: 12,
              background: '#18191E',
              border: '1px solid var(--color-border)',
              color: '#FFFFFF',
              fontSize: 13,
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            className={`pill-toggle-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            Tümü
          </button>
          <button
            className={`pill-toggle-btn ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => {
              sounds.playClick();
              setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed');
            }}
            title={statusFilter === 'completed' ? 'Filtreyi geri çek / kaldır' : 'Bitirdiğim konular'}
          >
            ✅ Bitirdiğim Konular {statusFilter === 'completed' ? '✕' : ''}
          </button>
          <button
            className={`pill-toggle-btn ${statusFilter === 'uncompleted' ? 'active' : ''}`}
            onClick={() => {
              sounds.playClick();
              setStatusFilter(statusFilter === 'uncompleted' ? 'all' : 'uncompleted');
            }}
            title={statusFilter === 'uncompleted' ? 'Filtreyi geri çek / kaldır' : 'Henüz bitirmediklerim'}
          >
            ⏳ Henüz Bitirmediklerim {statusFilter === 'uncompleted' ? '✕' : ''}
          </button>
        </div>
      </div>

      {/* Tables List (Subject by Subject) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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

          return (
            <div
              key={subject.code}
              className="app-card"
              style={{
                padding: 0,
                overflow: 'hidden',
                borderRadius: 16,
                border: '1px solid var(--color-border)',
                background: '#16181F'
              }}
            >
              {/* Subject Table Header Bar */}
              <div
                onClick={() => toggleSubjectCollapse(subject.code)}
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderBottom: isCollapsed ? 'none' : '1px solid var(--color-border)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: subject.color,
                      boxShadow: `0 0 8px ${subject.color}`
                    }}
                  />
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
                      {subject.name} Soru Dağılımı Tablosu
                    </h3>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                      {completedInSub} / {subject.topics.length} Konu Tamamlandı • Toplam {totalTableSum} Soru
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: `${subject.color}20`,
                      color: subject.color
                    }}
                  >
                    %{Math.round((completedInSub / (subject.topics.length || 1)) * 100)}
                  </span>
                  <ChevronDown
                    size={18}
                    color="var(--color-text-muted)"
                    style={{
                      transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                </div>
              </div>

              {/* The Actual Table */}
              {!isCollapsed && (
                <div style={{ width: '100%', overflowX: 'auto' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: 12,
                      textAlign: 'left',
                      minWidth: 780
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: '#121318',
                          borderBottom: '1px solid var(--color-border)',
                          color: 'var(--color-text-muted)',
                          fontWeight: 800,
                          fontSize: 11
                        }}
                      >
                        <th style={{ padding: '10px 12px', width: 44, textAlign: 'center' }}>Tik</th>
                        <th style={{ padding: '10px 14px' }}>Konu Adı</th>
                        {subjectYears.map((yr) => (
                          <th key={yr} style={{ padding: '10px 8px', textAlign: 'center', width: 46 }}>
                            {yr}
                          </th>
                        ))}
                        <th
                          style={{
                            padding: '10px 14px',
                            textAlign: 'right',
                            width: 65,
                            color: 'var(--color-accent)'
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
                              padding: '24px',
                              textAlign: 'center',
                              color: 'var(--color-text-muted)'
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
                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                background: isCompleted
                                  ? 'rgba(212, 255, 0, 0.035)'
                                  : idx % 2 === 1
                                  ? 'rgba(255, 255, 255, 0.015)'
                                  : 'transparent',
                                transition: 'background 0.15s ease'
                              }}
                              className="table-row-hover"
                            >
                              {/* Tik Column */}
                              <td style={{ padding: '10px 12px', textAlign: 'center', verticalAlign: 'middle' }}>
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
                                    color: isCompleted ? 'var(--color-accent)' : 'var(--color-text-dim)',
                                    transition: 'transform 0.1s ease'
                                  }}
                                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.85)')}
                                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 size={19} color="var(--color-accent)" />
                                  ) : (
                                    <Circle size={19} color="rgba(255, 255, 255, 0.25)" />
                                  )}
                                </button>
                              </td>

                              {/* Topic Name & Unit */}
                              <td style={{ padding: '10px 14px', verticalAlign: 'middle' }}>
                                <div
                                  style={{
                                    fontWeight: isCompleted ? 700 : 600,
                                    fontSize: 13,
                                    color: isCompleted ? 'var(--color-text-muted)' : '#FFFFFF',
                                    textDecoration: isCompleted ? 'line-through' : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6
                                  }}
                                >
                                  <span>{topicItem.topic}</span>
                                  {isCompleted && (
                                    <span
                                      style={{
                                        fontSize: 9.5,
                                        fontWeight: 800,
                                        padding: '1px 5px',
                                        borderRadius: 4,
                                        background: 'rgba(212, 255, 0, 0.15)',
                                        color: 'var(--color-accent)'
                                      }}
                                    >
                                      ✓ Bitti
                                    </span>
                                  )}
                                </div>
                                {topicItem.unit && (
                                  <div style={{ fontSize: 10.5, color: 'var(--color-text-dim)', marginTop: 2 }}>
                                    {topicItem.unit}
                                  </div>
                                )}
                              </td>

                              {/* Years based on subject */}
                              {subjectYears.map((yr) => {
                                const count = topicItem.yearly[yr] || 0;
                                return (
                                  <td
                                    key={yr}
                                    style={{
                                      padding: '10px 8px',
                                      textAlign: 'center',
                                      verticalAlign: 'middle',
                                      fontFamily: 'var(--font-mono)',
                                      fontWeight: count > 0 ? 800 : 500,
                                      color: count > 0 ? '#FFFFFF' : 'var(--color-text-dim)',
                                      background: count > 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                                    }}
                                  >
                                    {count > 0 ? count : '–'}
                                  </td>
                                );
                              })}

                              {/* Total Column */}
                              <td
                                style={{
                                  padding: '10px 14px',
                                  textAlign: 'right',
                                  verticalAlign: 'middle',
                                  fontWeight: 900,
                                  fontSize: 13,
                                  fontFamily: 'var(--font-mono)',
                                  color: topicItem.total > 0 ? 'var(--color-accent)' : 'var(--color-text-dim)'
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
                            background: '#121318',
                            borderTop: '2px solid var(--color-border)',
                            fontWeight: 900,
                            fontSize: 12
                          }}
                        >
                          <td style={{ padding: '12px', textAlign: 'center' }}>∑</td>
                          <td style={{ padding: '12px 14px', color: '#FFFFFF' }}>
                            {subject.name} Toplam Soru Sayısı
                          </td>
                          {subjectYears.map((yr) => (
                            <td
                              key={yr}
                              style={{
                                padding: '12px 8px',
                                textAlign: 'center',
                                fontFamily: 'var(--font-mono)',
                                color: columnSums[yr] > 0 ? '#FFFFFF' : 'var(--color-text-dim)'
                              }}
                            >
                              {columnSums[yr] || '–'}
                            </td>
                          ))}
                          <td
                            style={{
                              padding: '12px 14px',
                              textAlign: 'right',
                              fontFamily: 'var(--font-mono)',
                              color: 'var(--color-accent)',
                              fontSize: 14
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
