import React, { useState } from 'react';
import { Mail, Lock, User, GraduationCap, Compass, ArrowRight, Check, X } from 'lucide-react';
import { sounds } from '../lib/sound';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: {
    email: string;
    pass: string;
    name: string;
    classLevel: string;
    fieldTrack: 'sayisal' | 'sozel' | 'esit_agirlik' | 'dil';
  }) => Promise<void>;
  onLogin: (email: string, pass: string) => Promise<void>;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  onLogin
}) => {
  const [tab, setTab] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [classLevel, setClassLevel] = useState<'9' | '10' | '11' | '12' | 'mezun'>('12');
  const [fieldTrack, setFieldTrack] = useState<'sayisal' | 'esit_agirlik' | 'sozel' | 'dil'>('sayisal');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Lütfen adınızı ve soyadınızı girin.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);
    try {
      await onRegister({
        email: email.trim(),
        pass: password,
        name: name.trim(),
        classLevel,
        fieldTrack
      });
      onClose();
    } catch (err: any) {
      console.error('Kayıt hatası:', err);
      setError(err?.message || 'Hesap oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Lütfen e-posta adresinizi girin.');
      return;
    }
    if (!password) {
      setError('Lütfen şifrenizi girin.');
      return;
    }

    setLoading(true);
    try {
      await onLogin(email.trim(), password);
      onClose();
    } catch (err: any) {
      console.error('Giriş hatası:', err);
      setError(err?.message || 'Giriş yapılamadı. E-posta veya şifrenizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(5, 7, 12, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'linear-gradient(180deg, #1A1D26 0%, #12141C 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 22,
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(10, 132, 255, 0.12)',
          padding: '24px 22px',
          color: '#FFFFFF',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: 18, position: 'relative' }}>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            title="Kapat (Misafir Modu)"
            style={{
              position: 'absolute',
              top: -6,
              right: -4,
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>

          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              overflow: 'hidden',
              border: '1.5px solid rgba(10, 132, 255, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
              boxShadow: '0 8px 24px rgba(10, 132, 255, 0.35)'
            }}
          >
            <img src="/logo.jpg" alt="NetMetrik" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
            NetMetrik'e Hoş Geldin!
          </h2>
          <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>
            {tab === 'register'
              ? 'YKS hazırlığını akıllı analizler ve bulut eşitlemesiyle zirveye taşı.'
              : 'Hesabına giriş yaparak çalışmalarına kaldığın yerden devam et.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.35)',
            borderRadius: 12,
            padding: 4,
            marginBottom: 18,
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setTab('register');
              setError(null);
            }}
            style={{
              flex: 1,
              padding: '9px 0',
              fontSize: 12.5,
              fontWeight: 800,
              borderRadius: 9,
              background: tab === 'register' ? 'var(--color-accent)' : 'transparent',
              color: tab === 'register' ? '#FFFFFF' : 'var(--color-text-muted)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            ✨ Hesap Oluştur (Kayıt Ol)
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setTab('login');
              setError(null);
            }}
            style={{
              flex: 1,
              padding: '9px 0',
              fontSize: 12.5,
              fontWeight: 800,
              borderRadius: 9,
              background: tab === 'login' ? 'var(--color-accent)' : 'transparent',
              color: tab === 'login' ? '#FFFFFF' : 'var(--color-text-muted)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            🔑 Giriş Yap
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              background: 'rgba(255, 69, 58, 0.14)',
              border: '1px solid rgba(255, 69, 58, 0.35)',
              borderRadius: 10,
              padding: '10px 12px',
              fontSize: 12,
              color: '#FF453A',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* REGISTER FORM */}
        {tab === 'register' ? (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Ad Soyad */}
            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: '#C8CFDC', marginBottom: 6 }}>
                Adın ve Soyadın *
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={16}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
                />
                <input
                  type="text"
                  placeholder="Örn: Ahmet Yılmaz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: 11,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: 13,
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Sınıf / Seviye Seçimi */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 800, color: '#C8CFDC', marginBottom: 6 }}>
                <GraduationCap size={15} color="var(--color-accent)" />
                <span>Kaçıncı Sınıfsın? / Seviyen *</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                {(
                  [
                    { id: '9', label: '9. Sınıf' },
                    { id: '10', label: '10. Sınıf' },
                    { id: '11', label: '11. Sınıf' },
                    { id: '12', label: '12. Sınıf' },
                    { id: 'mezun', label: 'Mezun' }
                  ] as const
                ).map((lvl) => {
                  const isSelected = classLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setClassLevel(lvl.id);
                      }}
                      style={{
                        padding: '8px 2px',
                        borderRadius: 10,
                        fontSize: 11.5,
                        fontWeight: 800,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                        background: isSelected ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.05)',
                        color: isSelected ? '#FFFFFF' : 'var(--color-text-dim)',
                        border: isSelected ? '1px solid var(--color-accent)' : '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: isSelected ? '0 3px 10px rgba(10, 132, 255, 0.35)' : 'none'
                      }}
                    >
                      {lvl.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alan Seçimi */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 800, color: '#C8CFDC', marginBottom: 6 }}>
                <Compass size={15} color="var(--color-accent)" />
                <span>Hedef Alanın *</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {(
                  [
                    { id: 'sayisal', label: 'Sayısal (MF)', icon: '📐' },
                    { id: 'esit_agirlik', label: 'Eşit Ağırlık (TM)', icon: '⚖️' },
                    { id: 'sozel', label: 'Sözel (TS)', icon: '📚' },
                    { id: 'dil', label: 'Dil (YDT)', icon: '🌍' }
                  ] as const
                ).map((track) => {
                  const isSelected = fieldTrack === track.id;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setFieldTrack(track.id);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: 8,
                        padding: '10px 12px',
                        borderRadius: 11,
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        background: isSelected ? 'rgba(10, 132, 255, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                        color: isSelected ? '#FFFFFF' : 'var(--color-text-dim)',
                        border: isSelected ? '1.5px solid var(--color-accent)' : '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: isSelected ? '0 4px 14px rgba(10, 132, 255, 0.25)' : 'none'
                      }}
                    >
                      <span style={{ fontSize: 16 }}>{track.icon}</span>
                      <span>{track.label}</span>
                      {isSelected && <Check size={14} color="var(--color-accent)" style={{ marginLeft: 'auto' }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* E-posta */}
            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: '#C8CFDC', marginBottom: 6 }}>
                E-posta Adresin *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
                />
                <input
                  type="email"
                  placeholder="Örn: ogrenci@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: 11,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: 13,
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Şifre */}
            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: '#C8CFDC', marginBottom: 6 }}>
                Şifren * (En az 6 karakter)
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: 11,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: 13,
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 6,
                padding: '12px 0',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 900,
                fontSize: 13.5,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 8px 24px rgba(10, 132, 255, 0.35)',
                transition: 'all 0.15s ease',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
                <span>Hesap Oluşturuluyor...</span>
              ) : (
                <>
                  <span>✨ Hesabımı Oluştur & Başla</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: '#C8CFDC', marginBottom: 6 }}>
                E-posta Adresin *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
                />
                <input
                  type="email"
                  placeholder="ogrenci@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: 11,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: 13,
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 800, color: '#C8CFDC', marginBottom: 6 }}>
                Şifren *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: 11,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: 13,
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 6,
                padding: '12px 0',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 900,
                fontSize: 13.5,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 8px 24px rgba(10, 132, 255, 0.35)',
                transition: 'all 0.15s ease',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
                <span>Giriş Yapılıyor...</span>
              ) : (
                <>
                  <span>🔑 Giriş Yap & Senkronize Et</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer info & Guest continue */}
        <div style={{ marginTop: 16, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
            🔒 Verileriniz Supabase bulutunda güvenle saklanır, telefon ve bilgisayarınızda otomatik eşitlenir.
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-dim)',
              fontSize: 11.5,
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 4
            }}
          >
            Şimdilik misafir olarak incele →
          </button>
        </div>
      </div>
    </div>
  );
};
