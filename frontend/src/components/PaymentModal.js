import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, User, ShieldCheck, X, Loader } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { payBooking } from '../services/api';

export default function PaymentModal({ visible, booking, onClose, onPaymentSuccess }) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const { showToast } = useToast();

  useEffect(() => {
    if (visible) {
      setCardNumber('');
      setCardHolder('');
      setExpiry('');
      setCvv('');
      setLoading(false);
      setIsFlipped(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [visible]);

  if (!visible || !booking) return null;

  const tutorName = booking.tutor?.name || 'Tuteur';
  const price = booking.tutor?.price || 0;

  // Format card number: XXXX XXXX XXXX XXXX
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  // Format expiry date: MM/YY
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    setExpiry(value);
  };

  // Format CVV: XXX or XXXX
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCvv(value);
  };

  // Detect card brand
  const getCardBrand = () => {
    const rawNumber = cardNumber.replace(/\s/g, '');
    if (rawNumber.startsWith('4')) return 'visa';
    if (rawNumber.startsWith('5')) return 'mastercard';
    return 'generic';
  };

  const handlePay = async (e) => {
    e.preventDefault();
    
    const rawNumber = cardNumber.replace(/\s/g, '');
    if (rawNumber.length < 16) {
      showToast('Numéro de carte invalide (16 chiffres requis).', 'error');
      return;
    }
    if (cardHolder.trim().length < 3) {
      showToast('Nom du titulaire invalide.', 'error');
      return;
    }
    if (expiry.length < 5) {
      showToast("Date d'expiration invalide (format MM/YY).", 'error');
      return;
    }
    const [month, year] = expiry.split('/');
    const expMonth = parseInt(month, 10);
    const expYear = parseInt('20' + year, 10);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (expMonth < 1 || expMonth > 12) {
      showToast('Mois d\'expiration invalide.', 'error');
      return;
    }
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      showToast('La carte est expirée.', 'error');
      return;
    }
    if (cvv.length < 3) {
      showToast('Code CVV invalide (3 ou 4 chiffres requis).', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await payBooking(booking.id, {
        cardholder_name: cardHolder,
        card_number: rawNumber,
        expiry_date: expiry,
        cvv: cvv
      });
      showToast('Paiement réussi ! Votre séance est confirmée et payée.', 'success');
      if (onPaymentSuccess) {
        onPaymentSuccess(response.data.data);
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors du paiement. Veuillez réessayer.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const cardBrand = getCardBrand();

  return (
    <div className="pay-modal-backdrop" style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <style>{`
        .pay-modal-backdrop { background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(12px); animation: payFadeIn 0.3s ease; }
        .pay-modal { background: var(--bg-secondary); width: 100%; max-width: 580px; border-radius: var(--radius-lg); padding: 32px; box-shadow: 0 40px 100px rgba(0,0,0,0.3); border: 1px solid var(--border-light); position: relative; animation: paySlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); color: var(--text-primary); }
        .pay-close-btn { position: absolute; right: 24px; top: 24px; background: var(--bg-primary); border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); transition: var(--transition); border: 1px solid var(--border-light); }
        .pay-close-btn:hover { background: var(--danger); color: white; transform: rotate(90deg); }
        
        /* CARD VISUAL */
        .credit-card-wrapper { perspective: 1000px; width: 340px; height: 200px; margin: 0 auto 28px; }
        .credit-card-inner { position: relative; width: 100%; height: 100%; text-align: left; transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-style: preserve-3d; }
        .credit-card-inner.flipped { transform: rotateY(180deg); }
        .credit-card-front, .credit-card-back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 16px; padding: 24px; box-sizing: border-box; color: white; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 15px 35px rgba(0,0,0,0.25); background: linear-gradient(135deg, #1e293b, #0f172a); border: 1px solid rgba(255,255,255,0.08); }
        
        .credit-card-front {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        }
        .credit-card-back {
          background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%);
          transform: rotateY(180deg);
          padding: 24px 0;
        }

        .card-chip { width: 45px; height: 35px; background: linear-gradient(135deg, #fef08a, #eab308); border-radius: 6px; box-shadow: inset 0 1px 2px rgba(255,255,255,0.4); }
        .card-brand-logo { font-size: 20px; font-weight: 800; font-style: italic; letter-spacing: -1px; text-shadow: 0 2px 4px rgba(0,0,0,0.15); }
        .card-number-display { font-size: 20px; font-family: 'Courier New', Courier, monospace; letter-spacing: 2.5px; word-spacing: 2px; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .card-info-row { display: flex; justify-content: space-between; align-items: flex-end; }
        .card-lbl { font-size: 9px; text-transform: uppercase; opacity: 0.7; letter-spacing: 1px; margin-bottom: 4px; }
        .card-val { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
        
        .card-strip { width: 100%; height: 40px; background: #000; margin-top: 10px; }
        .card-signature-area { background: rgba(255,255,255,0.9); height: 32px; width: 80%; margin: 15px auto 0 20px; display: flex; align-items: center; justify-content: flex-end; padding-right: 12px; border-radius: 4px; color: #333; font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: 700; font-style: italic; }
        
        @keyframes payFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes paySlideUp { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      <div className="pay-modal">
        <button onClick={onClose} className="pay-close-btn" aria-label="Fermer" type="button"><X size={18} /></button>

        <h2 style={{ fontSize: 24, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
          <CreditCard size={24} color="var(--accent-primary)" /> Paiement de la séance
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
          Réglez vos cours en toute sécurité avec notre passerelle de paiement sécurisée.
        </p>

        {/* Détails Facturation */}
        <div style={{
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: 28,
          border: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>📚 Cours avec</div>
            <strong style={{ fontSize: 16 }}>{tutorName}</strong>
          </div>
          <div style={{ textAlignment: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>Montant à payer</div>
            <strong style={{ fontSize: 18, color: 'var(--accent-primary)' }}>{price} MAD</strong>
          </div>
        </div>

        {/* CREDIT CARD DISPLAY */}
        <div className="credit-card-wrapper">
          <div className={`credit-card-inner ${isFlipped ? 'flipped' : ''}`}>
            {/* FRONT OF THE CARD */}
            <div className="credit-card-front">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="card-chip"></div>
                <div className="card-brand-logo">
                  {cardBrand === 'visa' && 'VISA'}
                  {cardBrand === 'mastercard' && 'MasterCard'}
                  {cardBrand === 'generic' && 'CARD'}
                </div>
              </div>
              <div className="card-number-display">
                {cardNumber || '•••• •••• •••• ••••'}
              </div>
              <div className="card-info-row">
                <div>
                  <div className="card-lbl">Titulaire</div>
                  <div className="card-val">{cardHolder || 'NOM PRENOM'}</div>
                </div>
                <div>
                  <div className="card-lbl">Expire fin</div>
                  <div className="card-val">{expiry || 'MM/YY'}</div>
                </div>
              </div>
            </div>

            {/* BACK OF THE CARD */}
            <div className="credit-card-back">
              <div className="card-strip"></div>
              <div>
                <div className="card-lbl" style={{ marginLeft: 20 }}>CVV / CVC</div>
                <div className="card-signature-area">
                  {cvv || '•••'}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 24px', alignItems: 'center' }}>
                <span style={{ fontSize: 8, opacity: 0.5, letterSpacing: 0.5 }}>SECURE TRANSACTION</span>
                <span style={{ fontSize: 10, fontWeight: 700, fontStyle: 'italic' }}>SoutienLocal</span>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handlePay}>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label" style={{ fontSize: 13 }}>Nom sur la carte *</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                required 
                placeholder="EX: ALI ZNAKI" 
                className="form-input" 
                style={{ paddingLeft: 40, textTransform: 'uppercase' }}
                value={cardHolder}
                onChange={e => setCardHolder(e.target.value.toUpperCase())}
                onFocus={() => setIsFlipped(false)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label" style={{ fontSize: 13 }}>Numéro de carte *</label>
            <div style={{ position: 'relative' }}>
              <CreditCard size={16} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                required 
                placeholder="4000 1234 5678 9010" 
                className="form-input" 
                style={{ paddingLeft: 40 }}
                value={cardNumber}
                onChange={handleCardNumberChange}
                onFocus={() => setIsFlipped(false)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: 13 }}>Expiration *</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  required 
                  placeholder="MM/YY" 
                  className="form-input" 
                  style={{ paddingLeft: 40 }}
                  value={expiry}
                  onChange={handleExpiryChange}
                  onFocus={() => setIsFlipped(false)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: 13 }}>Code CVV *</label>
              <div style={{ position: 'relative' }}>
                <ShieldCheck size={16} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-secondary)' }} />
                <input 
                  type="password" 
                  required 
                  placeholder="123" 
                  className="form-input" 
                  style={{ paddingLeft: 40 }}
                  value={cvv}
                  onChange={handleCvvChange}
                  onFocus={() => setIsFlipped(true)}
                  onBlur={() => setIsFlipped(false)}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose} disabled={loading}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} disabled={loading}>
              {loading ? <><Loader size={16} className="spin-icon" /> Traitement...</> : `Payer ${price} MAD`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
