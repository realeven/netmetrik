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

  useEffect(() => {
    if (userFieldTrack === 'sayisal' || userFieldTrack === 'esit_agirlik' || userFieldTrack === 'sozel') {
      // Allow user preference
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
        padding: isDesktop ? '0 0 40px 0' : '0 0 30px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: isDesktop ? 14 : 10,
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
          height: 4px;
        }
        .osym-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
        }
      `}</style>

      {/* 🌟 1. Exam Toggle (TYT vs AYT) + Version indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: -6 }}>
        <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>v1.3</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%', boxSizing: 'border-box' }}>
        <button
          type="button"
          className={`btn-secondary ${selectedExam === 'TYT' ? 'active' : ''}`}
          onClick={() => {
            sounds.playTabSwitch();
            setSelectedExam('TYT');
            setSelectedSubjectCode('all');
          }}
          style={{
            justifyContent: 'center',
            padding: isDesktop ? '12px 14px' : '9px 8px',
            fontSize: isDesktop ? 13 : 11.5,
            fontWeight: 800,
            whiteSpace: 'nowrap'
          }}
        >
          📘 {isDesktop ? 'TYT Soru Dağılımı Tabloları' : 'TYT Tablosu'}
        </button>

        <button
          type="button"
          className={`btn-secondary ${selectedExam === 'AYT' ? 'active' : ''}`}
          onClick={() => {
            sounds.playTabSwitch();
            setSelectedExam('AYT');
            setSelectedSubjectCode('all');
          }}
          style={{
            justifyContent: 'center',
            padding: isDesktop ? '12px 14px' : '9px 8px',
            fontSize: isDesktop ? 13 : 11.5,
            fontWeight: 800,
            whiteSpace: 'nowrap'
          }}
        >
          📕 {isDesktop ? 'AYT Soru Dağılımı Tabloları' : 'AYT Tablosu'}
        </button>
      </div>

      {/* 🌟 2. Progress Summary Banner Card — NO app-card class to avoid CSS !important overrides */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(26, 28, 34, 1) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: isDesktop ? 20 : 16,
          padding: isDesktop ? 16 : '12px 14px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ minWidth: 0, flex: 1, paddingRight: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: 'rgba(212, 255, 0, 0.15)',
                  color: 'var(--color-accent)'
                }}
              >
                MEB 2018–2025 RESMİ
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
                  fontSize: 10,
                  color: 'rgba(255, 255, 255, 0.5)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3
                }}
              >
                <span>MEB PDF</span>
                <ExternalLink size={10} color="rgba(255, 255, 255, 0.5)" />
              </a>
            </div>
            <div style={{ fontSize: isDesktop ? 16 : 13.5, fontWeight: 800, color: '#FFFFFF', letterSpacing: -0.2 }}>
              {selectedExam} Çıkmış Soru Dağılımı
            </div>
            <div style={{ fontSize: isDesktop ? 12 : 10.5, color: 'rgba(255, 255, 255, 0.5)', marginTop: 2 }}>
              {stats.completedTopics} / {stats.totalTopics} Konu Tamamlandı • {stats.totalQuestions} Soru
            </div>
          </div>

          <div
            style={{
              fontSize: isDesktop ? 26 : 20,
              fontWeight: 900,
              color: '#38BDF8',
              fontFamily: 'var(--font-mono)',
              flexShrink: 0
            }}
          >
            %{stats.pct}
          </div>
        </div>

        <div style={{ width: '100%', height: 7, background: '#14161C', borderRadius: 99, overflow: 'hidden' }}>
          <div
            style={{
              width: `${stats.pct}%`,
              height: '100%',
              borderRadius: 99,
              background: 'linear-gradient(90deg, #38BDF8 0%, #60A5FA 100%)',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </div>

      {/* 🌟 3. Track / Field Filter Bar for AYT ("🎯 Alan:") */}
      {selectedExam === 'AYT' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: isDesktop ? '8px 12px' : '6px 8px',
            background: 'rgba(56, 189, 248, 0.05)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: 12,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}
          className="osym-scroll"
        >
          <span style={{ fontSize: isDesktop ? 11 : 10, fontWeight: 800, color: '#38BDF8', whiteSpace: 'nowrap', flexShrink: 0 }}>
            🎯 Alan:
          </span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap', flexShrink: 0 }}>
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
                  className={`alan-btn${isActive ? ' active' : ''}`}
                  style={{
                    padding: isDesktop ? '5px 12px' : '4px 8px',
                    borderRadius: 8,
                    fontSize: isDesktop ? 11 : 10,
                    whiteSpace: 'nowrap'
                  }}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedFieldTrack(track.id as any);
                    setSelectedSubjectCode('all');
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
      <div
        className="osym-scroll"
        style={{
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          paddingBottom: 2,
          width: '100%',
          boxSizing: 'border-box',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <button
          type="button"
          onClick={() => setSelectedSubjectCode('all')}
          style={{
            cursor: 'pointer',
            padding: isDesktop ? '6px 14px' : '5px 10px',
            borderRadius: 8,
            fontSize: isDesktop ? 12 : 11,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            background: selectedSubjectCode === 'all' ? '#252834' : 'rgba(20, 23, 32, 0.65)',
            border: selectedSubjectCode === 'all' ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
            color: selectedSubjectCode === 'all' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
            flexShrink: 0
          }}
        >
          Tüm Dersler ({examSubjects.length})
        </button>

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
                padding: isDesktop ? '6px 14px' : '5px 10px',
                borderRadius: 8,
                fontSize: isDesktop ? 12 : 11,
                fontWeight: isActive ? 800 : 600,
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: isActive ? `${sub.color}25` : 'rgba(20, 23, 32, 0.65)',
                border: isActive ? `1px solid ${sub.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)',
                boxShadow: isActive ? `0 0 12px ${sub.color}40` : 'none',
                flexShrink: 0
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
          <Search
            size={16}
            color="rgba(255, 255, 255, 0.4)"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Tabloda konu veya ünite ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: 40,
              padding: '0 14px 0 36px',
              borderRadius: 12,
              background: '#18191E',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              fontSize: 12.5,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', width: '100%', boxSizing: 'border-box' }}>
          <button
            type="button"
            className={`pill-toggle-btn ${statusFilter === 'all' ? 'active' : ''}`}
            style={{ fontSize: 11, padding: '4px 10px' }}
            onClick={() => setStatusFilter('all')}
          >
            Tümü
          </button>
          <button
            type="button"
            className={`pill-toggle-btn ${statusFilter === 'completed' ? 'active' : ''}`}
            style={{ fontSize: 11, padding: '4px 10px' }}
            onClick={() => {
              sounds.playClick();
              setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed');
            }}
          >
            ✓ Bitirdiğim
          </button>
          <button
            type="button"
            className={`pill-toggle-btn ${statusFilter === 'uncompleted' ? 'active' : ''}`}
            style={{ fontSize: 11, padding: '4px 10px' }}
            onClick={() => {
              sounds.playClick();
              setStatusFilter(statusFilter === 'uncompleted' ? 'all' : 'uncompleted');
            }}
          >
            ⏳ Bitmedi
          </button>
        </div>
      </div>

      {/* 🌟 6. Subject Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', boxSizing: 'border-box' }}>
        {activeSubjects.map((subject: OsymSubjectDistribution) => {
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
                background: '#18191E',
                border: '1px solid var(--color-border)',
                borderRadius: 16,
                overflow: 'hidden',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {/* Subject Table Header Bar */}
              <div
                onClick={() => toggleSubjectCollapse(subject.code)}
                style={{
                  padding: isDesktop ? '14px 16px' : '11px 13px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: isCollapsed ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                  borderBottom: isCollapsed ? 'none' : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  gap: 8
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background: subject.color || '#22C55E',
                      boxShadow: `0 0 8px ${subject.color || '#22C55E'}`,
                      flexShrink: 0
                    }}
                  />
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <h3 style={{ fontSize: isDesktop ? 14 : 13, fontWeight: 800, margin: 0, color: '#FFFFFF', letterSpacing: -0.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {subject.name} Soru Dağılımı Tablosu
                    </h3>
                    <div style={{ fontSize: isDesktop ? 11 : 10, color: 'var(--color-text-muted)', marginTop: 2 }}>
                      {completedInSub}/{subject.topics.length} Konu • {totalTableSum} Soru
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: isDesktop ? 12 : 8, flexShrink: 0 }}>
                  <div
                    style={{
                      width: isDesktop ? 100 : 48,
                      height: 6,
                      borderRadius: 99,
                      background: '#14161C',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: `${subPct}%`,
                        height: '100%',
                        borderRadius: 99,
                        background: 'linear-gradient(90deg, #38BDF8 0%, #60A5FA 100%)',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>

                  <span
                    style={{
                      fontSize: isDesktop ? 13 : 11.5,
                      fontWeight: 800,
                      color: '#38BDF8',
                      minWidth: 28,
                      textAlign: 'right'
                    }}
                  >
                    %{subPct}
                  </span>

                  <ChevronDown
                    size={isDesktop ? 18 : 16}
                    color="var(--color-text-muted)"
                    style={{
                      transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0
                    }}
                  />
                </div>
              </div>

              {/* The Table / Mobile List */}
              {!isCollapsed && (
                isDesktop ? (
                  <div className="osym-scroll" style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: 12,
                        textAlign: 'left',
                        minWidth: 720
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            background: '#121318',
                            borderBottom: '1px solid var(--color-border)',
                            color: 'var(--color-text-muted)',
                            fontWeight: 800,
                            fontSize: 11,
                            height: 38
                          }}
                        >
                          <th style={{ padding: '8px 12px', width: 44, textAlign: 'center' }}>Tik</th>
                          <th style={{ padding: '8px 14px' }}>Konu Adı</th>
                          {subjectYears.map((yr) => (
                            <th key={yr} style={{ padding: '8px 6px', textAlign: 'center', width: 40, fontSize: 11 }}>
                              {yr}
                            </th>
                          ))}
                          <th
                            style={{
                              padding: '8px 16px',
                              textAlign: 'right',
                              width: 56,
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
                                padding: '24px',
                                textAlign: 'center',
                                color: 'rgba(255, 255, 255, 0.4)',
                                fontSize: 12
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
                                    ? 'rgba(34, 197, 94, 0.04)'
                                    : idx % 2 === 1
                                      ? 'rgba(255, 255, 255, 0.015)'
                                      : 'transparent',
                                  transition: 'background 0.12s ease',
                                  height: 42
                                }}
                                className="osym-table-row"
                              >
                                <td style={{ padding: '6px 12px', textAlign: 'center', verticalAlign: 'middle' }}>
                                  <button
                                    type="button"
                                    onClick={() => onToggleTopicCompleted(topicKey)}
                                    title={isCompleted ? 'Bitirildi' : 'Bitir'}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      cursor: 'pointer',
                                      padding: 0,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    {isCompleted ? (
                                      <div
                                        style={{
                                          width: 18,
                                          height: 18,
                                          borderRadius: '50%',
                                          background: '#22C55E',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center'
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
                                          border: '1.5px solid rgba(255, 255, 255, 0.25)'
                                        }}
                                      />
                                    )}
                                  </button>
                                </td>

                                <td style={{ padding: '6px 14px', verticalAlign: 'middle' }}>
                                  <span
                                    style={{
                                      fontSize: 12.5,
                                      fontWeight: isCompleted ? 600 : 700,
                                      color: isCompleted ? 'rgba(255, 255, 255, 0.45)' : '#FFFFFF',
                                      textDecoration: isCompleted ? 'line-through' : 'none'
                                    }}
                                  >
                                    {topicItem.topic}
                                  </span>
                                  {topicItem.unit && (
                                    <span style={{ fontSize: 10.5, color: 'rgba(255, 255, 255, 0.35)', marginLeft: 6 }}>
                                      ({topicItem.unit})
                                    </span>
                                  )}
                                </td>

                                {subjectYears.map((yr) => {
                                  const count = topicItem.yearly[yr] || 0;
                                  return (
                                    <td
                                      key={yr}
                                      style={{
                                        padding: '6px 6px',
                                        textAlign: 'center',
                                        verticalAlign: 'middle',
                                        fontFamily: 'var(--font-mono, inherit)',
                                        fontWeight: count > 0 ? 700 : 400,
                                        fontSize: 11.5,
                                        color: count > 0 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.18)'
                                      }}
                                    >
                                      {count > 0 ? count : '—'}
                                    </td>
                                  );
                                })}

                                <td
                                  style={{
                                    padding: '6px 16px',
                                    textAlign: 'right',
                                    verticalAlign: 'middle',
                                    fontWeight: 800,
                                    fontSize: 12,
                                    fontFamily: 'var(--font-mono, inherit)',
                                    color: topicItem.total > 0 ? '#38BDF8' : 'rgba(255, 255, 255, 0.25)'
                                  }}
                                >
                                  {topicItem.total}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>

                      {filteredTopics.length > 0 && (
                        <tfoot>
                          <tr
                            style={{
                              background: '#121318',
                              borderTop: '1px solid var(--color-border)',
                              fontWeight: 800,
                              fontSize: 11.5,
                              height: 38
                            }}
                          >
                            <td style={{ padding: '8px 12px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.4)' }}>∑</td>
                            <td style={{ padding: '8px 14px', color: '#FFFFFF' }}>
                              {subject.name} Toplam Soru
                            </td>
                            {subjectYears.map((yr) => (
                              <td
                                key={yr}
                                style={{
                                  padding: '8px 6px',
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
                                padding: '8px 16px',
                                textAlign: 'right',
                                fontFamily: 'var(--font-mono, inherit)',
                                color: '#38BDF8',
                                fontSize: 13,
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
                ) : (
                  /* 📱 MOBILE LIST VIEW */
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}>
                    {filteredTopics.length === 0 ? (
                      <div style={{ padding: 16, textAlign: 'center', color: 'rgba(255, 255, 255, 0.4)', fontSize: 11.5 }}>
                        Bu filtreye uygun konu bulunamadı.
                      </div>
                    ) : (
                      filteredTopics.map((topicItem, idx) => {
                        const topicKey = `${subject.code}_${topicItem.topic}`;
                        const isCompleted = topicProgress[topicKey] === 'completed';

                        return (
                          <div
                            key={topicKey}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 6,
                              padding: '10px 12px',
                              background: isCompleted
                                ? 'rgba(34, 197, 94, 0.05)'
                                : idx % 2 === 1
                                  ? 'rgba(255, 255, 255, 0.015)'
                                  : 'transparent',
                              borderBottom: idx === filteredTopics.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.04)',
                              boxSizing: 'border-box',
                              width: '100%'
                            }}
                          >
                            {/* Main row: Checkbox + Topic title + Total badge */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', minWidth: 0 }}>
                              <button
                                type="button"
                                onClick={() => onToggleTopicCompleted(topicKey)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: 0,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0
                                }}
                              >
                                {isCompleted ? (
                                  <div
                                    style={{
                                      width: 22,
                                      height: 22,
                                      borderRadius: '50%',
                                      background: '#22C55E',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      boxShadow: '0 0 8px rgba(34, 197, 94, 0.4)'
                                    }}
                                  >
                                    <Check size={13} color="#FFFFFF" strokeWidth={3.5} />
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      width: 22,
                                      height: 22,
                                      borderRadius: '50%',
                                      border: '1.5px solid rgba(255, 255, 255, 0.3)'
                                    }}
                                  />
                                )}
                              </button>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                  style={{
                                    fontSize: 13,
                                    fontWeight: isCompleted ? 600 : 700,
                                    color: isCompleted ? 'rgba(255, 255, 255, 0.45)' : '#FFFFFF',
                                    textDecoration: isCompleted ? 'line-through' : 'none',
                                    lineHeight: 1.35,
                                    wordBreak: 'break-word'
                                  }}
                                >
                                  {topicItem.topic}
                                </div>
                                {topicItem.unit && (
                                  <div style={{ fontSize: 10, color: 'rgba(255, 255, 255, 0.4)', marginTop: 1 }}>
                                    {topicItem.unit}
                                  </div>
                                )}
                              </div>

                              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                                <span
                                  style={{
                                    fontSize: 10.5,
                                    fontWeight: 800,
                                    padding: '2px 7px',
                                    borderRadius: 6,
                                    background: topicItem.total > 0 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                    color: topicItem.total > 0 ? '#38BDF8' : 'rgba(255, 255, 255, 0.3)',
                                    border: '1px solid rgba(56, 189, 248, 0.25)',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {topicItem.total} Soru
                                </span>
                              </div>
                            </div>

                            {/* Yearly questions badges row */}
                            <div
                              className="osym-scroll"
                              style={{
                                display: 'flex',
                                gap: 4,
                                overflowX: 'auto',
                                paddingLeft: 32,
                                paddingBottom: 2,
                                width: '100%',
                                boxSizing: 'border-box',
                                WebkitOverflowScrolling: 'touch'
                              }}
                            >
                              {subjectYears.map((yr) => {
                                const cnt = topicItem.yearly[yr] || 0;
                                return (
                                  <div
                                    key={yr}
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      padding: '2px 5px',
                                      borderRadius: 4,
                                      background: cnt > 0 ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                                      border: cnt > 0 ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid transparent',
                                      minWidth: 26,
                                      flexShrink: 0
                                    }}
                                  >
                                    <span style={{ fontSize: 8.5, color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600 }}>
                                      '{yr.slice(-2)}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: 10.5,
                                        fontWeight: cnt > 0 ? 800 : 400,
                                        color: cnt > 0 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)'
                                      }}
                                    >
                                      {cnt > 0 ? cnt : '—'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })
                    )}

                    {/* Mobile Subject Footer */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '9px 12px',
                        background: 'rgba(11, 13, 19, 0.95)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      <span>∑ Toplam Soru</span>
                      <span style={{ color: '#38BDF8', fontWeight: 900, fontSize: 12 }}>{totalTableSum} Soru</span>
                    </div>
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
