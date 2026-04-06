import React, { useState } from 'react';
import api from '../services/api';
import { BrainCircuit, Sparkles, Wand2 } from 'lucide-react';

const Suggestion = () => {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSuggestion = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/tasks/suggestion');
      const message = response.data.suggestion || response.data.focusOn || response.data;
      setSuggestion(typeof message === 'object' ? JSON.stringify(message) : message);
    } catch (err) {
      setError('AI Engine offline. Please check your server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-hero" style={{ 
      padding: '4.5rem 4rem', 
      minHeight: '420px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '2rem',
      background: '#110c2e'
    }}>
      <div style={{ 
        position: 'absolute', 
        top: '-10%', left: '-10%', 
        width: '120%', height: '120%', 
        backgroundImage: `linear-gradient(rgba(17, 12, 46, 0.4), rgba(17, 12, 46, 0.4)), url('/ai_hero_bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'right center',
        filter: 'blur(12px) brightness(0.8)',
        zIndex: 1,
        pointerEvents: 'none'
      }}></div>
      <div className="ai-content" style={{ flex: '1 1 500px', zIndex: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          <Sparkles size={16} />
          Intelligence Platform
        </div>
        <h2 style={{ fontSize: '3rem', lineHeight: 1.3, margin: '1.5rem 0', fontWeight: 800, maxWidth: '600px' }}>Need a Priority Boost?</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '1.2rem', maxWidth: '480px', lineHeight: 1.6, marginBottom: '2.5rem' }}>
          Let our advanced analysis engine determine which initiative requires your immediate attention using neural-synapse prioritization.
        </p>
 
        <button onClick={fetchSuggestion} className="ai-btn" style={{ padding: '1rem 2rem', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-md)' }} disabled={loading}>
          {loading ? <div className="spinner" style={{ borderTopColor: 'white' }}></div> : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Wand2 size={20} />
              Analyze Best Focus
            </div>
          )}
        </button>
 
        {suggestion && (
          <div className="suggestion-box" style={{ 
            marginTop: '2.5rem', 
            padding: '2rem', 
            background: 'rgba(255,255,255,0.05)', 
            backdropFilter: 'blur(30px)', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid rgba(255,255,255,0.1)',
            animation: 'slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1)' 
          }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.1em' }}>Strategic AI Insight</span>
            <p style={{ fontStyle: 'normal', fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginTop: '0.75rem' }}>
              "{suggestion}"
            </p>
          </div>
        )}
 
        {error && <p style={{ color: '#fca5a5', marginTop: '2rem', fontWeight: 700 }}>{error}</p>}
      </div>
 
      <div className="ai-icon-container" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <BrainCircuit size={220} strokeWidth={0.5} style={{ opacity: 0.8, filter: 'drop-shadow(0 0 40px rgba(94, 92, 230, 0.4))' }} />
      </div>
    </div>
  );
};

export default Suggestion;
