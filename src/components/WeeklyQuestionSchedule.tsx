import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  BookOpen,
  BarChart2,
  CheckCircle2,
  X,
  Clock,
  Sparkles
} from 'lucide-react';
import type { QuestionLog } from '../data/seedData';
import { YKS_SUBJECTS } from '../data/seedData';
import { sounds } from '../lib/sound';

interface WeeklyQuestionScheduleProps {
  questionLogs: QuestionLog[];
  onAddQuestionLog: (
    subject: string,
    topic: string,
    source: string,
    count: number,
    minutes: number,
    date?: string,
    correct?: number,
    wrong?: number
  ) => void;
  onDeleteQuestionLog: (id: string) => void;
  isDesktop?: boolean;
}

// Helpers for Week Calculation (Monday to Sunday)
function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const DAY_NAMES = [
  { short: 'Pzt', full: 'Pazartesi' },
  { short: 'Sal', full: 'Salı' },
  { short: 'Çar', full: 'Çarşamba' },
  { short: 'Per', full: 'Perşembe' },
  { short: 'Cum', full: 'Cuma' },
  { short: 'Cmt', full: 'Cumartesi' },
  { short: 'Paz', full: 'Pazar' }
];

const PRESET_ACTIVITIES = [
  'Masa Başı Konu Çalışması',
  'Video Ders İzleme',
  'Genel Etüt',
  'Kütüphane Çalışması',
  'Deneme Analizi & Tekrar',
  'Özet & Formül Tekrarı'
];

