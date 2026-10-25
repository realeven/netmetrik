import { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  Search,
  ArrowUpDown,
  ExternalLink
} from 'lucide-react';
import {
  OSYM_QUESTION_DISTRIBUTION
} from '../data/osymDistributionData';
import type { OsymTopicItem } from '../data/osymDistributionData';
import type { TopicStatus } from '../data/seedData';
import { sounds } from '../lib/sound';

interface OsymDistributionViewProps {
  topicProgress: Record<string, TopicStatus>;
  onToggleTopicCompleted: (topicKey: string) => void;
  isDesktop?: boolean;
}

export function OsymDistributionView({
  topicProgress,
  onToggleTopicCompleted,
  isDesktop
}: OsymDistributionViewProps) {
  const [selectedExam, setSelectedExam] = useState<'TYT' | 'AYT'>('TYT');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'uncompleted'>('all');
  const [sortBy, setSortBy] = useState<'total' | 'recent' | 'name'>('total');
  const [searchQuery, setSearchQuery] = useState('');

  // Available subjects for current exam category
  const examSubjects = useMemo(() => {
    return OSYM_QUESTION_DISTRIBUTION.filter((s) => s.exam === selectedExam);
  }, [selectedExam]);

  // Active subjects to show (either 1 selected or all in this exam)
  const activeSubjects = useMemo(() => {
    if (selectedSubjectCode === 'all') return examSubjects;
    return examSubjects.filter((s) => s.code === selectedSubjectCode);
  }, [examSubjects, selectedSubjectCode]);

  // Flattened topic list with subject metadata
  interface FlatTopicItem extends OsymTopicItem {
    subjectCode: string;
    subjectName: string;
    subjectColor: string;
    topicKey: string;
    isCompleted: boolean;
  }

  const allFilteredTopics = useMemo(() => {
    const list: FlatTopicItem[] = [];

    activeSubjects.forEach((sub) => {
      sub.topics.forEach((t) => {
        const topicKey = `${sub.code}_${t.topic}`;
        const isCompleted = topicProgress[topicKey] === 'completed';

        // Filter by status
        if (statusFilter === 'completed' && !isCompleted) return;
        if (statusFilter === 'uncompleted' && isCompleted) return;

        // Filter by search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            t.topic.toLowerCase().includes(q) ||
            (t.unit && t.unit.toLowerCase().includes(q)) ||
            sub.name.toLowerCase().includes(q);
          if (!matches) return;
        }

        list.push({
          ...t,
          subjectCode: sub.code,
          subjectName: sub.name,
          subjectColor: sub.color,
          topicKey,
          isCompleted
        });
      });
    });

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'total') return b.total - a.total;
      if (sortBy === 'recent') {
        const recA = (a.yearly['2026'] || 0) * 3 + (a.yearly['2025'] || 0) * 2 + (a.yearly['2024'] || 0);
        const recB = (b.yearly['2026'] || 0) * 3 + (b.yearly['2025'] || 0) * 2 + (b.yearly['2024'] || 0);
        return recB - recA;
      }
      return a.topic.localeCompare(b.topic, 'tr');
    });

    return list;
  }, [activeSubjects, topicProgress, statusFilter, searchQuery, sortBy]);

  // Overall stats for current view
  const stats = useMemo(() => {
    let totalQuestionsAllYears = 0;
    let completedCount = 0;
    let totalTopicsCount = 0;

    examSubjects.forEach((sub) => {
      sub.topics.forEach((t) => {
        totalTopicsCount++;
        totalQuestionsAllYears += t.total;
        const topicKey = `${sub.code}_${t.topic}`;
        if (topicProgress[topicKey] === 'completed') {
          completedCount++;
        }
      });
    });

    return {
      totalTopicsCount,
      completedCount,
      pct: Math.round((completedCount / (totalTopicsCount || 1)) * 100),
      totalQuestionsAllYears
    };
  }, [examSubjects, topicProgress]);

  // Years list from data
  const yearsList = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];

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
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ maxWidth: 520 }}>
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
                ÖSYM 2018–2026 Çıkmış Sorular
              </span>
              <a
                href="https://ertansinansahin.com/yks-soru-dagilimi/"
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
                <span>Kaynak: Ertan Sinan Şahin</span>
                <ExternalLink size={11} />
              </a>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: '4px 0 8px 0', color: '#FFFFFF', letterSpacing: -0.3 }}>
              ÖSYM YKS Konu ve Soru Dağılımı
            </h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
              ÖSYM sınavlarında hangi konudan kaç soru çıktığını yıl yıl inceleyin; bitirdiğiniz konuların yanına tik koyarak eksiklerinizi doğrudan tespit edin.
            </p>
          </div>

          {/* Quick Progress KPI */}
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
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 2 }}>
              {selectedExam} TAMAMLANMA
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>
              %{stats.pct}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
              {stats.completedCount} / {stats.totalTopicsCount} Konu Tiklendi
            </div>
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
          📘 TYT Soru Dağılımı ({OSYM_QUESTION_DISTRIBUTION.filter((s) => s.exam === 'TYT').length} Ders)
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
          📕 AYT Soru Dağılımı ({OSYM_QUESTION_DISTRIBUTION.filter((s) => s.exam === 'AYT').length} Ders)
        </button>
      </div>

      {/* Subject Filter Pills */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
        <button
          className={`pill-toggle-btn ${selectedSubjectCode === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedSubjectCode('all')}
        >
          Tüm Dersler
        </button>
        {examSubjects.map((sub) => (
          <button
            key={sub.code}
            className={`pill-toggle-btn ${selectedSubjectCode === sub.code ? 'active' : ''}`}
            onClick={() => {
              sounds.playClick();
              setSelectedSubjectCode(sub.code);
            }}
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
            {sub.name}
          </button>
        ))}
      </div>

      {/* Search, Status & Sorting Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--color-text-dim)" style={{ position: 'absolute', left: 12, top: 12 }} />
          <input
            type="text"
            placeholder="Konu veya ünite ara (ör: paragraf, türev, modern atom, kalıtım)..."
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className={`pill-toggle-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              Tümü ({allFilteredTopics.length})
            </button>
            <button
              className={`pill-toggle-btn ${statusFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('completed')}
            >
              ✅ Bitirdiklerim
            </button>
            <button
              className={`pill-toggle-btn ${statusFilter === 'uncompleted' ? 'active' : ''}`}
              onClick={() => setStatusFilter('uncompleted')}
            >
              ⏳ Kalan Konular
            </button>
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowUpDown size={14} color="var(--color-text-muted)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '6px 10px',
                borderRadius: 10,
                background: '#1D1F25',
                border: '1px solid var(--color-border)',
                color: '#fff',
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              <option value="total">🔥 En Çok Soru Çıkanlar (Toplam)</option>
              <option value="recent">⚡ Son Yılların Ağırlığı (2024-2026)</option>
              <option value="name">🔤 Konu Adına Göre (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Topics Distribution List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {allFilteredTopics.length === 0 ? (
          <div
            className="app-card"
            style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-muted)' }}
          >
            Arama veya filtre kriterlerinize uygun konu bulunamadı.
          </div>
        ) : (
          allFilteredTopics.map((topicItem) => {
            const isCompleted = topicItem.isCompleted;

            // Frequency weight badge
            let badgeText = '• Ara Sıra';
            let badgeBg = 'rgba(255, 255, 255, 0.05)';
            let badgeColor = 'var(--color-text-dim)';
            if (topicItem.total >= 30) {
              badgeText = '🔥 Çok Yüksek Ağırlık';
              badgeBg = 'rgba(255, 80, 80, 0.15)';
              badgeColor = '#FF5050';
            } else if (topicItem.total >= 10) {
              badgeText = '⭐ Düzenli Çıkan';
              badgeBg = 'rgba(255, 184, 0, 0.15)';
              badgeColor = '#FFB800';
            } else if (topicItem.total >= 5) {
              badgeText = '📌 Sık Sorulan';
              badgeBg = 'rgba(0, 240, 255, 0.15)';
              badgeColor = '#00F0FF';
            }

            return (
              <div
                key={topicItem.topicKey}
                className="app-card"
                style={{
                  padding: '14px 16px',
                  borderRadius: 16,
                  border: isCompleted
                    ? '1px solid rgba(212, 255, 0, 0.3)'
                    : '1px solid var(--color-border)',
                  background: isCompleted ? 'rgba(212, 255, 0, 0.03)' : '#191B22',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Top Row: Tick Button + Topic & Unit + Badges + Total Questions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 0 }}>
                    {/* Checkmark Button */}
                    <button
                      type="button"
                      onClick={() => onToggleTopicCompleted(topicItem.topicKey)}
                      title={isCompleted ? 'Bitirildi olarak işaretli (kaldırmak için tıklayın)' : 'Bu konuyu bitirdim olarak işaretle'}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 2,
                        marginTop: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isCompleted ? 'var(--color-accent)' : 'var(--color-text-muted)',
                        transition: 'transform 0.1s ease'
                      }}
                      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.85)')}
                      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={24} color="var(--color-accent)" />
                      ) : (
                        <Circle size={24} color="var(--color-text-dim)" />
                      )}
                    </button>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            padding: '2px 7px',
                            borderRadius: 6,
                            background: `${topicItem.subjectColor}20`,
                            color: topicItem.subjectColor
                          }}
                        >
                          {topicItem.subjectName}
                        </span>

                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            padding: '2px 7px',
                            borderRadius: 6,
                            background: badgeBg,
                            color: badgeColor
                          }}
                        >
                          {badgeText}
                        </span>

                        {isCompleted && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 800,
                              padding: '2px 7px',
                              borderRadius: 6,
                              background: 'rgba(212, 255, 0, 0.15)',
                              color: 'var(--color-accent)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 2
                            }}
                          >
                            ✓ Bitirildi
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: isCompleted ? 'rgba(255, 255, 255, 0.75)' : '#FFFFFF',
                          lineHeight: 1.3
                        }}
                      >
                        {topicItem.topic}
                      </div>

                      {topicItem.unit && (
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                          Ünite: {topicItem.unit}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total Question Count Badge */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 900,
                        color: topicItem.total > 0 ? 'var(--color-accent)' : 'var(--color-text-dim)',
                        fontFamily: 'var(--font-mono)',
                        lineHeight: 1
                      }}
                    >
                      {topicItem.total}
                    </div>
                    <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--color-text-muted)', marginTop: 2 }}>
                      TOPLAM SORU
                    </div>
                  </div>
                </div>

                {/* Yearly Questions Breakdown Strip */}
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 10,
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 6,
                    overflowX: 'auto',
                    paddingBottom: 2
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', minWidth: 60 }}>
                    Yıl Yıl Dağılım:
                  </div>

                  <div style={{ display: 'flex', gap: 6, flex: 1, justifyContent: 'flex-end' }}>
                    {yearsList.map((yr) => {
                      const count = topicItem.yearly[yr] || 0;
                      return (
                        <div
                          key={yr}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: 32,
                            padding: '4px 6px',
                            borderRadius: 8,
                            background: count > 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                            border: count > 0 ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid transparent'
                          }}
                        >
                          <span style={{ fontSize: 9, color: 'var(--color-text-dim)', fontWeight: 600 }}>{yr.slice(2)}</span>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: count > 0 ? 900 : 500,
                              color: count > 0 ? '#FFFFFF' : 'var(--color-text-dim)',
                              fontFamily: 'var(--font-mono)'
                            }}
                          >
                            {count > 0 ? count : '–'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
