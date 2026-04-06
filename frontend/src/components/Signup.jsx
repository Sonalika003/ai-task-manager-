import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulation of Signup Logic
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);
      setLoading(false);
      navigate('/');
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Get started with AI-powered task management</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSignup}>
          <div className="form-group">
            <label>Professional Name</label>
            <div className="input-icon-wrapper">
              <User className="input-icon" size={16} />
              <input 
                type="text" 
                className="premium-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="John Doe" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Corporate Email</label>
            <div className="input-icon-wrapper">
              <Mail className="input-icon" size={16} />
              <input 
                type="email" 
                className="premium-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="name@company.com" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Create Secret Key</label>
            <div className="input-icon-wrapper">
              <Lock className="input-icon" size={16} />
              <input 
                type="password" 
                className="premium-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••" 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', display: 'flex', gap: '8px', justifyContent: 'center' }} disabled={loading}>
            {loading ? <div className="spinner"></div> : <><UserPlus size={16} /> JOIN PLATFORM</>}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? 
          <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