export const WeeklyQuestionSchedule: React.FC<WeeklyQuestionScheduleProps> = ({
  questionLogs,
  onAddQuestionLog,
  onDeleteQuestionLog,
  isDesktop = false
}) => {
  const todayKey = useMemo(() => formatDateKey(new Date()), []);
  const [currentMonday, setCurrentMonday] = useState<Date>(() => getMonday(new Date()));
  const [viewMode, setViewMode] = useState<'matrix' | 'cards'>('matrix');

  // Quick Add Question Modal state (No minutes entered here)
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(todayKey);
  const [modalSubject, setModalSubject] = useState<string>(YKS_SUBJECTS[0].name);
  const [modalTopic, setModalTopic] = useState<string>(YKS_SUBJECTS[0].topics[0] || 'Genel Tekrar');
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const [customTopicText, setCustomTopicText] = useState('');
  const [modalCount, setModalCount] = useState<number>(30);
  const [modalSource, setModalSource] = useState<string>('');
  const [modalCorrect, setModalCorrect] = useState<string>('');
  const [modalWrong, setModalWrong] = useState<string>('');

  // General Study Time Modal state (For overall daily study minutes + NetFocus)
  const [showStudyTimeModal, setShowStudyTimeModal] = useState(false);
  const [studyTimeDate, setStudyTimeDate] = useState<string>(todayKey);
  const [studyActivity, setStudyActivity] = useState<string>(PRESET_ACTIVITIES[0]);
  const [customActivity, setCustomActivity] = useState<string>('');
  const [isCustomActivity, setIsCustomActivity] = useState(false);
  const [studyMinutes, setStudyMinutes] = useState<number>(60);

  // 7 days of the currently selected week
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentMonday);
      d.setDate(d.getDate() + i);
      const dateKey = formatDateKey(d);
      return {
        date: d,
        dateKey,
        dayNameShort: DAY_NAMES[i].short,
        dayNameFull: DAY_NAMES[i].full,
        dayNumber: d.getDate(),
        monthName: d.toLocaleDateString('tr-TR', { month: 'short' }),
        isToday: dateKey === todayKey
      };
    });
  }, [currentMonday, todayKey]);

  // Week range label (e.g., "20 - 26 Ekim 2026")
  const weekLabel = useMemo(() => {
    const start = weekDays[0].date;
    const end = weekDays[6].date;
    const startStr = `${start.getDate()} ${start.toLocaleDateString('tr-TR', { month: 'short' })}`;
    const endStr = `${end.getDate()} ${end.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' })}`;
    return `${startStr} – ${endStr}`;
  }, [weekDays]);

  const isCurrentWeek = useMemo(() => {
    const nowMonday = getMonday(new Date());
    return formatDateKey(nowMonday) === formatDateKey(currentMonday);
  }, [currentMonday]);

  // Navigation handlers
  const handlePrevWeek = () => {
    sounds.playClick();
    const d = new Date(currentMonday);
    d.setDate(d.getDate() - 7);
    setCurrentMonday(d);
  };

  const handleNextWeek = () => {
    sounds.playClick();
    const d = new Date(currentMonday);
    d.setDate(d.getDate() + 7);
    setCurrentMonday(d);
  };

  const handleGoToday = () => {
    sounds.playClick();
    setCurrentMonday(getMonday(new Date()));
  };

  // Filter logs for this week
  const weekDateSet = useMemo(() => new Set(weekDays.map((w) => w.dateKey)), [weekDays]);

  const weeklyLogs = useMemo(() => {
    return questionLogs.filter((log) => weekDateSet.has(log.date));
  }, [questionLogs, weekDateSet]);

  // Weekly Stats: Total Questions & Total Minutes (including NetFocus)
  const weeklyTotalQuestions = useMemo(() => {
    return weeklyLogs.reduce((sum, l) => sum + (l.count || 0), 0);
  }, [weeklyLogs]);

  const weeklyTotalMinutes = useMemo(() => {
    return weeklyLogs.reduce((sum, l) => sum + (l.durationMinutes || 0), 0);
  }, [weeklyLogs]);

  const dailyAverageQuestions = useMemo(() => {
    return (weeklyTotalQuestions / 7).toFixed(0);
  }, [weeklyTotalQuestions]);

  const dailyAverageMinutes = useMemo(() => {
    return Math.round(weeklyTotalMinutes / 7);
  }, [weeklyTotalMinutes]);

  // Group weekly logs for the question matrix (ONLY include logs with count > 0)
  const matrixData = useMemo(() => {
    const data: Record<
      string,
      {
        total: number;
        color: string;
        topics: Record<string, { total: number; days: Record<string, number> }>;
      }
    > = {};

    weeklyLogs
      .filter((log) => (log.count || 0) > 0)
      .forEach((log) => {
        const subj = log.subjectName || 'Diğer';
        const topic = log.topicName || 'Genel';
        const count = Number(log.count) || 0;

        if (!data[subj]) {
          const found = YKS_SUBJECTS.find((s) => s.name === subj);
          data[subj] = {
            total: 0,
            color: found?.color || 'var(--color-accent)',
            topics: {}
          };
        }
        data[subj].total += count;

        if (!data[subj].topics[topic]) {
          data[subj].topics[topic] = {
            total: 0,
            days: {}
          };
        }
        data[subj].topics[topic].total += count;
        data[subj].topics[topic].days[log.date] =
          (data[subj].topics[topic].days[log.date] || 0) + count;
      });

    return data;
  }, [weeklyLogs]);

  // Daily question totals across all subjects
  const dailyTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    weekDays.forEach((w) => {
      totals[w.dateKey] = 0;
    });
    weeklyLogs.forEach((l) => {
      if (totals[l.date] !== undefined) {
        totals[l.date] += l.count || 0;
      }
    });
    return totals;
  }, [weeklyLogs, weekDays]);

  // Daily study minutes (General Study Time + NetFocus Pomodoro sessions)
  const dailyMinutes = useMemo(() => {
    const totals: Record<string, number> = {};
    weekDays.forEach((w) => {
      totals[w.dateKey] = 0;
    });
    weeklyLogs.forEach((l) => {
      if (totals[l.date] !== undefined) {
        totals[l.date] += l.durationMinutes || 0;
      }
    });
    return totals;
  }, [weeklyLogs, weekDays]);

  // Available topics for selected modal subject
  const currentSubjectTopics = useMemo(() => {
    const subj = YKS_SUBJECTS.find((s) => s.name === modalSubject);
    return subj?.topics || [];
  }, [modalSubject]);

  const handleOpenAdd = (dateKey?: string, defaultSubject?: string) => {
    sounds.playClick();
    setSelectedDate(dateKey || todayKey);
    if (defaultSubject) {
      setModalSubject(defaultSubject);
      const sub = YKS_SUBJECTS.find((s) => s.name === defaultSubject);
      setModalTopic(sub?.topics[0] || 'Genel Soru Çözümü');
    }
    setShowAddModal(true);
  };

  const handleOpenStudyTime = (dateKey?: string) => {
    sounds.playClick();
    setStudyTimeDate(dateKey || todayKey);
    setShowStudyTimeModal(true);
  };

  const handleSubjectChange = (newSubject: string) => {
    setModalSubject(newSubject);
    const sub = YKS_SUBJECTS.find((s) => s.name === newSubject);
    if (sub && sub.topics.length > 0) {
      setModalTopic(sub.topics[0]);
      setIsCustomTopic(false);
    } else {
      setModalTopic('Genel Soru Çözümü');
    }
  };

  // Submit Question Log (minutes is always 0 for questions now)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTopic = isCustomTopic
      ? customTopicText.trim() || 'Özel Konu'
      : modalTopic.trim() || 'Genel';

    const corr = modalCorrect ? Number(modalCorrect) : undefined;
    const wrg = modalWrong ? Number(modalWrong) : undefined;

    onAddQuestionLog(
      modalSubject,
      finalTopic,
      modalSource.trim() || 'Soru Bankası',
      modalCount,
      0, // Soru çözümünde dakika istenmiyor, genel çalışma süresine ayrıldı!
      selectedDate,
      corr,
      wrg
    );

    setShowAddModal(false);
    setCustomTopicText('');
    setIsCustomTopic(false);
    setModalCorrect('');
    setModalWrong('');
  };

  // Submit General Study Time Log (count is 0, durationMinutes is studyMinutes)
  const handleStudyTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalActivity = isCustomActivity
      ? customActivity.trim() || 'Genel Çalışma'
      : studyActivity;

    onAddQuestionLog(
      finalActivity,
      'Genel Çalışma Süresi',
      'Etüt & Odak Seansı',
      0,
      studyMinutes,
      studyTimeDate
    );

    setShowStudyTimeModal(false);
    setCustomActivity('');
    setIsCustomActivity(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* HEADER CARD: TITLE & WEEK NAVIGATION */}
      <div
        className="app-card"
        style={{
          background: 'linear-gradient(180deg, rgba(20, 24, 34, 0.95) 0%, rgba(13, 16, 24, 0.98) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 20,
          padding: isDesktop ? '18px 22px' : '16px 14px'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16
          }}
        >
          {/* Title & Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.25) 0%, rgba(0, 240, 255, 0.15) 100%)',
                border: '1px solid rgba(10, 132, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <BarChart2 size={20} color="var(--color-accent)" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', letterSpacing: -0.3 }}>
                Haftalık Soru Çözüm Çizelgesi
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>
                Ders ve konu bazlı soru adetleri, günlük dağılım ve hedefler
              </div>
            </div>
          </div>

          {/* Action Buttons: View Toggle + Add Study Time + Add Question */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div
              style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 10,
                padding: 3,
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setViewMode('matrix');
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 11.5,
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'matrix' ? 'var(--color-accent)' : 'transparent',
                  color: viewMode === 'matrix' ? '#FFFFFF' : 'var(--color-text-dim)',
                  transition: 'all 0.15s ease'
                }}
              >
                📊 Matris Tablo
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setViewMode('cards');
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 11.5,
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'cards' ? 'var(--color-accent)' : 'transparent',
                  color: viewMode === 'cards' ? '#FFFFFF' : 'var(--color-text-dim)',
                  transition: 'all 0.15s ease'
                }}
              >
                🗓️ Günlük Kartlar
              </button>
            </div>

            {/* General Study Time Button */}
            <button
              onClick={() => handleOpenStudyTime(todayKey)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 13px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(48, 209, 88, 0.2) 0%, rgba(52, 199, 89, 0.1) 100%)',
                color: '#30D158',
                border: '1px solid rgba(48, 209, 88, 0.35)',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
              title="Masa başı veya etüt çalışma süresini genel olarak ekleyin"
            >
              <Clock size={15} />
              <span>Süre Ekle</span>
            </button>

            {/* Add Question Button */}
            <button
              onClick={() => handleOpenAdd(todayKey)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: 12,
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(10, 132, 255, 0.35)',
                whiteSpace: 'nowrap'
              }}
            >
              <Plus size={15} />
              <span>Soru Ekle</span>
            </button>
          </div>
        </div>

        {/* Week Navigator Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 12,
            padding: '8px 12px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <button
            onClick={handlePrevWeek}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 10px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={16} />
            <span style={{ display: isDesktop ? 'inline' : 'none' }}>Önceki Hafta</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CalendarIcon size={16} color="var(--color-accent)" />
            <span style={{ fontSize: 13, fontWeight: 900, color: '#FFFFFF' }}>{weekLabel}</span>
            {!isCurrentWeek && (
              <button
                onClick={handleGoToday}
                style={{
                  padding: '3px 9px',
                  borderRadius: 99,
                  background: 'rgba(10, 132, 255, 0.15)',
                  border: '1px solid var(--color-accent)',
                  color: 'var(--color-accent)',
                  fontSize: 10.5,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Bu Haftaya Dön
              </button>
            )}
          </div>

          <button
            onClick={handleNextWeek}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 10px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <span style={{ display: isDesktop ? 'inline' : 'none' }}>Sonraki Hafta</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Weekly Metric Pills */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
            gap: 10,
            marginTop: 14
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 12,
              padding: '10px 12px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Haftalık Soru Çözümü</div>
            <div style={{ fontSize: 19, fontWeight: 900, color: 'var(--color-accent)', marginTop: 2 }}>
              {weeklyTotalQuestions} <span style={{ fontSize: 12, color: 'var(--color-text-dim)', fontWeight: 600 }}>Soru</span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 12,
              padding: '10px 12px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Toplam Çalışma Süresi</div>
            <div style={{ fontSize: 19, fontWeight: 900, color: '#30D158', marginTop: 2 }}>
              {weeklyTotalMinutes >= 60 ? (
                <>
                  {Math.floor(weeklyTotalMinutes / 60)}s {weeklyTotalMinutes % 60}d
                </>
              ) : (
                <>{weeklyTotalMinutes} dk</>
              )}
            </div>
            <div style={{ fontSize: 10, color: 'var(--color-text-dim)', marginTop: 2 }}>
              NetFocus + Genel Etüt Dahil
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 12,
              padding: '10px 12px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Günlük Soru Ortalaması</div>
            <div style={{ fontSize: 19, fontWeight: 900, color: '#FF9F0A', marginTop: 2 }}>
              {dailyAverageQuestions}{' '}
              <span style={{ fontSize: 12, color: 'var(--color-text-dim)', fontWeight: 600 }}>Soru/Gün</span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 12,
              padding: '10px 12px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Günlük Ortalama Çalışma</div>
            <div style={{ fontSize: 19, fontWeight: 900, color: '#BF5AF2', marginTop: 2 }}>
              {dailyAverageMinutes >= 60
                ? `${(dailyAverageMinutes / 60).toFixed(1)} Saat`
                : `${dailyAverageMinutes} dk`}
            </div>
            <div style={{ fontSize: 10, color: 'var(--color-text-dim)', marginTop: 2 }}>
              Ortalama Odak Süresi
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: MATRIX TABLE (DESK / COACHING SHEET) */}
      {viewMode === 'matrix' && (
        <div
          className="app-card"
          style={{
            background: 'linear-gradient(180deg, rgba(20, 24, 34, 0.95) 0%, rgba(13, 16, 24, 0.98) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 20,
            padding: 0,
            overflow: 'hidden'
          }}
        >
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: 720,
                textAlign: 'left'
              }}
            >
              <thead>
                <tr
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <th
                    style={{
                      padding: '12px 16px',
                      fontSize: 12,
                      fontWeight: 800,
                      color: 'var(--color-text-muted)',
                      width: '30%'
                    }}
                  >
                    Ders & Konu
                  </th>
                  {weekDays.map((day) => (
                    <th
                      key={day.dateKey}
                      style={{
                        padding: '10px 8px',
                        textAlign: 'center',
                        fontSize: 11.5,
                        fontWeight: 800,
                        color: day.isToday ? 'var(--color-accent)' : 'var(--color-text-dim)',
                        background: day.isToday ? 'rgba(10, 132, 255, 0.08)' : 'transparent',
                        borderLeft: '1px solid rgba(255, 255, 255, 0.06)'
                      }}
                    >
                      <div style={{ fontWeight: 900 }}>{day.dayNameShort}</div>
                      <div style={{ fontSize: 10, opacity: 0.8, marginTop: 1 }}>{day.dayNumber} {day.monthName}</div>
                    </th>
                  ))}
                  <th
                    style={{
                      padding: '12px 14px',
                      textAlign: 'center',
                      fontSize: 12,
                      fontWeight: 900,
                      color: 'var(--color-accent)',
                      background: 'rgba(10, 132, 255, 0.06)',
                      borderLeft: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    Toplam
                  </th>
                </tr>
              </thead>

              <tbody>
                {Object.keys(matrixData).length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        textAlign: 'center',
                        padding: '40px 16px',
                        color: 'var(--color-text-muted)'
                      }}
                    >
                      <BookOpen size={36} color="var(--color-text-dim)" style={{ margin: '0 auto 10px auto' }} />
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
                        Bu haftaya ait soru kaydı henüz yok.
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-dim)', marginBottom: 14 }}>
                        Çözdüğün soruları ders ve konu seçerek ekle, haftalık çizelgen otomatik dolsun.
                      </div>
                      <button
                        onClick={() => handleOpenAdd(todayKey)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 99,
                          background: 'var(--color-accent)',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        + İlk Soru Kaydını Ekle
                      </button>
                    </td>
                  </tr>
                ) : (
                  Object.entries(matrixData).map(([subjectName, subjData]) => (
                    <React.Fragment key={subjectName}>
                      {/* Subject Header Row */}
                      <tr
                        style={{
                          background: 'rgba(255, 255, 255, 0.025)',
                          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                      >
                        <td
                          colSpan={9}
                          style={{
                            padding: '9px 16px',
                            fontSize: 12.5,
                            fontWeight: 900,
                            color: subjData.color || '#FFF'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  background: subjData.color || 'var(--color-accent)'
                                }}
                              />
                              <span>{subjectName}</span>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-dim)' }}>
                              Haftalık: <strong style={{ color: '#FFF' }}>{subjData.total}</strong> soru
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Topic Rows */}
                      {Object.entries(subjData.topics).map(([topicName, topicData]) => (
                        <tr
                          key={`${subjectName}-${topicName}`}
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                            transition: 'background 0.15s ease'
                          }}
                        >
                          {/* Topic Name */}
                          <td
                            style={{
                              padding: '10px 16px 10px 28px',
                              fontSize: 12,
                              color: '#E0E6F0',
                              fontWeight: 600
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ color: 'var(--color-text-dim)' }}>↳</span>
                              <span>{topicName}</span>
                            </div>
                          </td>

                          {/* Day Columns */}
                          {weekDays.map((day) => {
                            const count = topicData.days[day.dateKey] || 0;
                            return (
                              <td
                                key={day.dateKey}
                                onClick={() => handleOpenAdd(day.dateKey, subjectName)}
                                title={`${day.dayNameFull}: ${count > 0 ? `${count} Soru` : 'Tıkla ve Soru Ekle'}`}
                                style={{
                                  padding: '10px 6px',
                                  textAlign: 'center',
                                  fontSize: 12,
                                  fontWeight: count > 0 ? 800 : 500,
                                  color: count > 0 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.18)',
                                  background:
                                    count > 0
                                      ? 'rgba(10, 132, 255, 0.1)'
                                      : day.isToday
                                      ? 'rgba(10, 132, 255, 0.03)'
                                      : 'transparent',
                                  borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
                                  cursor: 'pointer'
                                }}
                              >
                                {count > 0 ? count : '-'}
                              </td>
                            );
                          })}

                          {/* Topic Total */}
                          <td
                            style={{
                              padding: '10px 12px',
                              textAlign: 'center',
                              fontSize: 12.5,
                              fontWeight: 900,
                              color: 'var(--color-accent)',
                              background: 'rgba(10, 132, 255, 0.04)',
                              borderLeft: '1px solid rgba(255, 255, 255, 0.08)'
                            }}
                          >
                            {topicData.total}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </tbody>

              {/* FOOTER ROWS: 1) DAILY TOTAL QUESTIONS, 2) DAILY TOTAL STUDY MINUTES */}
              {Object.keys(matrixData).length > 0 && (
                <tfoot>
                  {/* Row 1: Soru Toplamı */}
                  <tr
                    style={{
                      background: 'rgba(10, 132, 255, 0.08)',
                      borderTop: '2px solid rgba(10, 132, 255, 0.3)'
                    }}
                  >
                    <td
                      style={{
                        padding: '11px 16px',
                        fontSize: 12,
                        fontWeight: 900,
                        color: '#FFFFFF'
                      }}
                    >
                      📊 GÜNLÜK TOPLAM SORU
                    </td>
                    {weekDays.map((day) => {
                      const daySum = dailyTotals[day.dateKey] || 0;
                      return (
                        <td
                          key={day.dateKey}
                          style={{
                            padding: '11px 6px',
                            textAlign: 'center',
                            fontSize: 12.5,
                            fontWeight: 900,
                            color: daySum > 0 ? '#FFFFFF' : 'var(--color-text-dim)',
                            borderLeft: '1px solid rgba(255, 255, 255, 0.06)'
                          }}
                        >
                          {daySum > 0 ? daySum : 0}
                        </td>
                      );
                    })}
                    <td
                      style={{
                        padding: '11px 12px',
                        textAlign: 'center',
                        fontSize: 13.5,
                        fontWeight: 900,
                        color: 'var(--color-accent)',
                        borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
                        background: 'rgba(10, 132, 255, 0.15)'
                      }}
                    >
                      {weeklyTotalQuestions}
                    </td>
                  </tr>

                  {/* Row 2: Çalışma Süresi Toplamı (NetFocus + Genel Etüt) */}
                  <tr
                    style={{
                      background: 'rgba(48, 209, 88, 0.06)',
                      borderTop: '1px solid rgba(48, 209, 88, 0.2)'
                    }}
                  >
                    <td
                      style={{
                        padding: '10px 16px',
                        fontSize: 11.5,
                        fontWeight: 900,
                        color: '#30D158'
                      }}
                    >
                      ⏱️ ÇALIŞMA SÜRESİ (NetFocus + Etüt)
                    </td>
                    {weekDays.map((day) => {
                      const dayMins = dailyMinutes[day.dateKey] || 0;
                      return (
                        <td
                          key={day.dateKey}
                          onClick={() => handleOpenStudyTime(day.dateKey)}
                          title={`${day.dayNameFull}: ${dayMins > 0 ? `${dayMins} dakika çalışma` : 'Süre eklemek için tıkla'}`}
                          style={{
                            padding: '10px 6px',
                            textAlign: 'center',
                            fontSize: 11,
                            fontWeight: 800,
                            color: dayMins > 0 ? '#30D158' : 'var(--color-text-dim)',
                            borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
                            cursor: 'pointer'
                          }}
                        >
                          {dayMins > 0
                            ? dayMins >= 60
                              ? `${Math.floor(dayMins / 60)}s ${dayMins % 60}d`
                              : `${dayMins} dk`
                            : '-'}
                        </td>
                      );
                    })}
                    <td
                      style={{
                        padding: '10px 12px',
                        textAlign: 'center',
                        fontSize: 12.5,
                        fontWeight: 900,
                        color: '#30D158',
                        borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
                        background: 'rgba(48, 209, 88, 0.12)'
                      }}
                    >
                      {weeklyTotalMinutes >= 60
                        ? `${Math.floor(weeklyTotalMinutes / 60)}s ${weeklyTotalMinutes % 60}d`
                        : `${weeklyTotalMinutes} dk`}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: DAILY CARDS BREAKDOWN */}
      {viewMode === 'cards' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr',
            gap: 12
          }}
        >
          {weekDays.map((day) => {
            const dayLogs = weeklyLogs.filter((l) => l.date === day.dateKey);
            const dayTotal = dayLogs.reduce((s, l) => s + (l.count || 0), 0);
            const dayTotalMinutes = dayLogs.reduce((s, l) => s + (l.durationMinutes || 0), 0);

            return (
              <div
                key={day.dateKey}
                className="app-card"
                style={{
                  background: day.isToday
                    ? 'linear-gradient(180deg, rgba(20, 28, 44, 0.95) 0%, rgba(13, 18, 30, 0.98) 100%)'
                    : 'linear-gradient(180deg, rgba(20, 24, 34, 0.9) 0%, rgba(13, 16, 24, 0.95) 100%)',
                  border: day.isToday
                    ? '1.5px solid var(--color-accent)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 18,
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                {/* Day Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 900,
                        color: day.isToday ? 'var(--color-accent)' : '#FFFFFF'
                      }}
                    >
                      {day.dayNameFull}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>
                      {day.dayNumber} {day.monthName}
                    </span>
                    {day.isToday && (
                      <span
                        style={{
                          fontSize: 9.5,
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: 99,
                          background: 'rgba(10, 132, 255, 0.2)',
                          color: 'var(--color-accent)',
                          border: '1px solid rgba(10, 132, 255, 0.35)'
                        }}
                      >
                        BUGÜN
                      </span>
                    )}
                  </div>

                  {/* Header Action Buttons: Add Time + Add Question */}
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button
                      onClick={() => handleOpenStudyTime(day.dateKey)}
                      title="Bu güne çalışma süresi ekle"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        padding: '4px 7px',
                        borderRadius: 7,
                        background: 'rgba(48, 209, 88, 0.12)',
                        border: '1px solid rgba(48, 209, 88, 0.25)',
                        color: '#30D158',
                        fontSize: 10.5,
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      <Clock size={11} />
                      <span>Süre</span>
                    </button>

                    <button
                      onClick={() => handleOpenAdd(day.dateKey)}
                      title="Bu güne soru çözümü ekle"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        padding: '4px 8px',
                        borderRadius: 7,
                        background: 'rgba(10, 132, 255, 0.12)',
                        border: '1px solid rgba(10, 132, 255, 0.25)',
                        color: 'var(--color-accent)',
                        fontSize: 10.5,
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      <Plus size={12} />
                      <span>Soru</span>
                    </button>
                  </div>
                </div>

                {/* Day Total Bar (Questions + Total Study Duration) */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 10,
                    background: 'rgba(0, 0, 0, 0.25)',
                    fontSize: 11.5
                  }}
                >
                  <span style={{ color: 'var(--color-text-muted)' }}>Günlük Toplam:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <strong style={{ color: 'var(--color-accent)' }}>{dayTotal} Soru</strong>
                    <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</span>
                    <strong style={{ color: '#30D158' }}>
                      {dayTotalMinutes >= 60
                        ? `${Math.floor(dayTotalMinutes / 60)}s ${dayTotalMinutes % 60}d`
                        : `${dayTotalMinutes} dk`}{' '}
                      Çalışma
                    </strong>
                  </div>
                </div>

                {/* Logged Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {dayLogs.length === 0 ? (
                    <div
                      style={{
                        padding: '12px 0',
                        textAlign: 'center',
                        fontSize: 11.5,
                        color: 'var(--color-text-dim)'
                      }}
                    >
                      Henüz kayıt girilmedi.
                    </div>
                  ) : (
                    dayLogs.map((log) => {
                      const isStudySession = (log.count || 0) === 0 && (log.durationMinutes || 0) > 0;
                      const sub = YKS_SUBJECTS.find((s) => s.name === log.subjectName);

                      // 1. General Study Time or NetFocus Session
                      if (isStudySession) {
                        return (
                          <div
                            key={log.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 10px',
                              borderRadius: 10,
                              background: 'rgba(48, 209, 88, 0.08)',
                              border: '1px solid rgba(48, 209, 88, 0.2)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  width: 26,
                                  height: 26,
                                  borderRadius: 8,
                                  background: 'rgba(48, 209, 88, 0.18)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#30D158',
                                  flexShrink: 0
                                }}
                              >
                                <Clock size={14} />
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 12, fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {log.subjectName}
                                </div>
                                <div style={{ fontSize: 10.5, color: 'var(--color-text-muted)' }}>
                                  {log.sourceBook || 'Odak & Çalışma Seansı'}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                              <span
                                style={{
                                  padding: '3px 8px',
                                  borderRadius: 99,
                                  background: 'rgba(48, 209, 88, 0.2)',
                                  color: '#30D158',
                                  fontSize: 11,
                                  fontWeight: 800
                                }}
                              >
                                {log.durationMinutes} dk
                              </span>

                              <button
                                onClick={() => onDeleteQuestionLog(log.id)}
                                title="Kaydı Sil"
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: 'var(--color-text-dim)',
                                  cursor: 'pointer',
                                  padding: 4
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        );
                      }

                      // 2. Question Log Entry (No minutes required!)
                      return (
                        <div
                          key={log.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            borderRadius: 10,
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)'
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  background: sub?.color || 'var(--color-accent)',
                                  flexShrink: 0
                                }}
                              />
                              <span style={{ fontSize: 12, fontWeight: 800, color: '#FFFFFF' }}>
                                {log.subjectName}
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: 'var(--color-text-muted)',
                                marginTop: 2,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {log.topicName || 'Genel Soru'} • {log.sourceBook || 'Soru Bankası'}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--color-accent)' }}>
                                {log.count} Soru
                              </div>
                              {(log.correctCount !== undefined || log.wrongCount !== undefined) && (
                                <div style={{ fontSize: 10, color: 'var(--color-text-dim)', display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                                  {log.correctCount !== undefined && (
                                    <span style={{ color: '#30D158' }}>✓{log.correctCount}</span>
                                  )}
                                  {log.wrongCount !== undefined && (
                                    <span style={{ color: '#FF453A' }}>✗{log.wrongCount}</span>
                                  )}
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => onDeleteQuestionLog(log.id)}
                              title="Kaydı Sil"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--color-text-dim)',
                                cursor: 'pointer',
                                padding: 4
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QUICK ADD MODAL WITH DERS & KONU SEÇİMİ */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(5, 7, 12, 0.82)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 440,
              background: 'linear-gradient(180deg, #1A1D26 0%, #12141C 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 22,
              padding: '22px 20px',
              color: '#FFFFFF',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 900, margin: 0, letterSpacing: -0.3 }}>
                  Soru Çözümü Ekle
                </h3>
                <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 2 }}>
                  Ders, konu ve soru adedini belirleyip çizelgene kaydet
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer'
                }}
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Tarih Seçimi */}
              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: '#C8CFDC', marginBottom: 5 }}>
                  📅 Çözüldüğü Gün
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: 12.5,
                    outline: 'none'
                  }}
                >
                  {weekDays.map((d) => (
                    <option key={d.dateKey} value={d.dateKey} style={{ background: '#1A1D26' }}>
                      {d.dayNameFull} ({d.dayNumber} {d.monthName}) {d.isToday ? '• Bugün' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ders Seçimi */}
              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: '#C8CFDC', marginBottom: 5 }}>
                  📚 Ders Seçin *
                </label>
                <select
                  value={modalSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: 12.5,
                    outline: 'none'
                  }}
                >
                  <optgroup label="TYT Dersleri" style={{ background: '#1A1D26', fontWeight: 800 }}>
                    {YKS_SUBJECTS.filter((s) => s.category === 'TYT').map((s) => (
                      <option key={s.code} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="AYT Dersleri" style={{ background: '#1A1D26', fontWeight: 800 }}>
                    {YKS_SUBJECTS.filter((s) => s.category === 'AYT').map((s) => (
                      <option key={s.code} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Konu Seçimi */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <label style={{ fontSize: 11.5, fontWeight: 800, color: '#C8CFDC' }}>
                    🎯 Konu Seçin *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomTopic(!isCustomTopic)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-accent)',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    {isCustomTopic ? 'Listeden Seç' : '+ Farklı Konu Yaz'}
                  </button>
                </div>

                {isCustomTopic ? (
                  <input
                    type="text"
                    placeholder="Konu adı yazın (ör: Karma Deneme, İleri Düzey Problemler...)"
                    value={customTopicText}
                    onChange={(e) => setCustomTopicText(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: 12.5,
                      outline: 'none'
                    }}
                  />
                ) : (
                  <select
                    value={modalTopic}
                    onChange={(e) => setModalTopic(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: 12.5,
                      outline: 'none'
                    }}
                  >
                    {currentSubjectTopics.map((top) => (
                      <option key={top} value={top} style={{ background: '#1A1D26' }}>
                        {top}
                      </option>
                    ))}
                    <option value="Genel Soru Çözümü" style={{ background: '#1A1D26' }}>
                      Genel / Karma Soru Çözümü
                    </option>
                  </select>
                )}
              </div>

              {/* Soru Sayısı (Dakika kaldırıldı, genel çalışma süresine ayrıldı) */}
              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: '#C8CFDC', marginBottom: 5 }}>
                  Çözülen Soru Sayısı *
                </label>
                <input
                  type="number"
                  min="1"
                  max="2000"
                  value={modalCount}
                  onChange={(e) => setModalCount(Number(e.target.value))}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: 15,
                    fontWeight: 900,
                    outline: 'none'
                  }}
                />
                {/* Quick Add Buttons */}
                <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
                  {[10, 20, 30, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setModalCount((prev) => prev + amt)}
                      style={{
                        flex: 1,
                        padding: '5px 0',
                        borderRadius: 6,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: 'var(--color-text-dim)',
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      +{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kaynak Kitap / Yayın */}
              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: '#C8CFDC', marginBottom: 5 }}>
                  📖 Kaynak / Yayın (İsteğe Bağlı)
                </label>
                <input
                  type="text"
                  placeholder="Ör: 3D Soru Bankası Test 4, Bilgi Sarmal..."
                  value={modalSource}
                  onChange={(e) => setModalSource(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: 12,
                    outline: 'none'
                  }}
                />
              </div>

              {/* Doğru & Yanlış (Opsiyonel) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: '#30D158', marginBottom: 5 }}>
                    ✓ Doğru Sayısı (İsteğe Bağlı)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ör: 26"
                    value={modalCorrect}
                    onChange={(e) => setModalCorrect(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: 12.5,
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: '#FF453A', marginBottom: 5 }}>
                    ✗ Yanlış Sayısı (İsteğe Bağlı)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ör: 4"
                    value={modalWrong}
                    onChange={(e) => setModalWrong(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: 12.5,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  marginTop: 6,
                  padding: '12px 0',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(10, 132, 255, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <CheckCircle2 size={16} />
                <span>Çizelgeye Kaydet</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: GENERAL STUDY TIME MODAL (GENEL ÇALIŞMA SÜRESİ EKLE) */}
      {showStudyTimeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(5, 7, 12, 0.82)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}
          onClick={() => setShowStudyTimeModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 480,
              background: '#141824',
              border: '1px solid rgba(48, 209, 88, 0.25)',
              borderRadius: 20,
              padding: 22,
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #30D158 0%, #248A3D 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFF'
                  }}
                >
                  <Clock size={19} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF' }}>
                    Çalışma Süresi Ekle
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                    Masa başı etüt ve konu çalışma sürenizi gün bazında kaydedin
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowStudyTimeModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 8,
                  color: 'var(--color-text-dim)',
                  cursor: 'pointer',
                  padding: 6
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Info Hint about NetFocus */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 12px',
                borderRadius: 10,
                background: 'rgba(10, 132, 255, 0.1)',
                border: '1px solid rgba(10, 132, 255, 0.25)',
                fontSize: 11.5,
                color: '#80BFFF'
              }}
            >
              <Sparkles size={14} style={{ flexShrink: 0 }} />
              <span>NetFocus Pomodoro seanslarınız otomatik olarak buraya eklenir.</span>
            </div>

            <form onSubmit={handleStudyTimeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Tarih Seçimi */}
              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: '#C8CFDC', marginBottom: 5 }}>
                  📅 Tarih *
                </label>
                <input
                  type="date"
                  value={studyTimeDate}
                  onChange={(e) => setStudyTimeDate(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: 700,
                    outline: 'none'
                  }}
                />
              </div>

              {/* Aktivite / Çalışma Türü */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 11.5, fontWeight: 800, color: '#C8CFDC' }}>
                    📖 Çalışma Alanı / Aktivite *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomActivity(!isCustomActivity)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#30D158',
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    {isCustomActivity ? '← Önerilenlerden Seç' : '+ Farklı Başlık Yaz'}
                  </button>
                </div>

                {isCustomActivity ? (
                  <input
                    type="text"
                    placeholder="Ör: Geometri üçgenler video izleme..."
                    value={customActivity}
                    onChange={(e) => setCustomActivity(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: 13,
                      outline: 'none'
                    }}
                  />
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {PRESET_ACTIVITIES.map((act) => {
                      const isSel = studyActivity === act;
                      return (
                        <button
                          key={act}
                          type="button"
                          onClick={() => setStudyActivity(act)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 8,
                            fontSize: 11.5,
                            fontWeight: isSel ? 800 : 600,
                            background: isSel ? 'rgba(48, 209, 88, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                            border: isSel ? '1px solid #30D158' : '1px solid rgba(255, 255, 255, 0.08)',
                            color: isSel ? '#30D158' : 'var(--color-text-dim)',
                            cursor: 'pointer'
                          }}
                        >
                          {act}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Süre (Dakika) ve Hızlı Ön Ayarlar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <label style={{ fontSize: 11.5, fontWeight: 800, color: '#C8CFDC' }}>
                    ⏱️ Çalışma Süresi (Dakika) *
                  </label>
                  <span style={{ fontSize: 11.5, fontWeight: 900, color: '#30D158' }}>
                    {studyMinutes >= 60
                      ? `${Math.floor(studyMinutes / 60)} Saat ${studyMinutes % 60 > 0 ? `${studyMinutes % 60} Dk` : ''}`
                      : `${studyMinutes} Dakika`}
                  </span>
                </div>
                <input
                  type="number"
                  min="5"
                  max="1440"
                  step="5"
                  value={studyMinutes}
                  onChange={(e) => setStudyMinutes(Number(e.target.value))}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: 15,
                    fontWeight: 900,
                    outline: 'none'
                  }}
                />

                {/* Quick Minute Preset Buttons */}
                <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
                  {[30, 45, 60, 90, 120, 180].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setStudyMinutes(mins)}
                      style={{
                        flex: 1,
                        padding: '5px 0',
                        borderRadius: 6,
                        background: studyMinutes === mins ? 'rgba(48, 209, 88, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: studyMinutes === mins ? '1px solid #30D158' : '1px solid rgba(255, 255, 255, 0.08)',
                        color: studyMinutes === mins ? '#30D158' : 'var(--color-text-dim)',
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {mins >= 60 ? `${mins / 60}s` : `${mins}d`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  marginTop: 6,
                  padding: '12px 0',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #30D158 0%, #248A3D 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(48, 209, 88, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <CheckCircle2 size={16} />
                <span>Çalışma Süresini Kaydet</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
