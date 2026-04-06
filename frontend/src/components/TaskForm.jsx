import React, { useState } from 'react';
import api from '../services/api';
import { Type, FileText, Calendar, ShieldCheck, Plus } from 'lucide-react';

const TaskForm = ({ onTaskAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.deadline) {
      setError('Required: Title & Deadline');
      return;
    }

    setLoading(true);
    try {
      await api.post('/tasks/create', formData);
      setFormData({ title: '', description: '', deadline: '', priority: 'medium' });
      onTaskAdded(); 
    } catch (err) {
      setError('Failed during task registration. Backend reachable?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="glass-card" 
      style={{ 
        padding: '4rem', 
        marginBottom: '0', 
        backgroundImage: `linear-gradient(rgba(20, 20, 20, 0.75), rgba(20, 20, 20, 0.75)), url('/strategy_bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <header style={{ marginBottom: '2rem', position: 'relative', zIndex: 2 }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>Strategy Input</h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginTop: '4px' }}>Define your next project milestone details.</p>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="premium-input-group">
          <label style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary)' }}>Title Initiative</label>
          <div className="input-icon-wrapper">
            <Type className="input-icon" size={18} />
            <input
              type="text"
              name="title"
              className="premium-input"
              placeholder="e.g. Q2 Launch Strategy"
              value={formData.title}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="premium-input-group">
          <label style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary)' }}>Description & Context</label>
          <div className="input-icon-wrapper">
            <FileText className="input-icon" size={18} style={{ top: '1rem' }} />
            <textarea
              name="description"
              className="premium-input"
              style={{ minHeight: '100px', paddingLeft: '2.75rem' }}
              placeholder="Key deliverables and scope definitions..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="premium-input-group">
            <label style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary)' }}>Deadline Goal</label>
            <div className="input-icon-wrapper">
              <Calendar className="input-icon" size={18} />
              <input
                type="date"
                name="deadline"
                className="premium-input"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="premium-input-group">
            <label style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary)' }}>Priority Tier</label>
            <div className="input-icon-wrapper">
              <ShieldCheck className="input-icon" size={18} />
              <select
                name="priority"
                className="premium-input"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="high" style={{ color: 'var(--danger)' }}>🔴 High Velocity (Redistribute)</option>
                <option value="medium" style={{ color: 'var(--warning)' }}>🟡 Medium Momentum</option>
                <option value="low" style={{ color: 'var(--success)' }}>🟢 Low Impact (Maintenance)</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <button type="submit" className="btn-solid" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} disabled={loading}>
            {loading ? <div className="spinner"></div> : (
              <>
                <Plus size={20} />
                Initiate Task
              </>
            )}
          </button>
        </div>

        {error && <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
      </form>
    </div>
  );
};

export default TaskForm;
