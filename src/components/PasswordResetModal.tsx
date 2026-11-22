import React, { useState } from 'react';
import { Lock, CheckCircle2, AlertCircle, X, KeyRound } from 'lucide-react';
import { updateUserPassword } from '../lib/supabase';
import { sounds } from '../lib/sound';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Girdiğiniz şifreler birbiriyle eşleşmiyor.');
      return;
    }

    try {
      setLoading(true);
      const { error: updateErr } = await updateUserPassword(newPassword);
      if (updateErr) {
        throw updateErr;
      }

      setSuccess(true);
      sounds.playSuccess();
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err?.message || 'Şifre güncellenirken bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: 'linear-gradient(180deg, #14161D 0%, #0B0D12 100%)',
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 22,
          padding: 26,
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(212, 255, 0, 0.1)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        {!loading && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: 4,
              display: 'flex'
            }}
          >
            <X size={18} />
          </button>
        )}

        {/* Header Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'rgba(212, 255, 0, 0.12)',
              border: '1.5px solid rgba(212, 255, 0, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent)'
            }}
          >
            <KeyRound size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#FFFFFF' }}>
              Yeni Şifre Belirle
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
              Hesabın için yeni ve güvenli bir şifre gir.
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {success ? (
          <div
            style={{
              padding: '16px',
              borderRadius: 14,
              background: 'rgba(48, 209, 88, 0.12)',
              border: '1px solid rgba(48, 209, 88, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              color: '#30D158'
            }}
          >
            <CheckCircle2 size={24} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>Şifreniz Güncellendi!</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>Yeni şifrenizle oturumunuz açıldı, yönlendiriliyorsunuz...</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Error Banner */}
            {error && (
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: 'rgba(255, 69, 58, 0.12)',
                  border: '1px solid rgba(255, 69, 58, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#FF453A',
                  fontSize: 12
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Input: New Password */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>
                Yeni Şifre
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  placeholder="En az 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 38px',
                    borderRadius: 12,
                    background: '#1C1E26',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    color: '#FFFFFF',
                    fontSize: 13,
                    boxSizing: 'border-box'
                  }}
                />
                <Lock
                  size={16}
                  color="var(--color-text-muted)"
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            {/* Input: Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>
                Yeni Şifre Tekrarı
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  placeholder="Şifreyi tekrar yazın"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 38px',
                    borderRadius: 12,
                    background: '#1C1E26',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    color: '#FFFFFF',
                    fontSize: 13,
                    boxSizing: 'border-box'
                  }}
                />
                <Lock
                  size={16}
                  color="var(--color-text-muted)"
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 6,
                padding: '12px 18px',
                borderRadius: 12,
                background: 'var(--color-accent)',
                color: '#0B0D12',
                border: 'none',
                fontWeight: 900,
                fontSize: 14,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 16px rgba(212, 255, 0, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              {loading ? 'Güncelleniyor...' : 'Şifreyi Kaydet & Giriş Yap'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
